import pandas as pd
import geopandas as geo
import numpy as np
from shared import head, capitalize
from const import districts_columns, addresses_columns
import os
import os.path as path

def process_addresses(df: pd.DataFrame, is_address: bool = False) -> pd.DataFrame:
  # Fill empty street names
  print("Filling empty street names...")
  df["street"] = np.where(df["street"].isna(), df["town"], df["street"])

  print("Removing prefixes...")
  with open("const/street_prefixes.txt") as prefixes_file:
    prefixes = [f"^{line.strip()}\\.? " for line in prefixes_file.readlines()]
  prefixes_regex = "|".join(prefixes)
  df["street"] = df["street"].str.replace(prefixes_regex, "", regex=True, case=False)

  # Remove redundant spaces
  print("Removing redundant spaces...")
  df["street"] = df["street"].str.strip().replace(r"\s+", " ", regex=True)

  # Normalize street names
  print("Normalizing street names...")
  df["street"] = df["street"].map(capitalize)
  with open("const/street_replacements.csv") as replacements_file:
    replacements = [line.strip().split(";") for line in replacements_file.readlines()]
  replacements = dict(zip([x[0] for x in replacements], [x[1] for x in replacements]))
  for search in replacements:
    df["street"] = df["street"].str.replace(search, replacements[search], case=False)
  # Remove duplicate street types
  df["street"] = df["street"].str.replace(r"^(\S+)\s+\1", r"\1", regex=True)

  # Normalize building numbers
  print("Normalizing building numbers...")
  df["building"] = df["building"].str.lower()
  df["building"] = df["building"].str.replace(r"(\d+)\s+(\w+)$", r"\1\2", regex=True)
  # Remove multiple building numbers
  df["building"] = df["building"].str.replace(r"(\w*)\s?[,-/]\s?(\w*\s?[,-/]\s?)*\w*", r"\1", regex=True)
  # Remove any comments from building number
  df["building"] = df["building"].str.replace(r"(\d+\w*)(\s+.+)$", r"\1", regex=True)

  df["f_address"] = df[["teryt", "town", "street", "building"]].agg(" ".join, axis=1)
  if (is_address):
    df = df.drop_duplicates(subset=["f_address"])
  return df

def process_data():
  print("Loading voting districts...")
  districts = pd.read_excel("data_in/districts.xlsx", converters={ "TERYT gminy": str })
  districts = districts[[key for key in districts_columns]].rename(columns=districts_columns)
  districts = districts[~districts["teryt"].isna()]
  print("Processing districts...")
  districts = process_addresses(districts)
  districts.to_excel("data_processed/districts.xlsx", index=False)
  print("Address points saved!")

  print("Loading address points...")
  addresses_path = "data_processed/addresses"
  if (not path.exists(addresses_path)):
      os.mkdir(addresses_path)

  for i in range(1):
    teryt = str((i + 1) * 2)
    teryt = teryt.rjust(2, "0")
    print(f"Loding data for voivodeship {teryt}...")
    addresses = geo.read_file(f"data_in/addresses/{teryt}.zip!PRG_PunktyAdresowe_{teryt}.shp")
    addresses = addresses[[key for key in addresses_columns]].rename(columns=addresses_columns)
    print(f"Processing data for voivodeship {teryt}...")
    addresses = process_addresses(addresses, True)
    addresses.to_file(f"{addresses_path}/{teryt}.shz", driver="ESRI Shapefile")
    os.rename(f"{addresses_path}/{teryt}.shz", f"{addresses_path}/{teryt}.zip")

if (__name__ == "__main__"):
  process_data()
