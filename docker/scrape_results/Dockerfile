FROM python:3.12-alpine
WORKDIR /app
COPY scripts/scrape_requirements.txt ./
RUN pip install --no-cache-dir -r scrape_requirements.txt
COPY scripts/scrape_results_csv.py scripts/const.py scripts/df_utils.py scripts/utils.py scripts/prepare_live_json.py ./
CMD ["python", "-u", "scrape_results_csv.py"]
