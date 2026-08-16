import pandas as pd
import geopandas as geo
from typing import TypeVar

T = TypeVar("T", pd.DataFrame, geo.GeoDataFrame)

def filter_columns(df: T, columns: list[str]) -> T:
  columns_to_filter = []
  for column in columns:
    if (column in df and column not in columns_to_filter):
      columns_to_filter.append(column)

  return df[columns_to_filter]

def remove_columns(df: T, columns: list[str]) -> T:
  columns_to_retain = []
  for column in df.columns:
    if (column not in columns and column not in columns_to_retain):
      columns_to_retain.append(column)

  return df[columns_to_retain]
