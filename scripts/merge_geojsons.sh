#!/bin/bash

if [[ -z $1 ]]; then
  echo "No election provided!"
  exit 1
fi

if [[ ! -d districts/$1 ]]; then
  echo "Directory districts/$1 doesn't exist!"
  exit 1
fi

echo "Merging GeoJSONs for $1..."
file_list=""
for file_name in districts/$1/*.json; do
  echo "Processing $file_name..."
  file_list="$file_list $file_name"
  mapshaper $file_name -clean -o force $file_name
done

echo "Processed all files!"
echo "Merging files..."
mapshaper -i $file_list combine-files \
  -merge-layers \
  -clean \
  -simplify 20% dp keep-shapes \
  -filter-slivers min-area=100 keep-shapes \
  -o districts/$1.json

echo "Creating .mbtiles..."
tippecanoe -o districts/$1.mbtiles -f --extend-zooms-if-still-dropping -pk districts/$1.json
mv districts/$1.mbtiles ../docker/martin/mbtiles
echo "Done!"
