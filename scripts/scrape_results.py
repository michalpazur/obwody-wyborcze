from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.chrome.webdriver import WebDriver
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup as BS, Tag
import pandas as pd
import time
from os import path
from prepare_live_json import prepare_json
from utils import format_date, now

base_url = "https://wybory.gov.pl"
districts_url = "/wojtburmistrz_2024_2029/pl/4485/organy_wyborcze/komisje_obwodowe"
elections = "mayor_krakow2026_1"
sleep_time = 2 * 60
# Installed by the Docker image, falls back to webdriver_manager when running locally.
chromedriver_path = "/usr/bin/chromedriver"
headless = path.exists(chromedriver_path)

def load_district(url: str, driver: WebDriver):
  driver.get(url)
  WebDriverWait(driver, 10).until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, ".obkw h1.title"), "Obwodowa Komisja Wyborcza"))
  html = driver.execute_script("return document.body.innerHTML")
  return BS(html, "html.parser")

def get_int_from_row(row: Tag):
  last_cell = row.select_one(".text-end")
  return int(last_cell.text)

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

def create_driver():
  if (path.exists(chromedriver_path)):
    service = ChromeService(executable_path=chromedriver_path)
  else:
    service = ChromeService(executable_path=ChromeDriverManager().install())
  options = ChromeOptions()
  options.add_argument("--window-size=1280,720")
  if (headless):
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
  return webdriver.Chrome(options=options, service=service)

def scrape(driver: WebDriver):
  driver.get(base_url + districts_url)
  WebDriverWait(driver, 10).until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, "h1[data-t='OBKW_SEARCH_L']"), "Wyszukiwarka obwodowych komisji wyborczych"))

  try:
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".cookies.actual [data-t='CLOSE']")))
    close_cookies_button = driver.find_element(By.CSS_SELECTOR, ".cookies.actual [data-t='CLOSE']")
    close_cookies_button.click()
  except:
    print("No cookie button found!")

  num_elements = 10
  page = 1
  links = []

  while (num_elements == 10):
    print(f"Processing page {page}...")
    source = driver.execute_script("return document.body.innerHTML")
    parsed = BS(source, "html.parser")
    table = parsed.find(id="DataTables_Table_0")
    if (not table):
      raise ValueError("No table found!")

    district_rows = table.select("tbody > tr")
    num_elements = len(district_rows)
    for row in district_rows:
      anchor = row.find("a")
      if (not anchor):
        raise ValueError("No anchor found!")
      number = anchor.select_one(".hidden")["data-val"]
      href = str(anchor["href"])
      links.append({ "number": number, "url": href })
    try:
      next_button = driver.find_element(By.CSS_SELECTOR, ".page-item.next")
      ActionChains(driver).move_to_element(next_button).perform()
      next_button.click()
      page += 1
    except Exception as e:
      print("No next page button found!")

  results = []
  for district in links:
    print(f"Processing district number {district["number"]}...")
    district_info = {}
    district_info["Nr komisji"] = district["number"]
    district_info["TERYT Gminy"] = "126101"
    district_info["Gmina"] = "Kraków"
    district_info["Powiat"] = "Kraków"
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
