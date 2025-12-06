# Obwody głosowania w wyborach w Polsce
![Python](https://img.shields.io/badge/Python-3.12-cornflowerblue?style=flat&logo=python&logoColor=cornflowerblue)
![React](https://img.shields.io/badge/React-19-087ea4?style=flat&logo=react&logoColor=087ea4)
![Vite](https://img.shields.io/badge/Vite-7-mediumpurple?style=flat&logo=vite&logoColor=gold)

![mapa](/readme/map.png)

## Dodatkowe narzędzia

- [`mapshaper`](https://github.com/mbloch/mapshaper): Narzędzie do przetwarzania danych geoprzestrzennych
- [`tippecanoe`](https://github.com/felt/tippecanoe): Narzędzie do przerabiania plików w formacie `GeoJSON` na pliki `maptiles`
- [`martin`](https://martin.maplibre.org/): Serwer do hostowania plików wektorowych w formacie `maptiles`

## Sposób działania

1. Wstępne przetworzenie danych (oczyszczenie, poprawa literówek, błędów i różnych wersji zapisu tych samych nazw)
1. Analiza opisu granic zawartego w danych PKW (słowo po słowie) i rozłożenie go na tokeny:
    ```python
    {
      "token": "Przykładowa nieparzyste od 21 do 37a",
      "is_town": False,
      "is_street": False,
      "is_odd": True,
      "is_even": False,
      "town": "Warszawa",
      "street": "Przykładowa",
      "num_from": { "building_n": "21", "building_l": "" },
      "num_to": { "building_n": "37", "building_l": "a" },
      "except_addresses": []
    }
    ```
1. Przypisanie adresów do obwodu głosowania na podstawie wytworzonych tokenów
1. Nałożenie punktów adresowych na kształty obwodów statystycznych i podzielenie ich tesselacją Woronoja i połączenie wszystkich wielokątów należących do jednego obwodu w jeden

## Wymagane pliki:
### `scripts/data_in`:
- `districts.xlsx`: Lista obwodów głosowania (PKW) w formacie XLSX | **[pobierz](https://prezydent2025.pkw.gov.pl/prezydent2025/data/csv/obwody_glosowania_w_drugiej_turze_xlsx.1758650309.zip)**
- `gminy_dzielnice.json`: Kształty gmin i dzielnic Warszawy w formacie GeoJSON, na podstawie danych z PRG | **[pobierz](https://drive.google.com/file/d/1auMFntxOwR3d2Gwvi9O3RBANen03siQ7/view?usp=sharing)**
- `results_X_Y_Z.csv`: Pliki z wynikami wyborów w poszczególnych obwodach głosowania (PKW) w formacie CSV | **[pobierz](https://prezydent2025.pkw.gov.pl/prezydent2025/pl/dane_w_arkuszach)**
- `statistical_districts.zip`: Kształty okręgów statystycznych (GUS) w formacie SHP |  **[pobierz]()**
### `scripts/data_in/addresses`:
- Pliki od `02.zip` do `32.zip`: Punkty adresowe w województwach (PRG) w formacie SHP | **[pobierz](https://www.geoportal.gov.pl/pl/dane/panstwowy-rejestr-granic-prg)**
- `prng.zip`: Lista nazw miejscowości (PRNG) w formacie SHP | **[pobierz](https://www.geoportal.gov.pl/pl/dane/panstwowy-rejestr-nazw-geograficznych-prng)**

## Credits

- **Lista polskich imion** ([`names.csv`](/scripts/const/names.csv)): [andilabs/imiona-polskie-deklinacka](https://github.com/andilabs/imiona-polskie-deklinacja)
- **[OpenFreeMap]()**: Darmowy hosting maptiles OSM
