import geopandas as geo
import pandas as pd
from utils import concat, get_election_id
from const import results_columns, candidates
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
    district_addresses = geo.GeoDataFrame(geometry=voronoi, crs=district_addresses.crs).sjoin(district_addresses, predicate="covers")
    districts_df = concat(district_addresses, districts_df)
    processed_districts += 1

  districts_df = districts_df.reset_index()
  print(f"Found {len(unused_ids)} districts with no address points!")
  unused_districts = teryt_districts[teryt_districts["OBWOD"].isin(unused_ids)][["geometry", "OBWOD"]]
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
    teryts = addresses["teryt"].drop_duplicates()
    for teryt in teryts:
      teryt_addresses = addresses[addresses["teryt"] == teryt]
      teryt_addresses_to_skip = addresses_to_skip[addresses_to_skip["teryt"] == teryt]["f_address"].to_list()
      teryt_addresses = teryt_addresses[~teryt_addresses["f_address"].isin(teryt_addresses_to_skip)]
      teryt_forced_districts = forced_districts[forced_districts["teryt"] == teryt]
      processed_districts = process_teryt(teryt, teryt_addresses, districts, teryt_forced_districts)
      districts_df = concat(districts_df, processed_districts)

  print("Loading voting results...")
  results = pd.read_csv(f"data_in/results_{elections}.csv", sep=";", converters={ "Teryt Gminy": lambda x: x.zfill(6), "TERYT Gminy": lambda x: x.zfill(6) })
  merged_columns = { **results_columns, **candidates }
  results = results.rename(columns=merged_columns)

  candidates_columns = [candidates[key] for key in candidates]
  candidates_columns = list(filter(lambda key: key in results, candidates_columns))
  candidates_columns = list(dict.fromkeys(candidates_columns))
  merged_columns = filter(lambda key: key in results, [merged_columns[key] for key in merged_columns])
  merged_columns = list(merged_columns)
  tmp_merged_columns = []
  for key in merged_columns:
    if (key not in tmp_merged_columns):
      tmp_merged_columns.append(key)
  merged_columns = tmp_merged_columns
  proc_columns = [name + "_proc" for name in candidates_columns]

  results = results[merged_columns]
  results = results[results["teryt"] != "000000"]
  results["gmina"] = results.apply(lambda row: re.sub(r"^m\.\s+", "", row.gmina) if re.match(r"^g?m\.", row.gmina) else row.powiat, axis=1)
  results["district"] = results.apply(lambda row: f"{row.teryt}_{row.number}", axis=1)
  # pd.DataFrame.idxmax doesn't show ties
  results["winner"] = results[candidates_columns].apply(get_winner, axis=1)
  for name in candidates_columns:
    results[name + "_proc"] = results[name] * 100 / results["total"]
    results[name + "_proc"] = results[name + "_proc"].fillna(0)
  results["winner_proc"] = results[candidates_columns].max(axis=1) * 100 / results["total"]
  results["winner_proc"] = results["winner_proc"].fillna(0)
  results["turnout"] = results["all_votes"] * 100 / results["voters"]

  print("Merging results with districts...")
  districts_df = districts_df.reset_index(names="district")
  districts_df = districts_df[["district", "geometry"]]
  districts_df = districts_df.merge(results, on="district")
  districts_df = districts_df[[*merged_columns, *proc_columns, "winner", "winner_proc", "turnout", "district", "geometry"]]
  districts_df = districts_df.round(2)
  districts_df = districts_df.to_crs("EPSG:4326")

  print("Winners:", districts_df["winner"].drop_duplicates().to_list())
  print("Saving data...")
  districts_path = f"districts/{elections}"
  if (not path.exists(districts_path)):
    os.mkdir(districts_path)

  for i in range(16):
    woj_teryt = str((i + 1) * 2).rjust(2, "0")
    woj_districts = districts_df[districts_df["teryt"].str.startswith(woj_teryt)]
    woj_districts.to_file(f"{districts_path}/{woj_teryt}.json", driver="GeoJSON")

if (__name__ == "__main__"):
  main()
