from pandas import DataFrame
import pandas
from geopandas import GeoDataFrame
import os
import re, regex
from const import first_name_letter_regex, holy_name_regex
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
    names = [name + "\\s+" for name in names]
    names_regex = "|".join(names)
    self.names_regex = names_regex
    self.names_exceptions = load_names_exceptions()

  def remove_first_name(self, street: str):
    if (re.search(self.names_exceptions, street)):
      return street
    
    if (re.search(holy_name_regex, street, flags=re.IGNORECASE)):
      return street
    
    return re.sub(self.names_regex, "", street)

  def remove_first_letter(self, street: str):
    return regex.sub(first_name_letter_regex, "", street)

def save_zip(path: str, gdf: GeoDataFrame):
  gdf.to_file(f"{path}.shz", driver="ESRI Shapefile")
  os.rename(f"{path}.shz", f"{path}.zip")

def concat(df1: GeoDataFrame | None, df2: GeoDataFrame):
  if (df1 is None):
    return df2
  return typing.cast(GeoDataFrame, pandas.concat([df1, df2]))
