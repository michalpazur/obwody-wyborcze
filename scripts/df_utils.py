import pandas as pd
from typing import TypeVar
from const import candidates, merged_columns
from utils import get_district

AnyDataFrame = TypeVar("AnyDataFrame", bound=pd.DataFrame)

def filter_columns(df: AnyDataFrame, columns: list[str]) -> AnyDataFrame:
  columns_to_filter = []
  for column in columns:
    if (column in df and column not in columns_to_filter):
      columns_to_filter.append(column)

  return df[columns_to_filter]

def remove_columns(df: AnyDataFrame, columns: list[str]) -> AnyDataFrame:
  columns_to_retain = []
  for column in df.columns:
    if (column not in columns and column not in columns_to_retain):
      columns_to_retain.append(column)

  return df[columns_to_retain]

def get_results_columns(results: pd.DataFrame):
  candidates_columns = [candidates[key] for key in candidates]
  candidates_columns = list(filter(lambda key: key in results, candidates_columns))
  candidates_columns = list(dict.fromkeys(candidates_columns))
  merged_columns_list = filter(lambda key: key in results, [merged_columns[key] for key in merged_columns])
  merged_columns_list = list(merged_columns_list)
  proc_columns = [name + "_proc" for name in candidates_columns]

  return merged_columns_list, candidates_columns, proc_columns

def load_results_csv(elections: str):
  results = pd.read_csv(f"data_in/results_{elections}.csv", sep=";", converters={ "Teryt Gminy": lambda x: x.zfill(6), "TERYT Gminy": lambda x: x.zfill(6) })
  return results

def load_results(elections: str):
  results = load_results_csv(elections)
  results = results.rename(columns=merged_columns)

  merged_columns_list, _, _ = get_results_columns(results)

  results = filter_columns(results, merged_columns_list)
  results["number"] = pd.to_numeric(results["number"], downcast="integer")
  results = sort_by_district(results)
  results["district"] = results.apply(get_district, axis=1)
  return results

def sort_by_district(df: AnyDataFrame) -> AnyDataFrame:
  if ("teryt" not in df):
    print("No TERYT in DataFrame!")
    return df

  if ("number" not in df):
    print("No district number in DataFrame!")
    return df
  
  df["number"] = pd.to_numeric(df["number"], downcast="integer")
  return df.sort_values(by=["teryt", "number"])
