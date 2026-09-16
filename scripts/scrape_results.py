from selenium.webdriver.chrome.webdriver import WebDriver
import pandas as pd
import time
from prepare_live_json import prepare_json
from utils import format_date, now
from scrape_utils import base_url, elections, load_district, get_int_from_row, load_districts_list, create_driver

sleep_time = 2 * 60

def process_district_results(url: str, driver: WebDriver):
  district_url = base_url + url
  parsed = load_district(district_url, driver)

  results_header = parsed.find(string="III. USTALENIE WYNIKÓW GŁOSOWANIA")
  if (not results_header):
    return None

  [voters_table, _, results, candidates] = parsed.select("div.pro .table.table-striped.table-hover")

  [_, voters_row, *_] = voters_table.find_all("tr")
  voters = get_int_from_row(voters_row)

  district_results = {
    "Liczba wyborców uprawnionych do głosowania": voters,
  }

  [_, _, _, all_votes_row, _, _, _, _, total_row, *_] = results.select("tr")
  all_votes = get_int_from_row(all_votes_row)
  total = get_int_from_row(total_row)
  district_results["Liczba kart ważnych"] = all_votes
  district_results["Liczba głosów ważnych"] = total

  for candidate_row in candidates.select("tbody tr"):
    name = candidate_row.select_one("td:nth-child(2) a").text
    result = get_int_from_row(candidate_row)
    district_results[name] = result

  return district_results

def scrape(driver: WebDriver):
  links = load_districts_list(driver)

  results = []
  for district in links:
    print(f"Processing district number {district["number"]}...")
    district_info = {}
    district_info["Nr komisji"] = district["number"]
    district_info["TERYT Gminy"] = district["teryt"]
    district_info["Gmina"] = district["gmina"]
    district_info["Powiat"] = district["powiat"]

    try:
      district_results = process_district_results(district["url"], driver)
      if (district_results):
        results.append({ **district_info, **district_results })
      time.sleep(0.1)
    except Exception as e:
      print(f"Unable to parse results for district {district["number"]}!", e)

  if (len(results) > 0):
    results_df = pd.DataFrame(results)
  else:
    results_df = pd.DataFrame(columns=["Nr komisji", "TERYT Gminy", "Gmina", "Powiat", "Liczba wyborców uprawnionych do głosowania", "Liczba kart ważnych", "Liczba głosów ważnych"])
  results_df.to_csv(f"data_in/results_{elections}.csv", sep=";", index=False)
  prepare_json(elections)

def main():
  while (True):
    start = now()
    print(f"Started scraping results at {format_date(start)}...")
    driver = create_driver()
    try:
      scrape(driver)
    except Exception as e:
      print(f"Error while scraping results for {elections}:", e)
    finally:
      driver.quit()
    end = now()
    print(f"Finished scraping results at {format_date(end)} (took {end.timestamp() - start.timestamp():.2f} sec).")
    time.sleep(sleep_time)

if (__name__ == "__main__"):
  main()
