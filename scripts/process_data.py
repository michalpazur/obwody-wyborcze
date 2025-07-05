import pandas as pd
import geopandas as geo
import numpy as np
from utils import load_replacements, load_street_prefixes, capitalize, save_zip, concat, Utils, get_building_order
from const import districts_columns, addresses_columns, streets_columns, building_num_regex, building_letter_regex, ordinal_regex
from typing import TypeVar
import os
import os.path as path
import re

T = TypeVar("T", pd.DataFrame, geo.GeoDataFrame)

def process_addresses(df: T, column_names: dict[str, str], is_addresses: bool = False) -> T:
  utils = Utils()
  # Fill empty street names
  print("Filling empty street names...")
  df["street"] = np.where(df["street"].isna(), df["town"], df["street"])

  print("Removing prefixes...")
  street_prefixes = load_street_prefixes()
  for search in street_prefixes:
    df["street"] = df["street"].str.replace(search, street_prefixes[search], regex=True, flags=re.IGNORECASE)

  print("Removing names from street names...")
  df["street"] = df["street"].apply(utils.remove_first_name)
  df["street"] = df["street"].apply(utils.remove_first_letter)

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
  df["street"] = df["street"].str.replace("´", "'")
  # Remove ordinals (i.e. Mieszka I-go -> Mieszka I)
  df["street"] = df["street"].str.replace(ordinal_regex, "", regex=True)

  has_building_numbers = "building" in df
  if (has_building_numbers):
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
    df["building_n"] = df["building"].str.replace(building_num_regex, r"\2", regex=True)
    df["building_l"] = df["building"].str.replace(building_letter_regex, r"\1", regex=True)
    # Assign building order
    df["building_o"] = df.apply(lambda row: get_building_order(row["building_n"], row["building_l"]), axis=1)

  if (has_building_numbers and isinstance(df, geo.GeoDataFrame)):
    print("Updating TERYT based on spatial data...")
    gminy = geo.read_file("data_in/gminy_dzielnice.json")
    gminy.crs = "EPSG:3857"
    gminy = gminy.to_crs(df.crs)
    df = df.sjoin(gminy, predicate="within")
    df = df.rename(columns={ "teryt_right": "teryt" })
    df = df[[*[column_names[key] for key in column_names], *["building_n", "building_l"]]]

  if (has_building_numbers):
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
  streets_path = "data_processed/streets"
  if (not path.exists(streets_path)):
      os.mkdir(streets_path)

  for i in range(16):
    teryt = str((i + 1) * 2)
    teryt = teryt.rjust(2, "0")
    print(f"Loading data for voivodeship {teryt}...")
    addresses = geo.read_file(f"data_in/addresses/{teryt}.zip!PRG_PunktyAdresowe_{teryt}.shp")
    addresses = addresses[[key for key in addresses_columns]].rename(columns=addresses_columns)
    print(f"Processing data for voivodeship {teryt}...")
    addresses = process_addresses(addresses, addresses_columns, True)
    save_zip(f"{addresses_path}/{teryt}", addresses)

    print(f"Loading streets for voivodeship {teryt}...")
    streets = geo.read_file(f"data_in/addresses/{teryt}.zip!PRG_Ulice_{teryt}.shp")
    squares = geo.read_file(f"data_in/addresses/{teryt}.zip!PRG_Place_{teryt}.shp")
    streets = concat(streets, squares)
    streets = streets[[key for key in streets_columns]].rename(columns=streets_columns)
    print(f"Processing streets for voivodeship {teryt}...")
    streets = process_addresses(streets, streets_columns, False)
    save_zip(f"{streets_path}/{teryt}", streets)

if (__name__ == "__main__"):
  process_data()
