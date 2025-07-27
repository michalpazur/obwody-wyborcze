import "maplibre-gl/dist/maplibre-gl.css";
import { useRef } from "react";
import {
  Layer,
  Map as MapComponent,
  MapRef,
  Source,
} from "react-map-gl/maplibre";
import { candidatesConfig, electionsConfig } from "../../config";
import { ExpressionSpecification } from "maplibre-gl";

const Map = () => {
  const mapRef = useRef<MapRef>(null);

  return (
    <MapComponent
      ref={mapRef}
      initialViewState={{
        latitude: 52.2319581,
        longitude: 21.0067249,
        zoom: 13,
      }}
      interactiveLayerIds={["votes"]}
      style={{ width: "100%", height: "100%" }}
      mapStyle={`https://api.maptiler.com/maps/dataviz-light/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`}
    >
      <Source
        id="pres_2025_1"
        type="vector"
        url={`https://api.maptiler.com/tiles/${
          electionsConfig.pres_2025_1.tilesetId
        }/tiles.json?key=${import.meta.env.VITE_MAPTILER_TOKEN}`}
      >
        {electionsConfig.pres_2025_1.winners.map((winnerId) => (
          <Layer
            key={winnerId}
            filter={["==", "winner", winnerId]}
            id={winnerId}
            type="fill"
            source-layer="pres_2025_1"
            paint={{
              "fill-color": candidatesConfig[winnerId].color,
              "fill-outline-color": candidatesConfig[winnerId].color,
              "fill-opacity": 0.6,
            }}
          />
        ))}
        <Layer
          filter={[
            "all",
            ...electionsConfig.pres_2025_1.winners.map(
              (winner) => ["!=", "winner", winner] as ExpressionSpecification
            ),
          ]}
          id="tie"
          type="fill"
          source-layer="pres_2025_1"
          paint={{
            "fill-color": "#616161",
            "fill-outline-color": "#616161",
            "fill-opacity": 0.6,
          }}
        />
      </Source>
    </MapComponent>
  );
};

export default Map;
