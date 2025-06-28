import pandas as pd
import geopandas as geo
import json

districts = pd.read_excel("data_processed/districts.xlsx", converters={ "teryt": str })

for i in range(16):
  teryt = str((i + 1) * 2)
  teryt = teryt.rjust(2, "0")
  print(teryt)
  tmp_districts = districts[districts["teryt"].str.startswith(teryt)]
  print(f"{len(tmp_districts)} out of {len(districts)}")
  addresses = geo.read_file(f"data_processed/addresses/{teryt}.zip")
  addresses = addresses.merge(tmp_districts, on="f_address", how="right")
  empty = addresses[addresses["teryt_x"].isna()]
  print(f"Empty: {len(empty)}/{len(addresses)}.")
  addresses.to_file(f"geocoded/{teryt}.json", driver="GeoJSON")
  empty.to_file(f"geocoded/empty_{teryt}.json", driver="GeoJSON")
