import pandas as pd
import geopandas as geo
import numpy as np
from utils import load_replacements, capitalize
from const import districts_columns, addresses_columns
import os
import os.path as path
import re

def process_addresses(df: pd.DataFrame | geo.GeoDataFrame, column_names: dict[str, str], is_addresses: bool = False) -> pd.DataFrame:
  # Fill empty street names
  print("Filling empty street names...")
  df["street"] = np.where(df["street"].isna(), df["town"], df["street"])

  print("Removing prefixes...")
  with open("const/street_prefixes.txt") as prefixes_file:
    prefixes = [f"^{line.strip()}\\.? " for line in prefixes_file.readlines()]
  prefixes_regex = "|".join(prefixes)
  df["street"] = df["street"].str.replace(prefixes_regex, "", regex=True, flags=re.IGNORECASE)

  # Remove redundant spaces
  print("Removing redundant spaces...")
  df["street"] = df["street"].str.strip().replace(r"\s+", " ", regex=True)

  # Normalize street names
  print("Normalizing street names...")
  df["street"] = df["street"].map(capitalize)
  replacements = load_replacements()
  for search in replacements:
    df["street"] = df["street"].str.replace(search, replacements[search], case=False)
  # Remove duplicate street types
  df["street"] = df["street"].str.replace(r"^(\S+)\s+\1", r"\1", regex=True)
  # Normalize quotes in street names
  df["street"] = df["street"].str.replace(r'[„"](.+)[”"]', r'"\1"', regex=True)

  # Normalize building numbers
  print("Normalizing building numbers...")
  df["building"] = df["building"].str.lower()
  df["building"] = df["building"].str.replace(r"(\d+)\s+(\w+)$", r"\1\2", regex=True)
  # Remove multiple building numbers
  df["building"] = df["building"].str.replace(r"(\w*)\s?[,-/]\s?(\w*\s?[,-/]\s?)*\w*", r"\1", regex=True)
  # Remove any comments from building number
  df["building"] = df["building"].str.replace(r"(\d+\w*)(\s+.+)$", r"\1", regex=True)
  # Remove "number" from  building numer
  df["building"] = df["building"].str.replace(r"(nr\.?|numer)\s+(\d+\w*)$", r"\2", regex=True)
  # Split building numbers into parts
  df["building_n"] = df["building"].str.replace(r"(\d+)\w*$", r"\1", regex=True)
  df["building_l"] = df["building"].str.replace(r"\d+(\w*)$", r"\1", regex=True)

  if (isinstance(df, geo.GeoDataFrame)):
    print("Updating TERYT based on spatial data...")
    gminy = geo.read_file("data_in/gminy_dzielnice.json")
    gminy.crs = "EPSG:3857"
    gminy = gminy.to_crs(df.crs)
    df = df.sjoin(gminy, predicate="within")
    df = df.rename(columns={ "teryt_right": "teryt" })
    df = df[[column_names[key] for key in column_names]]

  df["f_address"] = df[["teryt", "town", "street", "building"]].agg(" ".join, axis=1)
  if (is_addresses):
    df = df.drop_duplicates(subset=["f_address"])
  return df

def process_data():
  print("Loading voting districts...")
  districts = pd.read_excel("data_in/districts.xlsx", converters={ "TERYT gminy": str })
  districts = districts[[key for key in districts_columns]].rename(columns=districts_columns)
  districts = districts[~districts["teryt"].isna()]
  print("Processing districts...")
  districts = process_addresses(districts, districts_columns)
  districts.to_csv("data_processed/districts.csv", index=False, sep="|", encoding="utf-8")
  print("Address points saved!")

  print("Loading address points...")
  addresses_path = "data_processed/addresses"
  if (not path.exists(addresses_path)):
      os.mkdir(addresses_path)

  for i in range(16):
    teryt = str((i + 1) * 2)
    teryt = teryt.rjust(2, "0")
    print(f"Loading data for voivodeship {teryt}...")
    # For some reason every single file has a different enconding, i.e. CP-1250, UTF-16, or UTF-8, which is not detected properly, in case of woj. podlaskie
    addresses = geo.read_file(f"data_in/addresses/{teryt}.zip!PRG_PunktyAdresowe_{teryt}.shp", encoding="utf-8" if teryt == "20" else None)
    addresses = addresses[[key for key in addresses_columns]].rename(columns=addresses_columns)
    print(f"Processing data for voivodeship {teryt}...")
    addresses = process_addresses(addresses, addresses_columns, True)
    addresses.to_file(f"{addresses_path}/{teryt}.shz", driver="ESRI Shapefile")
    os.rename(f"{addresses_path}/{teryt}.shz", f"{addresses_path}/{teryt}.zip")

if (__name__ == "__main__"):
  process_data()
