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

results_columns = {
  "Gmina": "gmina",
  "Powiat": "powiat",
  "Teryt Gminy": "teryt",
  "Nr komisji": "number",
  "Liczba głosów ważnych oddanych łącznie na wszystkich kandydatów (z kart ważnych)": "total",
  "Liczba kart ważnych": "all_votes",
  "Liczba wyborców uprawnionych do głosowania (umieszczonych w spisie, z uwzględnieniem dodatkowych formularzy) w chwili zakończenia głosowania": "voters"
}

candidates = {
  "BARTOSZEWICZ Artur": "bartosiewicz",
  "BIEJAT Magdalena Agnieszka": "biejat",
  "BRAUN Grzegorz Michał": "braun",
  "HOŁOWNIA Szymon Franciszek": "holownia",
  "JAKUBIAK Marek": "jakubiak",
  "MACIAK Maciej": "maciak",
  "MENTZEN Sławomir Jerzy": "mentzen",
  "NAWROCKI Karol Tadeusz": "nawrocki",
  "SENYSZYN Joanna": "senyszyn",
  "STANOWSKI Krzysztof Jakub": "stanowski",
  "TRZASKOWSKI Rafał Kazimierz": "trzaskowski",
  "WOCH Marek Marian": "woch",
  "ZANDBERG Adrian Tadeusz": "zandberg",
}

char_order = list("aąbcćdefghijklłmnńoópqrsśtuvwxyzżź0123456789")

building_num_regex = r"((\d+)\w*|\w{1,2})$"
building_letter_regex = r"\d*(\w*)$"
all_regex = r"cał[ae]"
odd_regex = r"nieparzyst[ae]"
even_regex = r"parzyst[ae]"
first_name_letter_regex = r"^(([kK]s\.|[kK]siędza|[bB]p.|[bB]iskupa|[gG]en.|[gG]enerała|[pP]l.|[pP]lac)\s+)?(\p{Lu}(ł|h|z)?\s*\.(\s+(i\s+)?\p{Lu}(ł|h|z)?\s*\.)?\s+)"
holy_name_regex = r"(św\.|świętego|świętej|świętych)\s+"
ordinal_regex = r"\s*-\s*(go|ej)"
multiple_number_regex = r"(\d+\w*|\w+)\s?([-,/._]|s\.)\s?(\d*\w*\s?([-,/._]|s\.)?\s?)+"
quotation_regex = r'[„"]\s*(\S+)\s*[”"]'
dash_regex = r"[-–—―−]" # I hate it here.
