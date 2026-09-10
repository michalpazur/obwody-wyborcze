import os
import typing
import pandas
from geopandas import GeoDataFrame

def save_zip(path: str, gdf: GeoDataFrame):
  gdf.to_file(f"{path}.shz", driver="ESRI Shapefile")
  os.rename(f"{path}.shz", f"{path}.zip")

def concat(df1: GeoDataFrame | None, df2: pandas.DataFrame | GeoDataFrame):
  if (df1 is None):
    return GeoDataFrame(df2)
  return typing.cast(GeoDataFrame, pandas.concat([df1, df2]))
