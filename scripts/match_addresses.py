import pandas
import geopandas as geo
import os
import re
import regex
import typing
from typing import List, Dict
from utils import load_replacements

pandas.options.mode.copy_on_write = True

place_type = re.compile(r"^(miasto|miasta|wieś|wsie|sołectwo|sołectwa|osada|osady|przysiółek|przysiółki):?\s*", flags=re.IGNORECASE)
streets_regex = re.compile(r",?.*(ulice|ulica):?\s*", flags=re.IGNORECASE)
street_name_regex = regex.compile(r"^(\p{Lu}\p{L}+\s?)+$", flags=re.IGNORECASE)

def log_error(district: pandas.Series, reason: str):
  with open("error.log", "a") as log:
    log.write(f"Unable to find addresses for district {district.number} in {district.town} ({district.teryt}). Full address: {district.f_address}, {district.location}. ({reason})\n")

def concat(df1: geo.GeoDataFrame | None, df2: geo.GeoDataFrame):
  if (df1 is None):
    return df2
  return typing.cast(geo.GeoDataFrame, pandas.concat([df1, df2]))

def is_town(addresses: geo.GeoDataFrame, name: str):
  addresses_with_town = addresses[addresses["town"] == name]
  return len(addresses_with_town) > 0

def main():
  print("Loading data...")
  if (os.path.isfile("error.log")):
    os.remove("error.log")

  replacements = load_replacements()
  districts = pandas.read_csv("data_processed/districts.csv", converters={ "teryt": str }, sep="|", encoding="utf-8")
  for teryt in range(16):
    teryt = f"{(teryt + 1) * 2}".zfill(2)
    print(f"=== {teryt} ===")
    print("Loading addresses...")
    addresses = geo.read_file(f"data_processed/addresses/{teryt}.zip")
    woj_districts = districts[districts["teryt"].str.startswith(teryt)]
    addresses_out: geo.GeoDataFrame | None = None
    processed_rows = 0
    for i, district in woj_districts.iterrows():
      if (processed_rows != 0 and processed_rows % 250 == 0):
        print(f"Processed {processed_rows} out of {len(woj_districts)} districts...")

      district_id = f"{district.teryt}_{district.number}"
      district_addresses: geo.GeoDataFrame | None = None
      teryt_addresses = addresses[addresses["teryt"] == district.teryt]
      if (district.type != "stały"):
        district_addresses = teryt_addresses[teryt_addresses["f_address"] == district.f_address]
        if (len(district_addresses) == 0):
          # TODO: Attempt geocoding address using API
          pass
      
      borders = district.borders
      borders = streets_regex.sub(r" \1: ", borders)
      split_borders: List[str] = re.split(r",\s*", borders.replace(";", ","))
      last_element = re.split(r"\s+i\s+", split_borders[len(split_borders) - 1])
      # Handle enumerated towns
      if (len(last_element) > 1):
        all_towns = True
        for token in last_element:
          if (all_towns):
            all_towns = is_town(teryt_addresses, token)
          else:
            all_towns = False
            break

        if (all_towns):
          split_borders = split_borders[:-1]
          split_borders.extend(last_element)

      parsed_tokens = []
      town = None
      street = None
      for token in split_borders:
        token = place_type.sub("", token).strip()
        parsed_token: Dict[str, str | bool] = { "token": token, "is_town": is_town(teryt_addresses, token) }
        if (parsed_token["is_town"]):
          # Found entire town
          parsed_token["town"] = token
          parsed_tokens.append(parsed_token)
          continue

        token = place_type.sub("", token).strip()

        if (is_town(teryt_addresses, token.split("-")[0])):
          town = token.split("-")[0]
        
        if (town is None):
          town = district.town

        parsed_token["town"] = town
        token = streets_regex.sub("", token.replace(town, "")).strip()
        if (street_name_regex.match(token)):
          street = token
          for key in replacements:
            street = street.replace(key, replacements[key])
          parsed_token["street"] = street
          parsed_token["is_street"] = True
          parsed_tokens.append(parsed_token)
      
      for token in parsed_tokens:
        token_addresses = teryt_addresses[teryt_addresses["town"] == token["town"]]
        if (token["is_town"]):
          district_addresses = concat(district_addresses, token_addresses)
          continue

        if (token["is_street"]):
          district_addresses = concat(district_addresses, token_addresses[token_addresses["street"] == token["street"]])

      if (district_addresses is not None):
        district_addresses["district_id"] = district_id
        addresses_out = concat(addresses_out, district_addresses)
      processed_rows += 1

    if (addresses_out is not None):
      print(f"Found district for {len(addresses_out)} out of {len(addresses)} addresses.")
      addresses_out.to_file(f"geocoded/{teryt}.json", driver="GeoJSON")
      duplicated = addresses[addresses.duplicated(subset=["f_address"], keep=False)]
      duplicated.to_file(f"geocoded/duplicated_{teryt}.json", driver="GeoJSON")

if (__name__ == "__main__"):
  main()