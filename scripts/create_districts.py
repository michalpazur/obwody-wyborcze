import geopandas as geo
import pandas as pd
from utils import concat, head
from const import results_columns, candidates
import re
import os

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

def process_teryt(teryt: str, addresses: geo.GeoDataFrame, districts_df: geo.GeoDataFrame):
  print(f"Processing districts for TERYT {teryt}...")
  addresses = addresses[addresses["teryt"] == teryt]
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
  
  processed_districts = 0
  for i, row in teryt_districts.iterrows():
    if (processed_districts != 0 and processed_districts % 50 == 0):
      print(f"Processed {processed_districts} out of {len(teryt_districts)} statistical districts...")
    geom = row.geometry
    district_addresses = addresses[addresses.geometry.covered_by(geom)]
    if (len(district_addresses) == 0):
      unused_ids.append(row.OBWOD)
      continue
    vornoroi = district_addresses.voronoi_polygons(extend_to=geom).clip(geom)
    district_addresses = geo.GeoDataFrame(geometry=vornoroi, crs=district_addresses.crs).sjoin(district_addresses, predicate="covers")
    districts_df = concat(district_addresses, districts_df)
    processed_districts += 1

  districts_df = districts_df.reset_index()
  print(f"Found {len(unused_ids)} districts with no address points!")
  unused_districts = teryt_districts[teryt_districts["OBWOD"].isin(unused_ids)]
  for i, row in unused_districts.iterrows():
    touching = districts_df[districts_df["geometry"].intersects(row.geometry)]
    touching["distance"] = touching.geometry.centroid.distance(row.geometry.centroid)
    touching = touching.sort_values(by=["distance"]).iloc[0]
    districts_df.loc[touching.name, "geometry"] = touching.geometry.union(row.geometry)

  districts_df.geometry = districts_df.geometry.buffer(1)
  districts_df = districts_df.dissolve(by="district")
  districts_df.geometry = districts_df.geometry.buffer(-1)
  return districts_df

elections = "pres_2025_2"

def main():
  districts_df: geo.GeoDataFrame | None = geo.GeoDataFrame()
  districts = geo.read_file(f"data_in/statistical_districts.zip")
  districts["TERYT"] = districts["TERYT"].str[:-1]

  file_names = list(filter(lambda x: x.endswith(".zip"), os.listdir("matched_addresses")))

  for file_name in file_names:
    addresses = geo.read_file(f"matched_addresses/{file_name}")
    teryts = addresses["teryt"].drop_duplicates()
    for teryt in teryts:
      processed_districts = process_teryt(teryt, addresses, districts)
      districts_df = concat(districts_df, processed_districts)

  print("Loading voting results...")
  results = pd.read_csv(f"data_in/results_{elections}.csv", sep=";", converters={ "Teryt Gminy": lambda x: x.zfill(6) })
  merged_columns = { **results_columns, **candidates }
  results = results.rename(columns=merged_columns)

  canidates_columns = [candidates[key] for key in candidates]
  canidates_columns = list(filter(lambda key: key in results, canidates_columns))
  merged_columns = filter(lambda key: key in results, [merged_columns[key] for key in merged_columns])
  merged_columns = list(merged_columns)
  tmp_merged_columns = []
  for key in merged_columns:
    if (key not in tmp_merged_columns):
      tmp_merged_columns.append(key)
  merged_columns = tmp_merged_columns
  proc_columns = [name + "_proc" for name in canidates_columns]

  results = results[merged_columns]
  results = results[results["teryt"] != "000000"]
  results["gmina"] = results.apply(lambda row: row.gmina if row.gmina.startswith(r"g?m\.") else "m. " + row.powiat, axis=1)
  results["district"] = results.apply(lambda row: f"{row.teryt}_{row.number}", axis=1)
  # pd.DataFrame.idxmax doesn't show ties
  results["winner"] = results[canidates_columns].apply(get_winner, axis=1)
  for name in canidates_columns:
    results[name + "_proc"] = results[name] * 100 / results["total"]
  results["winner_proc"] = results[canidates_columns].max(axis=1) * 100 / results["total"]
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
  districts_df.to_file(f"districts/{elections}.json", driver="GeoJSON")

if (__name__ == "__main__"):
  main()
