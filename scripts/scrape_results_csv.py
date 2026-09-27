import requests
import time
import os
from zipfile import ZipFile
from prepare_live_json import prepare_json
from utils import format_date, now

elections = "mayor_krk2026_1"

sleep_time = 1 * 60

def download_results():
  response = requests.get("https://wybory.gov.pl/wojtburmistrz_2024_2029/data/csv/4485/protokoly_po_obwodach_20260927_WBP_Krakow_tura_1_csv.zip", allow_redirects=True)
  with open(f"data_in/{elections}.zip", "wb") as zip_file:
    zip_file.write(response.content)

  with ZipFile(f"data_in/{elections}.zip") as zip_file:
    zip_file.extract("protokoly_po_obwodach_20260927_WBP_Krakow_tura_1_utf8.csv", path="data_in")
    os.rename("data_in/protokoly_po_obwodach_20260927_WBP_Krakow_tura_1_utf8.csv", f"data_in/results_{elections}.csv")
  
  prepare_json(elections)

def main():
  while (True):
    start = now()
    print(f"Started scraping results at {format_date(start)}...")
    try:
      download_results()
    except Exception as e:
      print(f"Error while scraping results for {elections}:", e)
    end = now()
    print(f"Finished scraping results at {format_date(end)} (took {end.timestamp() - start.timestamp():.2f} sec).")
    time.sleep(sleep_time)

if (__name__ == "__main__"):
  main()
