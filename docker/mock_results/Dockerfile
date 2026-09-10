FROM python:3.12-alpine
WORKDIR /app
COPY scripts/requirements_results.txt ./
RUN pip install --no-cache-dir -r requirements_results.txt
COPY scripts/mock_live_results.py scripts/const.py scripts/df_utils.py scripts/utils.py scripts/prepare_live_json.py ./
CMD ["python", "-u", "mock_live_results.py"]
