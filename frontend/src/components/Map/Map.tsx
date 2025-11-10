import { useTheme } from "@mui/material";
import {
  ExpressionSpecification,
  GeoJSONFeature,
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
import { ElectionsDataSource } from "./components/Layers/ElectionDataSource";
import { PlaceNameLayer } from "./components/Layers/PlaceNameLayer";
import { TransportationLayer } from "./components/Layers/TransportationLayer";
import Legend from "./components/Legend";
import Popup from "./components/Popup";
import { selectedFeatureOutline } from "./styles";

let hoveredId: GeoJSONFeature["id"];

const Map = () => {
  const theme = useTheme();
  const mapRef = useRef<MapRef>(null);
  const [hovered, setHovered] = useState<DistrictInfo>();
  const [clicked, setClicked] = useState<DistrictInfo>();
  const [hoverPosition, setHoverPosition] = useState<LngLat>();
  const { elections, candidate } = useElectionsStore();
  const selectedElections = electionsConfig[elections];

  useEffect(() => {
    setHovered(undefined);
    setClicked(undefined);
  }, [elections]);

  const onMouseEnter = () => {
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = "pointer";
    }
  };

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
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = "";
    }

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
    hoveredId = undefined;
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
    return (
      <ElectionsDataSource>
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
      </ElectionsDataSource>
    );
  }, [elections, candidate]);

  const featuresMapLayers = useMemo(() => {
    return (
      <React.Fragment>
        <Source
          id="maptiler-source"
          key={`${elections}_${candidate}`}
          tiles={[
            `https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=${
              import.meta.env.VITE_MAPTILER_TOKEN
            }`,
          ]}
          type="vector"
        >
          <TransportationLayer transportationClass="road" />
          <TransportationLayer transportationClass="road-secondary" />
          <TransportationLayer transportationClass="rail" color="#757575" />
          <Layer
            type="fill"
            source-layer="building"
            id="building"
            minzoom={14}
            paint={{
              "fill-color": theme.palette.background.default,
              "fill-opacity": 0.25,
              "fill-outline-color": theme.palette.background.paper,
            }}
          />
          <PlaceNameLayer placeClass="city" />
          <PlaceNameLayer placeClass="town" />
          <PlaceNameLayer placeClass="village" />
          <PlaceNameLayer placeClass="suburb" />
        </Source>
        <ElectionsDataSource>
          <Layer
            key={candidate + "_outline"}
            id="outline"
            type="line"
            source-layer={selectedElections.sourceLayer}
            paint={{
              "line-width": selectedFeatureOutline,
              "line-color": theme.palette.text.primary,
              "line-opacity": [
                "case",
                ["boolean", ["feature-state", "hovered"], false],
                1,
                0,
              ],
            }}
          />
        </ElectionsDataSource>
      </React.Fragment>
    );
  }, [elections, candidate]);

  return (
    <MapComponent
      ref={mapRef}
      initialViewState={{
        latitude: 52.2319581,
        longitude: 21.0067249,
        zoom: 14,
      }}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseOut={onMouseLeave}
      onClick={onClick}
      maxPitch={0}
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
      {featuresMapLayers}
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
