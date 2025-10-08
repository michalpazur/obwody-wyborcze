import pandas as pd
import geopandas as geo
import numpy as np
from utils import load_replacements, load_replacements_exceptions, load_street_prefixes, capitalize_every_word, save_zip, concat, Utils, get_building_order
from const import districts_columns, addresses_columns, streets_columns, towns_columns, building_num_regex, building_letter_regex, ordinal_regex, quotation_regex, multiple_number_regex, dash_regex, apostrophe_regex
from typing import TypeVar, cast
import os
import os.path as path
import re

T = TypeVar("T", pd.DataFrame, geo.GeoDataFrame)

def get_building_number(row: pd.Series):
  match = re.search(building_num_regex, row["building"])
  if (match):
    return match.group(2)
  return ""

def get_building_letter(row: pd.Series):
  match = re.search(building_letter_regex, row["building"])
  if (match):
    return match.group(1)
  return ""

def handle_replacements(row: pd.Series, replacements: dict[str, str]):  
  street = row.street
  for search in replacements:
    street = re.sub(search, replacements[search], street, flags=re.IGNORECASE)
  return street

def handle_name_replacements(row: pd.Series, utils: Utils):
  return utils.remove_first_name(row.street)

def add_street_type(row: pd.Series):
  if (re.match(r"^Rynek", row.street, flags=re.IGNORECASE)):
    return row.street

  if (row.str_type == "Plac" and not row.street.lower().startswith("plac")):
    return "plac " + row.street
  
  return row.street

def process_addresses(df: T, column_names: dict[str, str], is_addresses: bool = False) -> T:
  utils = Utils()
  # Fill empty street names
  print("Filling empty street names...")
  df["street"] = np.where(df["street"].isna(), df["town"], df["street"])

  print("Removing prefixes...")
  street_prefixes = load_street_prefixes()
  for search in street_prefixes:
    df["street"] = df["street"].str.replace(search, street_prefixes[search], regex=True, flags=re.IGNORECASE)
  print("Removed prefixes!")

  # Normalize street names
  print("Normalizing street names...")
  replacements = load_replacements()
  exceptions = load_replacements_exceptions()
  except_addresses = df.merge(exceptions, on=["teryt", "street"], how="inner")
  df = df.merge(exceptions, on=["teryt", "street"], how="left", indicator=True).query("_merge == 'left_only'").drop("_merge", axis=1)
  df["street"] = df.apply(lambda row: handle_replacements(row, replacements), axis=1)
  print("Replaced values in street names!")
  print("Removing names from street names...")
  df["street"] = df.apply(lambda row: handle_name_replacements(row, utils), axis=1)
  df = cast(T, pd.concat([df, except_addresses]))
  df["street"] = df["street"].apply(utils.remove_first_letter)
  print("Removed names from street names!")
  # Remove duplicate tokens
  df["street"] = df["street"].str.replace(r"(^|\s+)(.+)\s+((\S+\s+)*)\2(\s+(.+)|$)", r"\3 \2 \5", regex=True)
  # Normalize quotes in street names
  df["street"] = df["street"].str.replace(quotation_regex, r'"\1"', regex=True)
  df["street"] = df["street"].str.replace(apostrophe_regex, "'", regex=True)
  # Normalize hyphens in street names
  df["street"] = df["street"].str.replace(dash_regex, "-", regex=True)
  df["street"] = df["street"].str.replace(r"\s+-\s+", "-", regex=True)
  # Add street type from ULIC
  if ("str_type" in df):
    df["street"] = df.apply(add_street_type, axis=1)
  # Remove ordinals (i.e. Mieszka I-go -> Mieszka I)
  df["street"] = df["street"].str.replace(ordinal_regex, "", regex=True)
  # Capitalize every letter
  df["street"] = df["street"].map(capitalize_every_word)
  # Remove street type e.g. Aleja Generała Maczka -> Generała Maczka
  df["no_type"] = df["street"].apply(utils.remove_street_type)
  # Remove custom replacements e.g. Aleja Generała Maczka -> Aleja Maczka
  df["no_repl"] = df["street"].apply(utils.remove_replacements)
  # Remove street type as well e.g. Aleja Generała Maczka -> Maczka
  df["no_rep_typ"] = df["no_repl"].apply(utils.remove_street_type)

  # Remove redundant spaces
  print("Removing redundant spaces...")
  df["street"] = df["street"].str.strip().replace(r"\s+", " ", regex=True)

  has_building_numbers = "building" in df
  if (has_building_numbers):
    # Normalize building numbers
    print("Normalizing building numbers...")
    df["building"] = df["building"].str.lower()
    df["building"] = df["building"].str.replace(r"(\d+)\s+(\w+)$", r"\1\2", regex=True)
    df["building"] = df["building"].str.replace(r"[_\"]", "", regex=True)
    # Remove multiple building numbers
    df["building"] = df["building"].str.replace(multiple_number_regex, r"\1", regex=True)
    # Remove any comments from building number
    df["building"] = df["building"].str.replace(r"(\d+\w*)(\s+.+)$", r"\1", regex=True)
    # Treat empty address as zero
    df["building"] = df["building"].str.replace(r"brak\s?.*", "0", regex=True)
    df["building"] = df["building"].str.replace(r"\s*\.$", "0", regex=True)
    # Treat plot number as number
    df["building"] = df["building"].str.replace(r"(numer|nr\.?)\s+działki\s+(\d+\w*)$", r"\2", regex=True)
    df["building"] = df["building"].str.replace(r"(dz\.?|działka)\s+(\d+\w*)$", r"\2", regex=True)
    # Remove "number" from  building numer
    df["building"] = df["building"].str.replace(r"(nr\.?|numer)\s+(\d+\w*)$", r"\2", regex=True)
    # Remove block number
    df["building"] = df["building"].str.replace(r"(bl\.?|blok)\s+(\d+\w*)$", r"\2", regex=True)
    df["building"] = df["building"].str.replace(r"(\d+)\s*(bl|m)\.?\s*.+$", lambda m: f"{m.group(1)}", regex=True)
    # Split building numbers into parts
    df["building_n"] = df.apply(get_building_number, axis=1)
    df["building_l"] = df.apply(get_building_letter, axis=1)
    # Assign building order
    df["building_o"] = df.apply(lambda row: get_building_order(row["building_n"], row["building_l"]), axis=1)

  if (has_building_numbers and isinstance(df, geo.GeoDataFrame)):
    print("Updating TERYT based on spatial data...")
    gminy = geo.read_file("data_in/gminy_dzielnice.json")
    gminy.crs = "EPSG:3857"
    gminy = gminy.to_crs(df.crs)
    df = df.sjoin(gminy, predicate="within")
    df = df.rename(columns={ "teryt_right": "teryt" })
    df = df[[*[column_names[key] for key in column_names], *["building_n", "building_l", "building_o", "no_type", "no_repl", "no_rep_typ"]]]

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
    print(f"Loading streets for voivodeship {teryt}...")
    streets = geo.read_file(f"data_in/addresses/{teryt}.zip!PRG_Ulice_{teryt}.shp")
    squares = geo.read_file(f"data_in/addresses/{teryt}.zip!PRG_Place_{teryt}.shp")
    streets = concat(streets, squares)
    streets = streets[[key for key in streets_columns]].rename(columns=streets_columns)
    print(f"Processing streets for voivodeship {teryt}...")
    streets = process_addresses(streets, streets_columns, False)
    save_zip(f"{streets_path}/{teryt}", streets)

    print(f"Loading data for voivodeship {teryt}...")
    addresses = geo.read_file(f"data_in/addresses/{teryt}.zip!PRG_PunktyAdresowe_{teryt}.shp")
    streets = streets.drop_duplicates(subset=["teryt", "str_type", "ULIC_id"])
    streets = streets[["str_type", "ULIC_id", "teryt"]]
    addresses = addresses.merge(streets, left_on=["TERYT", "ULIC_id"], right_on=["teryt", "ULIC_id"], how="left")
    del addresses_columns["Cecha"]
    addresses = addresses[[*[key for key in addresses_columns], "str_type"]].rename(columns=addresses_columns)
    print(f"Processing data for voivodeship {teryt}...")
    addresses = process_addresses(addresses, addresses_columns, True)
    save_zip(f"{addresses_path}/{teryt}", addresses)

  print("Processing town names...")
  towns = geo.read_file(f"data_in/addresses/prng.zip")
  towns = towns[[key for key in towns_columns]].rename(columns=towns_columns)
  towns = towns[towns["type"] != "część miasta"]
  towns["teryt"] = towns["teryt"].str[0:6]
  save_zip(f"{addresses_path}/prng", towns)

if (__name__ == "__main__"):
  process_data()
