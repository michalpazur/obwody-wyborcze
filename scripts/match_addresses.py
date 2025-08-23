import pandas
import geopandas as geo
import os
import re
import regex
from typing import List, NotRequired, TypedDict, cast
from utils import concat, Utils, get_building_order, save_zip
from const import all_regex, odd_regex, even_regex, building_num_regex, building_letter_regex, district_types, dash_regex, multiple_number_regex, districts as town_districts, building_types_regex

pandas.options.mode.copy_on_write = True

place_type = re.compile(r"^(miasto|miasta|wieś|wsie|sołectwo|sołectwa|osada|osady|przysiółek|przysiółki|miejscowość|miejscowości)(:\s*|\s+)", flags=re.IGNORECASE)
streets_regex = re.compile(r"(,\s*|^)(ul\.|ulice|ulica):?\s*", flags=re.IGNORECASE)
street_name_regex = regex.compile(r"^(\p{Lu}\p{L}+\s?)+$", flags=re.IGNORECASE)

DEBUG = True

class BuildingNumber(TypedDict):
  building_n: int | str
  building_l: str

class BaseParsedToken(TypedDict):
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

class ParsedToken(BaseParsedToken):
  except_addresses: List[BaseParsedToken]

class FoundStreet(TypedDict):
  start_index: int
  end_index: int
  street: str
  prev_token: NotRequired[ParsedToken]

def log_error(district: pandas.Series, reason: str):
  with open("error.log", "a") as log:
    log.write(f"Unable to find addresses for district {district.number} in {district.town} ({district.teryt}). Full address: {district.f_address}, {district.location}. ({reason})\n")

def is_town(addresses: geo.GeoDataFrame, name: str):
  addresses_with_town = addresses[addresses["town"] == name]
  return len(addresses_with_town) > 0

def check_street(streets: geo.GeoDataFrame, town: str, street: str, key: str):
  addresses_with_street = streets[(streets["town"] == town) & (streets[key] == street)]
  if (len(addresses_with_street) > 0):
    return addresses_with_street.index[0]
  return -1

def is_street(streets: geo.GeoDataFrame, town: str, street: str):
  for key in ["street", "no_repl", "no_type", "no_rep_typ"]:
    idx = check_street(streets, town, street, key)
    if (idx > -1):
      return streets.loc[idx, "street"]
  return ""

def process_token_word(word: str):
  # Remove multiple building numbers (i.e. 100/102 -> 100)
  if (not re.search(dash_regex, word)):
    word = re.sub(multiple_number_regex, r"\1", word)
  word = word.rstrip(",.")
  word = word.lower()

  return word

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

def get_parsed_number(num: BuildingNumber | None):
  if (not num):
    return -1
  
  try:
    parsed_num = int(num["building_n"])
    return parsed_num
  except:
    return -1
  
def get_addresses_for_token(token: BaseParsedToken, token_addresses: geo.GeoDataFrame):
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

  return token_addresses

def main():
  print("Loading data...")
  if (os.path.isfile("error.log")):
    os.remove("error.log")

  utils = Utils()
  args = { 
    "converters": { "teryt": str },
    "encoding": "utf-8",
    "sep": ";",
  }
  districts = pandas.read_csv("data_processed/districts.csv", converters={ "teryt": str }, sep="|", encoding="utf-8")
  tokens_to_skip = pandas.read_csv("const/tokens_to_skip.csv", **args)
  extra_streets = pandas.read_csv("const/extra_streets.csv", **args)
  tokens_to_replace = pandas.read_csv("const/tokens_to_replace.csv", **args)
  addresses_to_skip = pandas.read_csv("const/addresses_to_skip.csv", **args)
  # Force special districts to be first
  districts.loc[districts["borders"].str.contains("Dom Pomocy Społecznej"), "type"] = "dom pomocy społecznej"
  districts = districts.sort_values("type", key=lambda x: x.map(district_types))
  teryts = districts["teryt"].drop_duplicates()
  powiats = []
  for teryt in teryts:
    if (teryt[:4] not in powiats):
      powiats.append(teryt[:4])
  
  powiats = sorted(powiats)

  for i in range(16):
    woj_teryt = str((i + 1) * 2).rjust(2, "0")
    woj_powiats = filter(lambda x: x.startswith(woj_teryt), powiats)
    woj_powiats = list(woj_powiats)
    print(f"Loading data for voivodeship {woj_teryt}...")

    addresses = geo.read_file(f"data_processed/addresses/{woj_teryt}.zip")
    # For easier duplicates search
    addresses = addresses.sort_values(["town", "street", "building_n", "building_l"])
    addresses.loc[addresses["building_n"].isna(), "building_n"] = "-1"
    addresses["building_n"] = addresses["building_n"].astype(int)

    streets = geo.read_file(f"data_processed/streets/{woj_teryt}.zip")
    for teryt in woj_powiats:
      powiat_teryts = filter(lambda x: x.startswith(teryt), teryts)
      powiat_teryts = sorted(list(powiat_teryts))
      matched_addresses = process_powiat(powiat_teryts, districts, addresses, streets, utils, tokens_to_skip, extra_streets, tokens_to_replace, addresses_to_skip)
      if (matched_addresses is not None):
        save_zip(f"matched_addresses/{teryt}", matched_addresses)
      else:
        raise ValueError(f"No addresses matched found for powiat {teryt}!")

def process_powiat(
    teryts: List[str],
    districts: pandas.DataFrame,
    addresses: geo.GeoDataFrame,
    streets: geo.GeoDataFrame,
    utils: Utils,
    tokens_to_skip_df: pandas.DataFrame,
    extra_streets_df: pandas.DataFrame,
    tokens_to_replace: pandas.DataFrame,
    addresses_to_skip_df: pandas.DataFrame,
  ):
  powiat_addresses: geo.GeoDataFrame | None = None

  for teryt in teryts:
    print(f"Processing {teryt}...")
    teryt_districts = districts[districts["teryt"] == teryt]
    teryt_addresses = addresses[addresses["teryt"] == teryt]
    tokens_to_skip = tokens_to_skip_df[tokens_to_skip_df["teryt"] == teryt]["token"].tolist()
    tokens_to_replace = tokens_to_replace[tokens_to_replace["teryt"] == teryt]
    addresses_to_skip = addresses_to_skip_df[addresses_to_skip_df["teryt"] == teryt]["f_address"].tolist()
    # Extra streets have to be parsed but will be discarded anyway
    extra_streets = extra_streets_df[extra_streets_df["teryt"] == teryt]
    extra_streets_list = extra_streets["street"].to_list()
    # Streets in Warsaw are assigned to city-wide TERYT instead of districts
    teryt_streets = streets[streets["teryt"] == ("146501" if teryt.startswith("1465") else teryt)]
    teryt_streets = concat(teryt_streets, extra_streets)
    teryt_streets = concat(teryt_streets, teryt_addresses)
    teryt_streets = teryt_streets.drop_duplicates(["town", "street"])
    addresses_out: geo.GeoDataFrame | None = None
    processed_rows = 0
    special_addresses = []
    for i, district in teryt_districts.iterrows():
      if (processed_rows != 0 and processed_rows % 10 == 0):
        print(f"Processed {processed_rows} out of {len(teryt_districts)} districts...")

      district_id = f"{teryt}_{district.number}"
      district_addresses: geo.GeoDataFrame | None = None
      if (district.type != "stały"):
        district_addresses = teryt_addresses[teryt_addresses["f_address"] == district.f_address]
        special_addresses.append(district.f_address)
        if (len(teryt_districts) == 0):
          # TODO: Attempt geocoding address using API
          pass
        if (district_addresses is not None):
          special_addresses.count(district.f_address)
          district_addresses["district"] = district_id
          addresses_out = concat(addresses_out, district_addresses)
        processed_rows += 1
        continue
      
      borders = district.borders
      borders = re.sub(r"(nr\.?|numer)\s+", "", borders)
      borders = re.sub(r"[()]", "", borders)
      borders = re.sub(r"(,\s*|\s+)(bez|oprócz|z wyłączeniem)(\s+(numer|nr\.?)(u|ów))?", ", bez", borders)
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
      is_except = False
      check_after_parity = False
      restored_token: ParsedToken | None = None
      for token in split_borders:
        token = token.strip()
        if (len(token) == 0 or token in tokens_to_skip):
          print(f"Skipping {token}...")
          continue

        token_to_replace = tokens_to_replace[tokens_to_replace["token"] == token]
        if (len(token_to_replace) > 0):
          token = token_to_replace.iloc[0].replacement
        token = place_type.sub("", token).strip()
        token = re.sub(r"(\s*-\s*|\s+)oficyn[ay]", "", token, flags=re.IGNORECASE)
        token = re.sub(r"\s*/\.?$", "", token) # See: Olsztyn
        token = re.sub(r"\.$", "", token)

        parsed_token: ParsedToken = { 
          "token": token,
          "is_town": is_town(teryt_addresses, token),
          "is_street": False,
          "is_odd": False,
          "is_even": False,
          "town": "",
          "street": "",
          "except_addresses": []
        }

        if (parsed_token["is_town"]):
          # Found entire town
          parsed_token["town"] = token
          parsed_tokens.append(parsed_token)
          continue

        token = place_type.sub("", token).strip()

        for town_district in town_districts:
          if (re.match(town_district, token)):
            token = token.replace(town_district, "").strip()
            town = town_district.split("-")[0]
            break
        if (not town and is_town(teryt_addresses, token.split("-")[0])):
          town = token.split("-")[0]
        
        if (town is None):
          town = district.town

        parsed_token["town"] = town
        token = streets_regex.sub("", token).strip()

        street_tmp = ""
        split_line = re.split(r"\s", token)
        streets_in_token: List[FoundStreet | None] = []
        idx = 0
        skipped_token = False
        while idx < len(split_line):
          end_idx = idx
          street_tmp = ""
          found_street: FoundStreet | None = None
          for word in split_line[idx:]:
            end_idx += 1
            street_tmp = " ".join(split_line[idx:end_idx])
            ends_with_dot = street_tmp.endswith(".")
            if (street_tmp in tokens_to_skip):
              print(f"Skipping {street_tmp}...")
              skipped_token = True
              idx = end_idx - 1
              break
            street_tmp = utils.transform_street_name(street_tmp, teryt)

            street_name = cast(str, is_street(teryt_streets, town, street_tmp))
            if (street_name != ""):
              last_street = street_name
              found_street = {
                "street": street_name,
                "start_index": idx,
                "end_index": end_idx
              }
              start_of_token = " ".join(split_line[0:idx]) + " "
              start_of_token = utils.transform_street_name(start_of_token, teryt) + " "
              start_of_token = utils.remove_street_type(start_of_token) + " "
              start_of_token = utils.remove_replacements(start_of_token)
              # Street was found later in the token, but the first part of the token was not included
              if (not skipped_token and len(start_of_token) > 0 and idx != 0 and len(streets_in_token) == 0):
                try:
                  prev_token = parsed_tokens[-1]
                  prev_found_street: FoundStreet = {
                    "street": prev_token["street"],
                    "start_index": 0,
                    "end_index": 0, # If street was not found previously that means it's not in the token so nothing will be cut
                    "prev_token": prev_token
                  }
                  streets_in_token.append(prev_found_street)
                except:
                  print(f"No previous token found for string \"{" ".join(split_line[0:idx])}\"!")
              elif (skipped_token):
                skipped_token = False
              # End of line was reached
              if (end_idx == len(split_line) or ends_with_dot):
                streets_in_token.append(found_street)
                idx = end_idx
            # Account for "name and name surname" case (e.g. Heleny i Leona Patynów in Kraków)
            elif (found_street is not None and end_idx == found_street["end_index"] + 3):
              streets_in_token.append(found_street)
              idx = found_street["end_index"]
              break
            elif (end_idx == len(split_line) and found_street):
              streets_in_token.append(found_street)
              idx = found_street["end_index"]

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
            is_except = False

            if ("prev_token" in street):
              prev_token = street["prev_token"]
              parsed_token["is_even"] = prev_token["is_even"]
              parsed_token["is_odd"] = prev_token["is_odd"]

            # We found new street, restart token to default settings
            tmp_token["street"] = street["street"]

            if (len(rest_of_token) == 0):
              parsed_token["is_street"] = True
              parsed_tokens.append(parsed_token)
              parsed_token = tmp_token.copy()
              continue
          else:
            parsed_token["street"] = last_street
            parsed_token["is_even"] = last_is_even
            parsed_token["is_odd"] = last_is_odd
            rest_of_token = " ".join(split_line)

          if (parsed_token["street"] in extra_streets_list):
            continue
          
          rest_of_token = re.sub(dash_regex, "-", rest_of_token)
          rest_of_token = re.sub(r"^/", "", rest_of_token) # See: Olsztyn
          rest_of_token = re.sub(building_types_regex, "", rest_of_token)
          split_token = re.split(r"\s+", rest_of_token.strip())
          prev_word = ""
          next_word = ""
          word_idx = -1
          prev_token = parsed_tokens[-1] if len(parsed_tokens) > 0 else None
          restored_prev_token = False
          skip_token = False
          
          if (prev_token and prev_token["street"] == parsed_token["street"] and prev_token["is_street"]):
            restored_prev_token = True
            parsed_token = parsed_tokens.pop()
            parsed_token["is_street"] = False

          for word in split_token:
            word_idx += 1
            next_word = split_token[word_idx + 1] if word_idx < len(split_token) - 1 else ""
            word = re.sub(r"[():]", "", word)

            if (check_after_parity):
              prev_token = parsed_tokens[-1]
              check_after_parity = False
              if (parsed_token["street"] == prev_token["street"]):
                restored_prev_token = True
                restored_token = parsed_tokens.pop()
                parsed_token = restored_token.copy()

            if (word == "i" or word == "oraz"):
              if (word_idx > 0 and not is_except):
                parsed_tokens.append(parsed_token)
              elif (word_idx > 0 and is_except):
                prev_token = parsed_tokens.pop()
                prev_token["except_addresses"].append(parsed_token)
                parsed_tokens.append(prev_token)
                is_except = next_word != ""
              if (next_word == ""):
                # This token has already been handled, no need to add it later
                skip_token = True
              parsed_token = parsed_token.copy()
              parsed_token.pop("num_from", None)
              parsed_token.pop("num_to", None)
              parsed_token.pop("number", None)
              prev_word = word
              continue

            split_by_dash = re.split(dash_regex, word)
            is_dash = re.match(f"^{dash_regex}$", word)
            prev_is_dash = re.match(f"^{dash_regex}$", prev_word)
            ends_with_dash = not is_dash and re.search(f"({dash_regex})$", word) is not None
            starts_with_dash = not is_dash and re.search(f"^({dash_regex})", word) is not None
            starts_with_from = word != "od" and word.startswith("od")
            starts_with_to = word != "do" and word.startswith("do")
            ends_with_to = word != "do" and word.endswith("do")

            if (ends_with_dash):
              word = word[:-1]
            if (ends_with_to):
              word = word[:-2]

            if (starts_with_dash):
              word = word[1:]
              prev_word = "-"
              prev_is_dash = True
            if (starts_with_from or starts_with_to):
              word = word[2:]
              if (starts_with_from):
                prev_word = "od"
              else:
                prev_word = "do"

            if (not is_dash and not ends_with_dash and not starts_with_dash and len(split_by_dash) >= 2):
              word_from = process_token_word(split_by_dash[0])
              word_to = process_token_word(split_by_dash[1])
              if ("num_from" not in parsed_token):
                parsed_token["num_from"] = get_building_number(word_from)
              if ("num_to" not in parsed_token):
                parsed_token["num_to"] = get_building_number(word_to)
              prev_word = word_from
              continue

            word = process_token_word(word)
            if (re.match(all_regex, word)):
              parsed_token["is_street"] = True
              break

            if (re.match(odd_regex, word)):
              parsed_token["is_odd"] = True
              parsed_token["is_even"] = False
              if (restored_token and not restored_token["is_odd"]):
                parsed_tokens.append(restored_token)
                restored_token = None
            elif (re.match(even_regex, word)):
              parsed_token["is_even"] = True
              parsed_token["is_odd"] = False
              if (restored_token and not restored_token["is_even"]):
                parsed_tokens.append(restored_token)
                restored_token = None

            joined_words = f"{prev_word} {word}"
            is_end = joined_words == "do końca"
            is_except = is_except or word == "bez" or word == "oprócz"
            is_num_to = (prev_word == "do" and not is_end) or prev_is_dash

            if (is_end and "number" in parsed_token):
              parsed_token["num_from"] = get_building_number(parsed_token["number"])
              del parsed_token["number"]

            if (word == "bez" or word == "oprócz" or (is_except and restored_prev_token)):
              if (restored_prev_token):
                parsed_token["is_street"] = True
              if (restored_prev_token or word_idx > 0):
                parsed_tokens.append(parsed_token)
                parsed_token = parsed_token.copy()
                parsed_token["is_street"] = False
                parsed_token["except_addresses"] = []
                parsed_token.pop("number", None)
                restored_prev_token = False
              if (word == "bez" or word == "oprócz"):
                prev_word = word
                continue
            if (re.match(r"(bez|oprócz) numer(u|ów)", joined_words)):
              continue

            prev_token = parsed_tokens[-1] if len(parsed_tokens) > 0 else None
            if (is_dash):
              parsed_token.pop("number", None)
              parsed_token["num_from"] = get_building_number(prev_word)
            elif (ends_with_dash):
              parsed_token["num_from"] = get_building_number(word)
            elif (prev_word == "od" or next_word == "-"):
              parsed_token["num_from"] = get_building_number(word)
            elif (prev_token is not None and prev_token["street"] == parsed_token["street"] and word_idx == 1 and is_num_to):
              parsed_token = parsed_tokens.pop()
              parsed_token["num_to"] = get_building_number(word)
            elif (is_num_to):
              parsed_token["num_to"] = get_building_number(word)
              if ("number" in parsed_token):
                num_from = parsed_token["number"]
                parsed_token["num_from"] = get_building_number(num_from)
            elif (not is_end and word != "od" and word != "-" and word != "do" and re.match(building_num_regex, word)):
              parsed_token["number"] = word
              parsed_token["is_even"] = False
              parsed_token["is_odd"] = False
            
            if (not ends_with_dash and not ends_with_to):
              prev_word = word
            else:
              prev_word = "-"

          num_from = parsed_token.get("num_from")
          num_to = parsed_token.get("num_to")
          # Check if building numbers match parity
          if ((parsed_token["is_even"] or parsed_token["is_odd"]) and (num_from or num_to)):
            parsed_from = get_parsed_number(num_from)
            parsed_to = get_parsed_number(num_to)
            if (parsed_from != -1 or parsed_to != -1):
              is_odd = parsed_token["is_odd"]
              if (parsed_token["is_even"]):
                is_even = True
                if (parsed_from != -1):
                  is_even = parsed_from % 2 == 0
                if (is_even and parsed_to != -1):
                  is_even = parsed_to % 2 == 0
                parsed_token["is_even"] = is_even
                if (is_even):
                  parsed_token["is_odd"] = False
              elif (is_odd):
                if (parsed_from != -1):
                  is_odd = parsed_from % 2 == 1
                if (is_odd and parsed_to != -1):
                  is_odd = parsed_to % 2 == 1
                parsed_token["is_odd"] = is_odd
                if (is_odd):
                  parsed_token["is_even"] = False
          
          last_is_odd = parsed_token["is_odd"]
          last_is_even = parsed_token["is_even"]
          if (len(split_token) == 1 and re.search(even_regex, split_token[0])):
            check_after_parity = True
          
          if (not skip_token):
            if (is_except):
              prev_token = parsed_tokens.pop()
              prev_token["except_addresses"].append(parsed_token)
              parsed_tokens.append(prev_token)
            else:
              parsed_tokens.append(parsed_token)
          parsed_token = tmp_token.copy()
      
      for token in parsed_tokens:
        token_addresses = teryt_addresses[teryt_addresses["town"] == token["town"]]
        token_addresses = token_addresses[~(token_addresses["f_address"].isin(special_addresses))]
        token_addresses = token_addresses[~(token_addresses["f_address"].isin(addresses_to_skip))]
        if (district_addresses is not None):
          # Ignore duplicate addresses
          token_addresses = token_addresses[~(token_addresses["f_address"].isin(district_addresses.f_address))]

        if (token["is_town"]):
          district_addresses = concat(district_addresses, token_addresses)
          continue

        except_addresses = []
        for except_token in token["except_addresses"]:
          except_addresses.extend(get_addresses_for_token(except_token, token_addresses)["f_address"].to_list())

        token_addresses = token_addresses[token_addresses["street"] == token["street"]]
        is_even = token["is_even"]
        is_odd = token["is_odd"]
        if (token["is_street"] and not is_even and not is_odd):
          token_addresses = token_addresses[~(token_addresses["f_address"].isin(except_addresses))]
          district_addresses = concat(district_addresses, token_addresses)
          continue

        all_token_addresses = get_addresses_for_token(token, token_addresses)
        token_addresses = all_token_addresses[~(all_token_addresses["f_address"].isin(except_addresses))]
          
        if (len(token_addresses) == 0):
          print("No addresses found for token:", token)
        else:
          district_addresses = concat(district_addresses, token_addresses)

      if (district_addresses is not None):
        district_addresses["district"] = district_id
        addresses_out = concat(addresses_out, district_addresses)
      processed_rows += 1

    if (addresses_out is not None):
      duplicates = addresses_out.duplicated(subset=["f_address"], keep=False)
      addresses_to_save = addresses_out[~duplicates]
      print(f"Found district for {len(addresses_to_save)} out of {len(teryt_addresses)} addresses.")
      powiat_addresses = concat(powiat_addresses, addresses_to_save)
      if (DEBUG):
        duplicated = addresses_out[duplicates]
        duplicated.to_file(f"matched_addresses/duplicated_{teryt}.json", driver="GeoJSON")
        no_district = teryt_addresses[~(teryt_addresses["f_address"].isin(addresses_out.f_address))]
        no_district.to_file(f"matched_addresses/no_district_{teryt}.json", driver="GeoJSON")

  return powiat_addresses
if (__name__ == "__main__"): 
  main()