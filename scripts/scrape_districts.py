from selenium.webdriver.chrome.webdriver import WebDriver
import pandas as pd
from pandas import DataFrame
from utils import get_district, get_election_id
from df_utils import remove_columns
from scrape_utils import base_url, elections, load_district, load_districts_list, create_driver

reference_elections = "ref_krk2026"

def process_district(url: str, driver: WebDriver):
  district_url = base_url + url
  parsed = load_district(district_url, driver)
  district_table = parsed.select_one(".obkw dl")
  district_info = {}
  if (not district_table):
    raise ValueError(f"No district table found for url {district_url}!")
  
  [location, _type, accessible, borders] = [dd.text for dd in district_table.find_all("dd")]
  district_info["location"] = location.split(",")[0]
  district_info["type"] = _type.lower()
  district_info["borders"] = borders
  return district_info

def main():
  driver = create_driver()
  links = load_districts_list(driver)

  districts = []
  for district in links:
    print(f"Processing district number {district["number"]}...")
    district_info = {}

    try:
      district_info = process_district(district["url"], driver)
      if (district_info):
        districts.append({ **district, **district_info })
    except Exception as e:
      print(f"Unable to parse district {district["number"]} page!", e)

  if (len(districts) == 0):
    raise ValueError("No districts found!")

  districts_df = DataFrame(districts)
  prev_districts = pd.read_csv(f"data_processed/districts_{reference_elections}.csv", converters={ "teryt": str, "number": str }, sep="|")
  prev_districts = prev_districts[prev_districts["teryt"] == districts[0]["teryt"]]
  prev_districts = remove_columns(prev_districts, ["type", "teryt", "borders"])
  # We can fill the missing fields using previously downloaded data, manual verification is still required
  districts_df = pd.merge(districts_df, prev_districts, on=["location", "number"], how="left")
  districts_df["district"] = districts_df.apply(get_district, axis=1)

  empty = districts_df[districts_df["f_address"].isna()]
  if (len(empty) > 0):
    print(f"Found {len(empty)} districts without a match!")
    print(f"Input data manually for districts: {", ".join(empty["number"].tolist())}...")

  districts_df.to_csv(f"data_processed/districts_{get_election_id(elections)}.csv", sep="|", index=False)

if (__name__ == "__main__"):
  main()
