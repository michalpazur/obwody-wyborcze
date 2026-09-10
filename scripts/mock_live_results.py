from os import path
import shutil
import random
import time
from prepare_live_json import prepare_json
from utils import format_date, now
from df_utils import load_results_csv

elections = "pres_2025_1"
source_path = path.join("data_in", f"results_{elections}.csv")
backup_path = f"{source_path}.bak"
min_increment = 50
max_increment = 500
sleep_time = 2 * 60

def restore_backup():
  print(f"Restoring backup for {elections}...")
  shutil.move(backup_path, source_path)

def main():

  if (not path.exists(source_path)):
    raise ValueError(f"No input file found for elections {elections}!")
  try:
    if (not path.exists(backup_path)):
      print(f"Creating backup for {source_path}...")
      shutil.copy2(source_path, backup_path)

    results = load_results_csv(elections)
    results = results.sample(frac=1).reset_index(drop=True)
    reported = 0
    to_report = len(results)
    while (reported < to_report):
      time.sleep(sleep_time if reported != 0 else 0)

      to_count = int(random.random() * (max_increment - min_increment + 1)) + min_increment
      to_count = min(to_count, to_report - reported)
      reported += to_count

      partial_results = results[:reported]
      partial_results.to_csv(source_path, sep=";", index=False)
      prepare_json(elections)
      print(f"Reporting {reported} out of {to_report} districts ({(reported * 100 / to_report):.2f}%).")
  except Exception as e:
    print(f"Error while running {elections} mock:", e)
    restore_backup()
    raise e

  print(f"Mock vote count finished at {format_date(now())}.")
  restore_backup()

if (__name__ == "__main__"):
  main()
