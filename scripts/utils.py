from pandas import DataFrame
import pandas
from geopandas import GeoDataFrame
import os
import re, regex
from regex import Match
from const import first_name_letter_regex, holy_name_regex, prince_queen_regex, char_order, ordinal_regex, year_regex, quotation_regex, apostrophe_regex, dash_regex, building_types_regex
import typing
from typing import Dict

def head(df: DataFrame, n: int = 5):
  print(df.head(n))

def handle_capitalize(match: Match[str]):
  text = ""
  if (match.group(1)):
    text += match.group(1)
  text += match.group(2)[:1].capitalize() + match.group(2)[1:].lower()
  if (match.group(3)):
    text += match.group(3)
  elif (match.group(1)):
    text += "\""

  return text

def capitalize(x: str):
  word = map(lambda part: regex.sub(r"(\")?([\p{Lu}|\p{L}]+)(\")?", handle_capitalize, part), x.split("-"))
  return "-".join(list(word))

def capitalize_every_word(x: str):
  sentence = map(lambda word: capitalize(word) if word != "i" and word != "RP" and word != "PCK" and not re.match(r"^[IVXLCDM]+$", word) else word, re.split(r"\s+", x))
  return " ".join(list(sentence))

def load_replacements():
  with open("const/street_replacements.csv") as replacements_file:
    replacements = [line.rstrip().split(";") for line in replacements_file.readlines()]
    replacements = dict(zip([f"{re.escape(x[0])}\\.?(\\s+|$)" for x in replacements], [x[1] if x == "" else f"{x[1]} " for x in replacements]))
  return replacements

def get_replacement_values(replacements: Dict[str, str]):
  values = replacements.values()
  values = filter(lambda x: x != "" and x != " ", values)
  return list(values)

def load_replacements_exceptions():
  return pandas.read_csv("const/replacements_exceptions.csv", sep=";", converters={ "teryt": str })

def load_street_prefixes():
  with open("const/street_prefixes.csv") as prefixes_file:
    lines = [line.strip().split(";") for line in prefixes_file.readlines()]
    prefixes = dict(zip([f"{x[0]}(\\.\\s*|\\s+)" for x in lines], [x[1] if x == "" else f"{x[1]} " for x in lines]))
  return prefixes

def load_town_replacements() -> Dict[str, Dict[str, str]]:
  with open("const/town_replacements.csv") as replacements_file:
    replacements: Dict[str, Dict[str, str]] = {}
    lines = [line.strip().split(";") for line in replacements_file.readlines()]
    for line in lines:
      [teryt, town, replacement] = line
      teryt_replacements = replacements.get(teryt, {})
      teryt_replacements[town] = replacement
      replacements[teryt] = teryt_replacements
  return replacements

def get_street_types(prefixes: Dict[str, str]):
  types = prefixes.values()
  types = filter(lambda x: x != "" and x != " ", types)
  return list(types)

def load_names():
  with open("const/names.csv") as names_file:
    lines = [line.strip().split(";") for line in names_file.readlines()]
    names = [line[2].strip() for line in lines]

  return names

def load_names_exceptions():
  with open("const/names_exceptions.txt") as exceptions_file:
    lines = [line.strip() for line in exceptions_file.readlines()]
    regexes = ["\\s+".join(name.split(" ")) for name in lines]

  return f"({"|".join(regexes)})$"

class Utils:
  def __init__(self):
    names = load_names()
    self.names = names
    names_regex = "(" + "|".join(names) + ")"
    names_regex = f"{names_regex}(\\s+([iI]\\s+)?{names_regex})?(\\s+|$)"
    self.names_regex = names_regex
    self.names_exceptions = load_names_exceptions()
    self.replacements = load_replacements()
    self.replacements_values = get_replacement_values(self.replacements)
    self.replacements_exceptions = load_replacements_exceptions()
    self.street_prefixes = load_street_prefixes()
    self.street_types = get_street_types(self.street_prefixes)
    prefixes_regex = "(" + "|".join(map(lambda street_type: street_type.strip(), self.street_types)) + ")"
    duplicate_prefixes_regex = f"{prefixes_regex}\\s+\\1"
    self.duplicate_prefixes_regex = duplicate_prefixes_regex
    self.town_replacements = load_town_replacements()

  def remove_first_name(self, street: str):
    if (re.search(self.names_exceptions, street)):
      return street
    
    if (re.search(holy_name_regex, street, flags=re.IGNORECASE)):
      return street
    
    if (re.search(prince_queen_regex, street, flags=re.IGNORECASE)):
      return street
    
    name_removed = re.sub(self.names_regex, "", street)
    if (len(name_removed.strip()) > 0):
      return name_removed
    return street

  def remove_first_letter(self, street: str):
    match = regex.search(first_name_letter_regex, street)
    if (match):
      name_letter = match.group(3)
      return street.replace(name_letter, "", 1)

    return street

  def remove_replacements(self, street: str):
    for replacement in self.replacements_values:
      if (re.search(replacement, street, flags=re.IGNORECASE)):
        street = re.sub(replacement, "", street, flags=re.IGNORECASE)

    return street.strip()
  
  def remove_street_type(self, street: str):
    for street_type in self.street_types:
      if (re.match(street_type, street, flags=re.IGNORECASE)):
        street = re.sub(street_type, "", street, flags=re.IGNORECASE)
        break

    return street.strip()

  def transform_street_name(self, street: str, teryt: str):
    for search in self.street_prefixes:
      street = re.sub(search, self.street_prefixes[search], street, flags=re.IGNORECASE)
    replacements_exceptions = self.replacements_exceptions[self.replacements_exceptions["teryt"] == teryt]
    if (street not in replacements_exceptions["street"].to_list()):
      for search in self.replacements:
        street = re.sub(search, self.replacements[search], street, flags=re.IGNORECASE)
    street = re.sub(r"\s+", " ", street.strip()).replace(":", "")
    if (street not in replacements_exceptions["street"].to_list()):
      street = self.remove_first_name(street)
    street = self.remove_first_letter(street)
    street = re.sub(ordinal_regex, "", street)
    street = re.sub(year_regex, r"\1 roku", street, flags=re.IGNORECASE)
    street = re.sub(quotation_regex, r'"\2"', street)
    street = re.sub(apostrophe_regex, "'", street)
    street = re.sub(dash_regex, "-", street)
    street = re.sub(building_types_regex, "", street)
    street = re.sub(r"-$", "", street)
    street = re.sub(r"\s*-\s*", "-", street)
    street = re.sub(r"-$", "", street)
    street = re.sub(r"\.$", "", street)
    street = re.sub(ordinal_regex, "", street)
    street = capitalize_every_word(street)

    return street
  
  def replace_town_name(self, row: pandas.Series):
    try:
      teryt_replacements = self.town_replacements[row.teryt]
    except:
      return row.town
    
    try:
      replacement = teryt_replacements[row.town]
    except:
      return row.town
    
    return replacement

max_letters = 3
def get_building_order(building_n: int | str, building_l: str):
  try:
    number = int(building_n) * pow(10, max_letters * 2)
    if (building_l == ""):
      return number
  except:
    number = 0
  
  for i in range(min(len(building_l), max_letters)):
    curr_pow = (max_letters - i - 1) * 2
    char = building_l[i:i+1]
    char_ord = char_order.index(char) + 1
    number += (char_ord * pow(10, curr_pow))
  
  return number

def save_zip(path: str, gdf: GeoDataFrame):
  gdf.to_file(f"{path}.shz", driver="ESRI Shapefile")
  os.rename(f"{path}.shz", f"{path}.zip")

def concat(df1: GeoDataFrame | None, df2: pandas.DataFrame | GeoDataFrame):
  if (df1 is None):
    return GeoDataFrame(df2)
  return typing.cast(GeoDataFrame, pandas.concat([df1, df2]))
