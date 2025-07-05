import pandas
import geopandas as geo
import os
import re
import regex
from typing import List, NotRequired, TypedDict
from utils import load_replacements, load_street_prefixes, capitalize, concat, Utils, get_building_order
from const import all_regex, odd_regex, even_regex, building_num_regex, building_letter_regex, district_types, ordinal_regex

pandas.options.mode.copy_on_write = True

place_type = re.compile(r"^(miasto|miasta|wieś|wsie|sołectwo|sołectwa|osada|osady|przysiółek|przysiółki):?\s*", flags=re.IGNORECASE)
streets_regex = re.compile(r",?.*(ulice|ulica):?\s*", flags=re.IGNORECASE)
street_name_regex = regex.compile(r"^(\p{Lu}\p{L}+\s?)+$", flags=re.IGNORECASE)

class BuildingNumber(TypedDict):
  building_n: int | str
  building_l: str

class FoundStreet(TypedDict):
  start_index: int
  end_index: int
  street: str

class ParsedToken(TypedDict):
  token: str
  is_town: bool
  is_street: bool
  is_odd: bool
  is_even: bool
  town: str
  street: str
  number: NotRequired[str]
  num_from: NotRequired[BuildingNumber]
  num_to: NotRequired[BuildingNumber]


def log_error(district: pandas.Series, reason: str):
  with open("error.log", "a") as log:
    log.write(f"Unable to find addresses for district {district.number} in {district.town} ({district.teryt}). Full address: {district.f_address}, {district.location}. ({reason})\n")

def is_town(addresses: geo.GeoDataFrame, name: str):
  addresses_with_town = addresses[addresses["town"] == name]
  return len(addresses_with_town) > 0

def is_street(streets: geo.GeoDataFrame, town: str, name: str):
  addresses_with_street = streets[(streets["town"] == town) & (streets["street"] == name)]
  return len(addresses_with_street) > 0

def get_building_number(address: str) -> BuildingNumber:
  match = re.match(building_num_regex, address)
  building_n = ""
  building_l = ""
  if (match is not None and match.group(2)):
    building_n = int(match.group(2))
  match = re.match(building_letter_regex, address)
  if (match is not None and match.group(1)):
    building_l = match.group(1)

  return { "building_n": building_n, "building_l": building_l }

def main():
  print("Loading data...")
  if (os.path.isfile("error.log")):
    os.remove("error.log")

  utils = Utils()
  street_prefixes = load_street_prefixes()
  replacements = load_replacements()
  districts = pandas.read_csv("data_processed/districts.csv", converters={ "teryt": str }, sep="|", encoding="utf-8")
  teryts = districts["teryt"].drop_duplicates()

  for teryt in teryts:
    print(f"=== {teryt} ===")

    print("Loading addresses...")
    woj_teryt = teryt[:2]
    addresses = geo.read_file(f"data_processed/addresses/{woj_teryt}.zip")
    addresses = addresses[addresses["teryt"] == teryt]
    streets = geo.read_file(f"data_processed/streets/{woj_teryt}.zip")
    # For easier duplicates search
    addresses = addresses.sort_values(["town", "street", "building_n", "building_l"])
    addresses.loc[addresses["building_n"].isna(), "building_n"] = "-1"
    addresses["building_n"] = addresses["building_n"].astype(int)

    teryt_districts = districts[districts["teryt"] == teryt]
    teryt_districts = teryt_districts.sort_values("type", key=lambda x: x.map(district_types))
    addresses_out: geo.GeoDataFrame | None = None
    processed_rows = 0
    special_addresses = []
    for i, district in teryt_districts.iterrows():
      if (processed_rows != 0 and processed_rows % 10 == 0):
        print(f"Processed {processed_rows} out of {len(teryt_districts)} districts...")

      district_id = f"{teryt}_{district.number}"
      district_addresses: geo.GeoDataFrame | None = None
      teryt_addresses = addresses[addresses["teryt"] == district.teryt]
      # Streets in Warsaw are assigned to city-wide TERYT instead of districts
      teryt_streets = streets[streets["teryt"] == ("146501" if district.teryt.startswith("1465") else district.teryt)]
      if (district.type != "stały"):
        district_addresses = teryt_addresses[teryt_addresses["f_address"] == district.f_address]
        special_addresses.append(district.f_address)
        if (len(teryt_districts) == 0):
          # TODO: Attempt geocoding address using API
          pass
        if (district_addresses is not None):
          special_addresses.count(district.f_address)
          district_addresses["district_id"] = district_id
          addresses_out = concat(addresses_out, district_addresses)
        processed_rows += 1
        continue
      
      borders = district.borders
      borders = streets_regex.sub(r" \1: ", borders)
      borders = re.sub(r"(nr|numer)\s+", "", borders)
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

      parsed_tokens: List[ParsedToken] = []
      town = None
      last_street = ""
      last_is_odd = False
      last_is_even = False
      for token in split_borders:
        token = place_type.sub("", token).strip()
        parsed_token: ParsedToken = { 
          "token": token,
          "is_town": is_town(teryt_addresses, token),
          "is_street": False,
          "is_odd": False,
          "is_even": False,
          "town": "",
          "street": "",
        }

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

        street_tmp = ""
        split_line = re.split(r"\s", token)
        streets_in_token: List[FoundStreet | None] = []
        idx = 0
        while idx < len(split_line):
          end_idx = idx
          street_tmp = ""
          found_street: FoundStreet | None = None
          for word in split_line[idx:]:
            end_idx += 1
            street_tmp = " ".join(split_line[idx:end_idx])
            for search in street_prefixes:
              street_tmp = re.sub(search, street_prefixes[search], street_tmp, flags=re.IGNORECASE)
            for search in replacements:
              street_tmp = re.sub(re.escape(search), replacements[search], street_tmp, flags=re.IGNORECASE)
            street_tmp = re.sub(r"\s+", " ", street_tmp.strip()).replace(":", "")
            street_tmp = utils.remove_first_name(street_tmp)
            street_tmp = utils.remove_first_letter(street_tmp)
            street_tmp = re.sub(ordinal_regex, "", street_tmp)
            street_tmp = street_tmp.replace(r'[„"](.+)[”"]', r'"\1"')
            street_tmp = street_tmp.replace("´", "'")
            street_tmp = re.sub(ordinal_regex, "", street_tmp)
            street_tmp = capitalize(street_tmp)

            if (is_street(teryt_streets, town, street_tmp)):
              last_street = street_tmp
              found_street = {
                "street": street_tmp,
                "start_index": idx,
                "end_index": end_idx
              }
              # End of line was reached
              if (end_idx == len(split_line)):
                streets_in_token.append(found_street)
                idx = end_idx
            elif (found_street is not None):
              streets_in_token.append(found_street)
              idx = end_idx - 1
              break

          if (found_street is None):
            idx += 1

        prev_end = len(split_line)
        streets_in_token.reverse()
        if (len(streets_in_token) == 0):
          streets_in_token = [None]

        for street in streets_in_token:
          tmp_token = parsed_token.copy()
          if (street is not None):
            token = " ".join(split_line[street["start_index"]:prev_end])
            rest_of_token = " ".join(split_line[street["end_index"]:prev_end])
            prev_end = street["start_index"]
            parsed_token["street"] = street["street"]
            parsed_token["token"] = token

            # We found new street, restart token to default settings
            tmp_token["street"] = street["street"]

            if (len(rest_of_token) == 0):
              parsed_token["is_street"] = True
              parsed_tokens.append(parsed_token)
              continue
          else:
            parsed_token["street"] = last_street
            parsed_token["is_even"] = last_is_even
            parsed_token["is_odd"] = last_is_odd
            rest_of_token = " ".join(split_line)
          
          split_token = re.split(r"\s", rest_of_token)
          prev_word = ""
          word_idx = 0
          for word in split_token:
            if (word == "i" or word == "oraz"):
              parsed_tokens.append(parsed_token)
              parsed_token = parsed_token.copy()
              parsed_token["is_even"] = False
              parsed_token["is_odd"] = False
              parsed_token.pop("num_from", None)
              parsed_token.pop("num_to", None)
              parsed_token.pop("number", None)
              continue

            word = re.sub(r"[():]", "", word)
            # Remove multiple building numbers (i.e. 100/102 -> 100)
            if (word != "-"):
              word = re.sub(r"(\w*)\s?[,-/]\s?(\w*\s?[,-/]\s?)*\w*", r"\1", word)
            word = word.lower()

            if (re.match(all_regex, word)):
              parsed_token["is_street"] = True
              break

            if (re.match(odd_regex, word)):
              parsed_token["is_odd"] = True
              parsed_token["is_even"] = False
            elif (re.match(even_regex, word)):
              parsed_token["is_even"] = True
              parsed_token["is_odd"] = False

            prev_token = parsed_tokens[-1] if len(parsed_tokens) > 0 else None
            if (word == "-" or word == "–"):
              parsed_token["num_from"] = get_building_number(prev_word)
            elif (prev_word == "od"):
              parsed_token["num_from"] = get_building_number(word)
            elif (prev_word == "-" or prev_word == "–"):
              parsed_token["num_to"] = get_building_number(word)
            elif (prev_token is not None and prev_token["street"] == parsed_token["street"] and word_idx == 1 and prev_word == "do"):
              parsed_token = parsed_tokens.pop()
              parsed_token["num_to"] = get_building_number(word)
            elif (prev_word == "do"):
              parsed_token["num_to"] = get_building_number(word)
            elif (re.match(building_num_regex, word)):
              parsed_token["number"] = word
            
            word_idx += 1
            prev_word = word

          parsed_tokens.append(parsed_token)
          last_is_odd = parsed_token["is_odd"]
          last_is_even = parsed_token["is_even"]
          parsed_token = tmp_token.copy()
      
      for token in parsed_tokens:
        token_addresses = teryt_addresses[teryt_addresses["town"] == token["town"]]
        token_addresses = token_addresses[~(token_addresses["f_address"].isin(special_addresses))]
        if (district_addresses is not None):
          # Ignore duplicate addresses
          token_addresses = token_addresses[~(token_addresses["f_address"].isin(district_addresses.f_address))]

        if (token["is_town"]):
          district_addresses = concat(district_addresses, token_addresses)
          continue

        token_addresses = token_addresses[token_addresses["street"] == token["street"]]
        if (token["is_street"]):
          district_addresses = concat(district_addresses, token_addresses)
          continue

        is_even = token["is_even"]
        is_odd = token["is_odd"]
        if (is_even):
          token_addresses = token_addresses[token_addresses["building_n"] % 2 == 0]
        elif (is_odd):
          token_addresses = token_addresses[token_addresses["building_n"] % 2 == 1]
        
        num_from = token.get("num_from")
        num_to = token.get("num_to")
        number = token.get("number")

        if (num_from is not None or num_to is not None):
          if (num_from is not None and num_from["building_n"] != ""):
            token_addresses = token_addresses[token_addresses["building_o"] >= get_building_order(num_from["building_n"], num_from["building_l"])]
          if (num_to is not None and num_to["building_n"] != ""):
            token_addresses = token_addresses[token_addresses["building_o"] <= get_building_order(num_to["building_n"], num_to["building_l"])]
        elif (number is not None):
          token_addresses = token_addresses[token_addresses["building"] == number]
          
        if (len(token_addresses) == 0):
          print("No addresses found for token:", token)
        else:
          district_addresses = concat(district_addresses, token_addresses)

      if (district_addresses is not None):
        district_addresses["district_id"] = district_id
        addresses_out = concat(addresses_out, district_addresses)
      processed_rows += 1

    if (addresses_out is not None):
      print(f"Found district for {len(addresses_out)} out of {len(addresses)} addresses.")
      addresses_out.to_file(f"geocoded/{teryt}.json", driver="GeoJSON")
      duplicated = addresses_out[addresses_out.duplicated(subset=["f_address"], keep=False)]
      duplicated.to_file(f"geocoded/duplicated_{teryt}.json", driver="GeoJSON")
      no_district = addresses[~(addresses["f_address"].isin(addresses_out.f_address))]
      no_district.to_file(f"geocoded/no_address_{teryt}.json", driver="GeoJSON")

if (__name__ == "__main__"): 
  main()