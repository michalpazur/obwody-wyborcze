import geopandas as geo
from utils import concat, save_zip
import os
import numpy as np

def process_teryt(teryt: str, addresses: geo.GeoDataFrame, districts_df: geo.GeoDataFrame):
  print(f"Processing districts for TERYT {teryt}...")
  addresses = addresses[addresses["teryt"] == teryt]
  teryt_districts = districts_df[districts_df["TERYT"] == teryt]
  districts_df = geo.GeoDataFrame()
  unused_ids = []
  
  for i, row in teryt_districts.iterrows():
    geom = row.geometry
    district_addresses = addresses[addresses.geometry.covered_by(geom)]
    if (len(district_addresses) == 0):
      unused_ids.append(row.OBWOD)
      continue
    vornoroi = district_addresses.voronoi_polygons(extend_to=geom).clip(geom)
    district_addresses = geo.GeoDataFrame(geometry=vornoroi, crs=district_addresses.crs).sjoin(district_addresses, predicate="covers")
    districts_df = concat(district_addresses, districts_df)

  districts_df = districts_df.reset_index()
  print(f"Found {len(unused_ids)} districts with no address points!")
  unused_districts = teryt_districts[teryt_districts["OBWOD"].isin(unused_ids)]
  for i, row in unused_districts.iterrows():
    touching = districts_df[districts_df["geometry"].touches(row.geometry)]
    touching["distance"] = touching.geometry.centroid.distance(row.geometry.centroid)
    touching = touching.sort_values(by=["distance"]).iloc[0]
    districts_df.loc[touching.name, "geometry"] = touching.geometry.union(row.geometry)

  districts_df.geometry = districts_df.geometry.buffer(1)
  districts_df = districts_df.dissolve(by="district")
  districts_df.geometry = districts_df.geometry.buffer(-1)
  return districts_df

def main():
  districts_df: geo.GeoDataFrame | None = geo.GeoDataFrame()
  districts = geo.read_file(f"data_in/statistical_districts.zip")

  file_names = list(filter(lambda x: x.endswith(".zip"), os.listdir("matched_addresses")))

  for file_name in file_names:
    addresses = geo.read_file(f"matched_addresses/{file_name}")
    teryts = addresses["teryt"].drop_duplicates()
    for teryt in teryts:
      processed_districts = process_teryt(teryt, addresses, districts)
      districts_df = concat(districts_df, processed_districts)
      
  districts_df["votes"] = np.random.randint(0, 1000, size=(len(districts_df), 1)) / 1000
  districts_df = districts_df.to_crs("EPSG:4326")
  districts_df.to_file("districts/districts.json", driver="GeoJSON")

if (__name__ == "__main__"):
  main()
