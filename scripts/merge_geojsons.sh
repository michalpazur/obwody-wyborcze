#!/bin/bash

elections=$1
if [[ -z $elections ]]; then
  echo "No election provided!"
  exit 1
fi

if [[ ! -d districts/$elections ]]; then
  echo "Directory districts/$elections doesn't exist!"
  exit 1
fi

create_map_files() {
  input_=$1
  output_=$2
  echo "Input $1 output $2"
  echo "Merging files for $2..."
  mapshaper -i $input_ combine-files \
    -merge-layers \
    -clean \
    -simplify 20% dp keep-shapes \
    -filter-slivers min-area=100 keep-shapes \
    -o districts/$output_.json
  
  echo "Creating .mbtiles..."
  tippecanoe -o districts/$output_.mbtiles -f --extend-zooms-if-still-dropping -pk districts/$output_.json
  mv districts/$output_.mbtiles ../docker/martin/mbtiles
}

create_shapes() {
  file_name="districts/$elections/$1.json"
  output_=$(echo "$elections""_$1")
  echo $elections $file_name $output
  if [[ ! -e $file_name ]]; then
    echo "Skipping file $file_name..."
    return 0
  fi
  create_map_files "$file_name" "$output_"
}

echo "Merging GeoJSONs for $elections..."
file_list=""
for file_name in districts/$elections/*.json; do
  echo "Processing $file_name..."
  if [[ "$file_name" =~ [0-9]{2}.json ]]; then
    file_list="$file_list $file_name"
  fi
  mapshaper $file_name -clean -o force $file_name
done

echo "Processed all files!"

create_map_files "$file_list" "$elections"

create_shapes "gminy"
create_shapes "constituencies"

echo "Done!"
