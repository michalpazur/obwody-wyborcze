import json
import numpy as np
import pandas as pd
import os
from os import path
from datetime import datetime
from zoneinfo import ZoneInfo
from utils import get_election_id
from df_utils import load_results, get_results_columns

waw_tz = ZoneInfo("Europe/Warsaw")
elections = "pres_2025_1"
results_dir = path.join("..", "docker", "results")
file_path = path.join(results_dir, f"{elections}.json")

def format_date(date: datetime):
  return date.strftime("%Y-%m-%d %H:%M:%S")

def to_int_list(column: pd.Series):
  return list(map(lambda x: None if np.isnan(x) else int(x), column.to_list()))

def prepare_json():
  start = datetime.now(tz=waw_tz)
  print(f"Started preparing results at {start.strftime("%Y-%m-%d %H:%M:%S")}...")
  results = load_results(elections)
  election_id = get_election_id(elections)
  districts = pd.read_csv(f"data_processed/districts_{election_id}.csv", sep="|", converters={ "teryt": str })

  try:
    with open(file_path, "r", encoding="utf-8") as results_file:
      saved_results = json.load(results_file)
      prev_counted = saved_results["reported"]
      to_count = len(results)
      if (prev_counted >= to_count):
        saved_modified_at = datetime.fromtimestamp(path.getmtime(file_path))
        results_modified_at = datetime.fromtimestamp(path.getmtime(f"data_in/results_{elections}.csv"))
        print(f"Skipping results update. Previously counted: {prev_counted}, to count: {to_count}. Saved results files updated at {format_date(saved_modified_at)}, results source file updated at {format_date(results_modified_at)}.")
        return
  except:
    print(f"No previously saved results found for {elections}!")
  _, candidates, _ = get_results_columns(results)

  print("Merging districts and results...")
  districts = districts[["district"]]
  results = districts.merge(results, on="district", how="left", indicator=True)
  results.loc[results["_merge"] == "left_only", "counted"] = 0
  results.loc[results["_merge"] == "both", "counted"] = 1

  all_votes = results["all_votes"].sum()
  total = results["total"].sum()
  voters = results["voters"].sum()

  counted_districts = to_int_list(results["counted"])
  all_districts = results["district"].to_list()
  counted = len(results[results["counted"] == 1])

  results_by_candidate = {}
  results_by_district = {}
  for candidate in candidates:
    results_by_candidate[candidate] = int(results[candidate].sum())
    results_by_district[candidate] = to_int_list(results[candidate])

  results_by_district["voters"] = to_int_list(results["voters"])
  results_by_district["allVotes"] = to_int_list(results["all_votes"])
  results_by_district["total"] = to_int_list(results["total"])

  results_json = {
    "candidates": candidates,
    "districts": all_districts,
    "counted": counted_districts,
    "reported": counted,
    "totalDistricts": len(districts),
    "byDistrict": results_by_district,
    "results": results_by_candidate,
    "voters": int(voters),
    "allVotes": int(all_votes),
    "total": int(total),
    "timestamp": datetime.now(tz=waw_tz).isoformat(),
  }

  if (not path.exists(results_dir)):
    os.mkdir(results_dir)

  tmp_path = path.join(results_dir, f"{elections}_tmp.json")
  with open(tmp_path, "w", encoding="utf-8") as dest_file:
    json.dump(results_json, dest_file, separators=(",", ":"))

  os.rename(tmp_path, file_path)
  end = datetime.now(tz=waw_tz)
  print(f"Finished preparing results at {format_date(end)} (took {end.timestamp() - start.timestamp():.2f} sec).")

if (__name__ == "__main__"):
  prepare_json()
