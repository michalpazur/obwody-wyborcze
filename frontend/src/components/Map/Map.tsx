import "maplibre-gl/dist/maplibre-gl.css";
import { Layer, Map as MapComponent, Source } from "react-map-gl/maplibre";

const colors = {
  20: "#e0f2f199",
  40: "#80cbc499",
  60: "#26a69a99",
  80: "#00897b99",
  100: "#004d4099",
};

const fillColor = ["case"];
const keys = Object.keys(colors);
keys.forEach((key, index) => {
  const isFirst = index === 0;
  const isLast = index === keys.length - 1;
  const lastElement = isFirst ? 0 : keys[index - 1];
  if (isFirst) {
    fillColor.push(["<", ["get", "turnout"], Number(key)]);
  } else if (isLast) {
    fillColor.push([">=", ["get", "turnout"], Number(lastElement)]);
  } else {
    fillColor.push([
      "all",
      [">=", ["get", "turnout"], Number(lastElement)],
      ["<", ["get", "turnout"], Number(key)],
    ]);
  }
  fillColor.push(colors[key]);
});
fillColor.push("#000000");

const Map = () => {
  return (
    <MapComponent
      initialViewState={{
        latitude: 52.2319581,
        longitude: 21.0067249,
        zoom: 15,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle={`https://api.maptiler.com/maps/dataviz-light/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`}
    >
      <Source
        id="pres_2025_1"
        type="vector"
        url={`https://api.maptiler.com/tiles/01984855-b44c-75a1-8463-876f2a7f32b3/tiles.json?key=${
          import.meta.env.VITE_MAPTILER_TOKEN
        }`}
      >
        <Layer
          type="fill"
          source-layer="pres_2025_1"
          paint={{
            "fill-color": fillColor,
            "fill-outline-color": fillColor
          }}
        />
      </Source>
    </MapComponent>
  );
};

export default Map;
