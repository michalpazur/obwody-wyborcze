import {
  ExpressionSpecification,
  LngLat,
  MapLayerMouseEvent,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Layer,
  Map as MapComponent,
  MapRef,
  Source,
} from "react-map-gl/maplibre";
import { candidatesConfig, electionsConfig, tieGradient } from "../../config";
import { useElectionsStore } from "../../redux/electionsSlice";
import { DistrictInfo } from "../../types";
import { generateFillColors } from "../../utils/generateFillColors";
import DistrictInfoComponent from "./components/DistrictInfo";
import Legend from "./components/Legend";
import Popup from "./components/Popup";

const opacity = 0.75;

const Map = () => {
  const mapRef = useRef<MapRef>(null);
  const [hovered, setHovered] = useState<DistrictInfo>();
  const [clicked, setClicked] = useState<DistrictInfo>();
  const [hoverPosition, setHoverPosition] = useState<LngLat>();
  const { elections } = useElectionsStore();

  useEffect(() => {
    setHovered(undefined);
    setClicked(undefined);
  }, [elections]);

  const onHover = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      console.log(feature);
      setHoverPosition(event.lngLat);
      const sourceLayer = electionsConfig[elections].sourceLayer;
      if (feature) {
        if (hovered) {
          mapRef.current?.setFeatureState(
            {
              source: elections,
              sourceLayer: sourceLayer,
              id: hovered.id,
            },
            { hovered: false }
          );
        }
        setHovered({ ...feature.properties, id: feature.id } as DistrictInfo);
        mapRef.current?.setFeatureState(
          { source: elections, sourceLayer, id: feature.id },
          { hovered: true }
        );
      }
    },
    [hovered, elections]
  );

  const onClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (clicked?.id === feature?.id) {
        setClicked(undefined);
      } else if (feature) {
        setClicked({ ...feature.properties, id: feature.id } as DistrictInfo);
      }
    },
    [clicked]
  );

  const mapLayers = useMemo(() => {
    const selectedElections = electionsConfig[elections];

    return (
      <Source
        id={elections}
        key={elections}
        type="vector"
        tiles={[
          `https://api.mapbox.com/v4/${
            selectedElections.tilesetId
          }/{z}/{x}/{y}.vector.pbf?access_token=${
            import.meta.env.VITE_MAPBOX_TOKEN
          }`,
        ]}
      >
        {electionsConfig[elections].winners.map((winnerId) => (
          <Layer
            key={winnerId}
            filter={["==", "winner", winnerId]}
            id={winnerId}
            type="fill"
            source-layer={selectedElections.sourceLayer}
            paint={{
              "fill-color": generateFillColors(
                `${winnerId}_proc`,
                candidatesConfig[winnerId].gradient
              ),
              "fill-outline-color": generateFillColors(
                `${winnerId}_proc`,
                candidatesConfig[winnerId].gradient
              ),
              "fill-opacity": opacity,
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
          source-layer={selectedElections.sourceLayer}
          paint={{
            "fill-color": generateFillColors("winner_proc", tieGradient),
            "fill-outline-color": generateFillColors(
              "winner_proc",
              tieGradient
            ),
            "fill-opacity": opacity,
          }}
        />
        <Layer
          id="outline"
          type="line"
          source-layer={selectedElections.sourceLayer}
          paint={{
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              12,
              1,
              14,
              3,
              17,
              6,
            ],
            "line-color": "#171717",
            "line-opacity": [
              "case",
              ["boolean", ["feature-state", "hovered"], false],
              1,
              0,
            ],
          }}
        />
      </Source>
    );
  }, [elections]);

  return (
    <MapComponent
      ref={mapRef}
      initialViewState={{
        latitude: 52.2319581,
        longitude: 21.0067249,
        zoom: 13,
      }}
      onMouseMove={onHover}
      onClick={onClick}
      interactiveLayerIds={[...electionsConfig.pres_2025_1.winners, "tie"]}
      style={{ width: "100%", height: "100%" }}
      mapStyle={`https://api.maptiler.com/maps/dataviz-light/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`}
    >
      {mapLayers}
      {hovered && hoverPosition ? (
        <Popup district={hovered} position={hoverPosition} />
      ) : null}
      <Legend />
      <DistrictInfoComponent
        districtInfo={clicked}
        setDistrictInfo={setClicked}
      />
    </MapComponent>
  );
};

export default Map;
