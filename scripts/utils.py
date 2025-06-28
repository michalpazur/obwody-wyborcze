from pandas import DataFrame
from geopandas import GeoDataFrame
import os

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

def save_zip(path: str, gdf: GeoDataFrame):
  gdf.to_file(f"{path}.shz", driver="ESRI Shapefile")
  os.rename(f"{path}.shz", f"{path}.zip")
