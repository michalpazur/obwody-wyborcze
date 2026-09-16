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
from os import path
from typing import TypedDict, List

# Installed by the Docker image, falls back to webdriver_manager when running locally.
chromedriver_path = "/usr/bin/chromedriver"
headless = path.exists(chromedriver_path)

base_url = "https://wybory.gov.pl"
districts_url = "/wojtburmistrz_2024_2029/pl/4485/organy_wyborcze/komisje_obwodowe"
elections = "mayor_krk2026_1"

class DistrictInfo(TypedDict):
  number: str
  url: str
  teryt: str
  gmina: str
  powiat: str

def load_district(url: str, driver: WebDriver):
  driver.get(url)
  WebDriverWait(driver, 10).until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, ".obkw h1.title"), "Obwodowa Komisja Wyborcza"))
  html = driver.execute_script("return document.body.innerHTML")
  return BS(html, "html.parser")

def load_districts_list(driver: WebDriver) -> List[DistrictInfo]:
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
  links: List[DistrictInfo] = []

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

      number = str(anchor.select_one(".hidden")["data-val"])
      href = str(anchor["href"])

      district: DistrictInfo = { 
        "number": number,
        "url": href,
        "teryt": "126101",
        "gmina": "Kraków",
        "powiat": "Kraków",
      }

      links.append(district)
    try:
      next_button = driver.find_element(By.CSS_SELECTOR, ".page-item.next")
      ActionChains(driver).move_to_element(next_button).perform()
      next_button.click()
      page += 1
    except Exception as e:
      print("No next page button found!")

  return links

def get_int_from_row(row: Tag):
  last_cell = row.select_one(".text-end")
  return int(last_cell.text)

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
