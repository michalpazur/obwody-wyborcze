districts_columns = {
  "TERYT gminy": "teryt",
  "Gmina": "gmina",
  "Powiat": "powiat",
  "Województwo": "voivodeship",
  "Numer": "number",
  "Siedziba": "location",
  "Miejscowość": "town",
  "Ulica": "street",
  "Numer posesji": "building",
  "Kod pocztowy": "post_code",
  "Poczta": "post_off",
  "Typ obwodu": "type",
  "Opis granic": "borders",
}

addresses_columns = {
  "TERYT": "teryt",
  "PNA": "post_code",
  "SIMC_nazwa": "town",
  "ULIC_nazwa": "street",
  "Numer": "building",
  "geometry": "geometry"
}

district_types = {
  "areszt śledczy": 0,
  "dom pomocy społecznej": 0,
  "dom studencki": 0,
  "oddział zewnętrzny aresztu śledczego": 0,
  "oddział zewnętrzny zakładu karnego": 0,
  "zakład karny": 0,
  "zakład leczniczy": 0,
  "zespół domów studenckich": 0,
  "stały": 1
}

building_num_regex = r"((\d+)\w*|\w{1})$"
building_letter_regex = r"\d+(\w*)$"
all_regex = r"cał[ae]"
odd_regex = r"nieparzyst[ae]"
even_regex = r"parzyst[ae]"
