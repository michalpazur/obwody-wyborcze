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

streets_columns = {
  "TERYT": "teryt",
  "SIMC_nazwa": "town",
  "ULIC_nazwa": "street",
  "geometry": "geometry"
}

addresses_columns = {
  **streets_columns,
  "PNA": "post_code",
  "Numer": "building",
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
first_name_letter_regex = r"\p{Lu}(ł|h)?\.(\s+(i\s+)?\p{Lu}(ł|h)?\.)?\s+"
holy_name_regex = r"(św\.|świętego|świętej|świętych)\s+"
ordinal_regex = r"\s*-\s*(go|ej)"
