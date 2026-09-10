import geopandas as geo
import pandas as pd
import numpy as np
from df_utils import filter_columns, remove_columns, load_results, get_results_columns, sort_by_district
from utils import get_election_id
from geo_utils import concat
from const import default_crs
import uuid
import os
from os import path
import re

pd.options.mode.copy_on_write = True

# We only have TERYT for districts in Warsaw, however Wrocław, Łódź, Kraków and Poznań have separate TERYTs in their statistical districts
towns_with_districts = ["0264", "1061", "1261", "3064"]

def get_winner(row: pd.Series):
  max_ = -1
  max_name = ""
  for key in row.index.to_list():
    value = row[key]
    if (value > max_):
      max_ = value
      max_name = key
    elif (value == max_):
      max_name = "tie"

  return max_name

def prepare_results(results: geo.GeoDataFrame, candidates_columns: list[str]):
  results[candidates_columns] = results[candidates_columns].replace(0, np.nan)
  # pd.DataFrame.idxmax doesn't show ties
  results["winner"] = results[candidates_columns].apply(get_winner, axis=1)
  for name in candidates_columns:
    results[name + "_proc"] = results[name] * 100 / results["total"]
    results[name + "_proc"] = results[name + "_proc"].fillna(0)
  results["winner_proc"] = results[candidates_columns].max(axis=1) * 100 / results["total"]
  results["winner_proc"] = results["winner_proc"].fillna(0)
  results["turnout"] = results["all_votes"] * 100 / results["voters"]
  results = results.round(2)

  return results

def save_districts_df(districts_df: geo.GeoDataFrame, districts_path: str):
  if (not path.exists(districts_path)):
      os.mkdir(districts_path)

  districts_df = sort_by_district(districts_df)
  for i in range(16):
      woj_teryt = str((i + 1) * 2).rjust(2, "0")
      woj_districts = districts_df[districts_df["teryt"].str.startswith(woj_teryt)]
      woj_districts.to_file(f"{districts_path}/{woj_teryt}.json", driver="GeoJSON")

def process_teryt(teryt: str, addresses: geo.GeoDataFrame, districts_df: geo.GeoDataFrame, forced_districts: pd.DataFrame):
  print(f"Processing districts for TERYT {teryt}...")
  has_extra_teryts = False
  for town in towns_with_districts:
    if (teryt.startswith(town)):
      has_extra_teryts = True
      break

  if (has_extra_teryts):
    teryt_districts = districts_df[districts_df["TERYT"].str.startswith(teryt[:-1])]
  else:
    teryt_districts = districts_df[districts_df["TERYT"] == teryt]
  districts_df = geo.GeoDataFrame()
  empty_voronoi = geo.GeoDataFrame()
  unused_ids = []
  forced_districts_ids = forced_districts["district_id"].to_list()
  
  processed_districts = 0
  for i, row in teryt_districts.iterrows():
    if (processed_districts != 0 and processed_districts % 50 == 0):
      print(f"Processed {processed_districts} out of {len(teryt_districts)} statistical districts...")
    geom = row.geometry
    district_addresses = addresses[addresses.geometry.covered_by(geom)]
    if (len(district_addresses) == 0 or row.OBWOD in forced_districts_ids):
      unused_ids.append(row.OBWOD)
      continue

    voronoi = district_addresses.voronoi_polygons(extend_to=geom).clip(geom)
    exploded = voronoi.explode()

    exploded_df = geo.GeoDataFrame(geometry=exploded, crs=district_addresses.crs)
    exploded_df["id"] = exploded_df.apply(lambda x: str(uuid.uuid4()), axis=1)
    district_addresses = exploded_df.sjoin(district_addresses, predicate="covers")
    district_empty = exploded_df[~exploded_df["id"].isin(district_addresses["id"])]
  
    districts_df = concat(district_addresses, districts_df)
    empty_voronoi = concat(district_empty, empty_voronoi)
    processed_districts += 1

  districts_df = districts_df.reset_index()
  print(f"Found {len(unused_ids) + empty_voronoi.size} shapes with no address points!")
  unused_districts = teryt_districts[teryt_districts["OBWOD"].isin(unused_ids)][["geometry", "OBWOD"]]
  target_crs = teryt_districts.crs if teryt_districts.crs is not None else default_crs
  unused_districts = concat(empty_voronoi.to_crs(target_crs), unused_districts)

  for i, row in unused_districts.iterrows():
    if (row["OBWOD"] in forced_districts_ids):
      forced_info = forced_districts[forced_districts["district_id"] == row["OBWOD"]].iloc[0]
      row["district"] = f"{teryt}_{forced_info["district"]}"
      district_df = geo.GeoDataFrame([row], geometry=[row.geometry], crs=districts_df.crs)
      districts_df = concat(district_df, districts_df)
      continue

    touching = districts_df[districts_df["geometry"].intersects(row.geometry)]
    touching["distance"] = touching.geometry.centroid.distance(row.geometry.centroid)
    if (len(touching) > 0):
      touching = touching.sort_values(by=["distance"]).iloc[0]
    else:
      touching = districts_df.copy()
      touching["distance"] = touching.geometry.centroid.distance(row.geometry.centroid)
      touching = touching.sort_values(by=["distance"]).iloc[0]
    districts_df.loc[touching.name, "geometry"] = touching.geometry.union(row.geometry)

  districts_df.geometry = districts_df.geometry.buffer(1, cap_style="flat", join_style="bevel")
  districts_df = districts_df.dissolve(by="district")
  districts_df.geometry = districts_df.geometry.make_valid(method="structure")
  return districts_df

elections = "pres_2025_1"
geometry_only = False

def main():
  districts_df: geo.GeoDataFrame | None = geo.GeoDataFrame()
  districts = geo.read_file(f"data_in/statistical_districts.zip")
  addresses_to_skip = pd.read_csv("const/addresses_to_skip.csv", sep=";", converters={ "teryt": str })
  forced_districts = pd.read_csv("const/forced_districts.csv", sep=";", converters={ "teryt": str, "district_id": str })
  election_id = get_election_id(elections)
  forced_districts = forced_districts[forced_districts["elections"] == election_id]
  forced_districts_ids = forced_districts["district_id"].tolist()
  districts["TERYT"] = districts["TERYT"].str[:-1]
  not_forced = ~districts["OBWOD"].isin(forced_districts_ids)
  districts.loc[not_forced, "OBWOD"] = districts[not_forced]["OBWOD"].apply(lambda x: str(uuid.uuid4()))
  file_names = list(sorted(filter(lambda x: x.endswith(".zip"), os.listdir("matched_addresses"))))

  for file_name in file_names:
    addresses = geo.read_file(f"matched_addresses/{file_name}")
    try:
      # Getting empty GeoDataFrame CRS raises AttributeError
      target_crs = districts_df.crs if districts_df.crs is not None else default_crs
    except:
      target_crs = default_crs
    addresses = addresses.to_crs(target_crs)
    teryts = addresses["teryt"].drop_duplicates()
    for teryt in teryts:
      teryt_addresses = addresses[addresses["teryt"] == teryt]
      teryt_addresses_to_skip = addresses_to_skip[addresses_to_skip["teryt"] == teryt]["f_address"].to_list()
      teryt_addresses = teryt_addresses[~teryt_addresses["f_address"].isin(teryt_addresses_to_skip)]
      teryt_forced_districts = forced_districts[forced_districts["teryt"] == teryt]
      processed_districts = process_teryt(teryt, teryt_addresses, districts, teryt_forced_districts)
      districts_df = concat(districts_df, processed_districts)

  districts_df = districts_df.reset_index(names="district")
  districts_df = districts_df[["district", "geometry"]]
  districts_path = f"districts/{elections}"
  districts_info = pd.read_csv(f"data_processed/districts_{election_id}.csv", sep="|", converters={ "teryt": str })
  districts_info["voters"] = pd.to_numeric(districts_info["voters"], downcast="integer")
  districts_df = districts_df.merge(districts_info, on="district")
  districts_df["gmina"] = districts_df.apply(lambda row: re.sub(r"^m\.\s+", "", row.gmina), axis=1)
  districts_df_columns = ["gmina", "powiat", "voivodeship", "district", "teryt", "number", "constituency", "voters", "geometry"]
  districts_df = filter_columns(districts_df, districts_df_columns)
  districts_df = districts_df.to_crs("EPSG:4326")

  if (geometry_only):
    print("Saving districts geometry...")
    districts_df["counted"] = False
    save_districts_df(districts_df, districts_path)
    return

  print("Loading voting results...")
  results = load_results(elections)
  merged_columns, candidates_columns, proc_columns = get_results_columns(results)
  results = remove_columns(results, ["teryt", "number"])
  # Final voters count will be pulled from results as it can change throughout the day
  districts_df = remove_columns(districts_df, ["voters"])

  print("Merging results with districts...")
  districts_df_columns.extend(merged_columns)
  districts_df_columns.extend(proc_columns)
  districts_df_columns.extend(["winner", "winner_proc", "turnout"])
  # TODO: include results with no matching geometry (ie. some hospitals and districts abroad)
  districts_df = districts_df.merge(results, on="district")
  districts_df = prepare_results(districts_df, candidates_columns)
  districts_df["counted"] = True
  districts_df = filter_columns(districts_df, districts_df_columns)

  print("Winners:", districts_df["winner"].drop_duplicates().to_list())
  print("Saving data...")
  save_districts_df(districts_df, districts_path)

  print("Saving gmina shapes...")
  gminy_columns = ["gmina", "powiat", "voivodeship", "constituency", "geometry"]
  gminy_columns = filter(lambda key: key in districts_df_columns, gminy_columns)
  gminy_columns = list(gminy_columns)

  gminy_shapes = districts_df.dissolve(by="teryt").reset_index()
  gminy_shapes = filter_columns(gminy_shapes, [*gminy_columns, "teryt"])
  gminy_results = districts_df.dissolve(by="teryt", aggfunc="sum").reset_index()
  gminy_results = prepare_results(gminy_results, candidates_columns)
  gminy_results = remove_columns(gminy_results, [*gminy_columns, "district", "number"])
  gminy = gminy_shapes.merge(gminy_results, on="teryt")
  gminy.to_file(f"{districts_path}/gminy.json", driver="GeoJSON")

  if ("constituency" in districts_df):
    print("Saving constituency shapes...")
    constituencies = districts_df.dissolve(by="constituency", aggfunc="sum").reset_index()
    constituencies = prepare_results(constituencies, candidates_columns)
    # TODO: display voivodeship name in constituency
    constituencies = constituencies.drop(columns=["gmina", "powiat", "voivodeship", "teryt", "district", "number"])
    constituencies.to_file(f"{districts_path}/constituencies.json")

if (__name__ == "__main__"):
  main()
