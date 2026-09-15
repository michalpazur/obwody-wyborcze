FROM python:3.12-slim
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends chromium chromium-driver tzdata \
  && rm -rf /var/lib/apt/lists/*
COPY scripts/scrape_requirements.txt ./
RUN pip install --no-cache-dir -r scrape_requirements.txt
COPY scripts/scrape_results.py scripts/const.py scripts/df_utils.py scripts/utils.py scripts/prepare_live_json.py ./
CMD ["python", "-u", "scrape_results.py"]
