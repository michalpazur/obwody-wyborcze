from pandas import DataFrame
import pandas
from geopandas import GeoDataFrame
import os
import re, regex
from const import first_name_letter_regex, holy_name_regex, char_order, ordinal_regex, quotation_regex, multiple_number_regex, dash_regex
import typing

def head(df: DataFrame, n: int = 5):
  print(df.head(n))

def capitalize(x):
  return x[:1].upper() + x[1:]

def load_replacements():
  with open("const/street_replacements.csv") as replacements_file:
    replacements = [line.strip().split(";") for line in replacements_file.readlines()]
    replacements = dict(zip([x[0] for x in replacements], [x[1] for x in replacements]))
  return replacements

def load_street_prefixes():
  with open("const/street_prefixes.csv") as prefixes_file:
    lines = [line.strip().split(";") for line in prefixes_file.readlines()]
    prefixes = dict(zip([f"{x[0]}\\.?\\s+" for x in lines], [x[1] if x == "" else f"{x[1]} " for x in lines]))
  return prefixes

def load_names():
  with open("const/names.csv") as names_file:
    lines = [line.strip().split(";") for line in names_file.readlines()]
    names = [line[2].strip() for line in lines]

  return names

def load_names_exceptions():
  with open("const/names_exceptions.txt") as exceptions_file:
    lines = [line.strip() for line in exceptions_file.readlines()]
    regexes = ["\\s+".join(name.split(" ")) for name in lines]

  return "|".join(regexes)

class Utils:
  def __init__(self):
    names = load_names()
    self.names = names
    names_regex = "(" + "|".join(names) + ")"
    names_regex = f"{names_regex}(\\s+(i\\s+)?{names_regex})?\\s+"
    self.names_regex = names_regex
    self.names_exceptions = load_names_exceptions()
    self.replacements = load_replacements()
    self.street_prefixes = load_street_prefixes()

  def remove_first_name(self, street: str):
    if (re.search(self.names_exceptions, street)):
      return street
    
    if (re.search(holy_name_regex, street, flags=re.IGNORECASE)):
      return street
    
    return re.sub(self.names_regex, "", street)

  def remove_first_letter(self, street: str):
    return regex.sub(first_name_letter_regex, "", street)
  
  def transform_street_name(self, street: str):
    for search in self.street_prefixes:
      street = re.sub(search, self.street_prefixes[search], street, flags=re.IGNORECASE)
    for search in self.replacements:
      street = re.sub(re.escape(search), self.replacements[search], street, flags=re.IGNORECASE)
    street = re.sub(r"\s+", " ", street.strip()).replace(":", "")
    street = self.remove_first_name(street)
    street = self.remove_first_letter(street)
    street = re.sub(ordinal_regex, "", street)
    street = re.sub(quotation_regex, r'"\1"', street)
    street = re.sub(multiple_number_regex, r"\1", street)
    street = street.replace("´", "'")
    street = re.sub(dash_regex, "-", street)
    street = re.sub(ordinal_regex, "", street)
    street = capitalize(street)

    return street

max_letters = 3
def get_building_order(building_n: int | str, building_l: str):
  try:
    number = int(building_n) * pow(10, max_letters * 2)
    if (building_l == ""):
      return number
  except:
    return 0
  
  for i in range(min(len(building_l), max_letters)):
    curr_pow = (max_letters - i - 1) * 2
    char = building_l[i:i+1]
    char_ord = char_order.index(char) + 1
    number += (char_ord * pow(10, curr_pow))
  
  return number

def save_zip(path: str, gdf: GeoDataFrame):
  gdf.to_file(f"{path}.shz", driver="ESRI Shapefile")
  os.rename(f"{path}.shz", f"{path}.zip")

def concat(df1: GeoDataFrame | None, df2: GeoDataFrame):
  if (df1 is None):
    return df2
  return typing.cast(GeoDataFrame, pandas.concat([df1, df2]))
