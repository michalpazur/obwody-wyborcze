import {
  ExpressionSpecification,
  GeoJSONFeature,
  LngLat,
  MapLayerMouseEvent,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Layer,
  Map as MapComponent,
  MapRef,
  Source,
} from "react-map-gl/maplibre";
import {
  candidatesConfig,
  electionsConfig,
  mapOpacity,
  tieGradient,
} from "../../config";
import { useElectionsStore } from "../../redux/electionsSlice";
import { DistrictInfo } from "../../types";
import { generateFillColors } from "../../utils/generateFillColors";
import DistrictInfoComponent from "./components/DistrictInfo";
import Legend from "./components/Legend";
import Popup from "./components/Popup";

let hoveredId: GeoJSONFeature["id"];

const Map = () => {
  const mapRef = useRef<MapRef>(null);
  const [hovered, setHovered] = useState<DistrictInfo>();
  const [clicked, setClicked] = useState<DistrictInfo>();
  const [hoverPosition, setHoverPosition] = useState<LngLat>();
  const { elections, candidate } = useElectionsStore();

  useEffect(() => {
    setHovered(undefined);
    setClicked(undefined);
  }, [elections]);

  const onMouseMove = (event: MapLayerMouseEvent) => {
    setHoverPosition(event.lngLat);
    const feature = event.features?.[0];

    if (feature?.id === hoveredId) {
      return;
    }

    const featureSelector = {
      source: elections,
      sourceLayer: electionsConfig[elections].sourceLayer,
    };

    if (hoveredId) {
      mapRef.current?.setFeatureState(
        { ...featureSelector, id: hoveredId },
        { hovered: false }
      );
    }

    if (feature) {
      hoveredId = feature.id;
      setHovered({ ...feature.properties, id: feature.id } as DistrictInfo);
      mapRef.current?.setFeatureState(
        { ...featureSelector, id: feature.id },
        { hovered: true }
      );
    } else {
      setHovered(undefined);
      setHoverPosition(undefined);
    }
  };

  const onMouseLeave = () => {
    if (!hoveredId) {
      return;
    }

    mapRef.current?.setFeatureState(
      {
        source: elections,
        sourceLayer: electionsConfig[elections].sourceLayer,
        id: hoveredId,
      },
      { hovered: false }
    );
    setHovered(undefined);
    setHoverPosition(undefined);
  };

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
        promoteId="district"
        tiles={[
          `https://api.mapbox.com/v4/${
            selectedElections.tilesetId
          }/{z}/{x}/{y}.vector.pbf?access_token=${
            import.meta.env.VITE_MAPBOX_TOKEN
          }`,
        ]}
      >
        {candidate === "all" ? (
          electionsConfig[elections].winners.map((winnerId) => {
            const fill = generateFillColors(
              `${winnerId}_proc`,
              candidatesConfig[winnerId].gradient
            );
            return (
              <Layer
                key={winnerId}
                filter={["==", "winner", winnerId]}
                id={winnerId}
                type="fill"
                source-layer={selectedElections.sourceLayer}
                paint={{
                  "fill-color": fill,
                  "fill-outline-color": fill,
                  "fill-opacity": mapOpacity,
                }}
              />
            );
          })
        ) : (
          <Layer
            key={candidate}
            id={candidate}
            type="fill"
            source-layer={selectedElections.sourceLayer}
            paint={{
              "fill-color": generateFillColors(
                `${candidate}_proc`,
                candidatesConfig[candidate].gradient,
                candidatesConfig[candidate].maxGradient
              ),
              "fill-outline-color": generateFillColors(
                `${candidate}_proc`,
                candidatesConfig[candidate].gradient,
                candidatesConfig[candidate].maxGradient
              ),
              "fill-opacity": mapOpacity,
            }}
          />
        )}
        {candidate === "all" && (
          <Layer
            filter={[
              "all",
              ...electionsConfig[elections].winners.map(
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
              "fill-opacity": mapOpacity,
            }}
          />
        )}
        <Layer
          key={candidate + "_outline"}
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
  }, [elections, candidate]);

  return (
    <MapComponent
      ref={mapRef}
      initialViewState={{
        latitude: 52.2319581,
        longitude: 21.0067249,
        zoom: 13,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseOut={onMouseLeave}
      onClick={onClick}
      interactiveLayerIds={
        candidate === "all"
          ? [...electionsConfig[elections].winners, "tie"]
          : [candidate]
      }
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
