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
import { Layer, Map as MapComponent, MapRef } from "react-map-gl/maplibre";
import {
  candidatesConfig,
  electionsConfig,
  layerIds,
  mapOpacity,
  tieGradient,
} from "../../config";
import { useElectionsStore } from "../../redux/electionsSlice";
import { DistrictInfo } from "../../types";
import { generateFillColors } from "../../utils/generateFillColors";
import DistrictInfoComponent from "./components/DistrictInfo";
import { ElectionsDataSource } from "./components/Layers/ElectionDataSource";
import FeaturesSource from "./components/Layers/FeaturesSource";
import {
  placeClasses,
  PlaceNameLayer,
} from "./components/Layers/PlaceNameLayer";
import { TransportationLayer } from "./components/Layers/TransportationLayer";
import Legend from "./components/Legend";
import Popup from "./components/Popup";
import { selectedFeatureOutline, stateClicked, stateHovered } from "./styles";

let hoveredId: GeoJSONFeature["id"];

const Map = () => {
  const theme = useTheme();
  const mapRef = useRef<MapRef>(null);
  const [hovered, setHovered] = useState<DistrictInfo>();
  const [clicked, setClicked] = useState<DistrictInfo>();
  const [hoverPosition, setHoverPosition] = useState<LngLat>();
  const { elections, candidate } = useElectionsStore();
  const selectedElections = electionsConfig[elections];

  const featureSelector = useMemo(
    () => ({
      source: elections,
      sourceLayer: electionsConfig[elections].sourceLayer,
    }),
    [elections]
  );

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
      { ...featureSelector, id: hoveredId },
      { hovered: false }
    );
    hoveredId = undefined;
    setHovered(undefined);
    setHoverPosition(undefined);
  };

  const onClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];

      if (clicked) {
        mapRef.current?.setFeatureState(
          { ...featureSelector, id: clicked.id },
          { clicked: false }
        );
      }

      if (clicked?.id === feature?.id) {
        setClicked(undefined);
      } else if (feature) {
        setClicked({ ...feature.properties, id: feature.id } as DistrictInfo);
        mapRef.current?.setFeatureState(
          { ...featureSelector, id: feature.id },
          { clicked: true }
        );
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
                beforeId={layerIds.water}
                type="fill"
                source-layer={selectedElections.sourceLayer}
                paint={{
                  "fill-color": fill,
                  "fill-opacity": mapOpacity,
                }}
              />
            );
          })
        ) : (
          <Layer
            key={candidate}
            id={candidate}
            beforeId={layerIds.water}
            type="fill"
            source-layer={selectedElections.sourceLayer}
            paint={{
              "fill-color": generateFillColors(
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
            beforeId={layerIds.water}
            type="fill"
            source-layer={selectedElections.sourceLayer}
            paint={{
              "fill-color": generateFillColors("winner_proc", tieGradient),
              "fill-opacity": mapOpacity,
            }}
          />
        )}
      </ElectionsDataSource>
    );
  }, [elections, candidate]);

  const featuresMapLayers = useMemo(() => {
    const transparentFillPaint = {
      "fill-color": theme.palette.background.default,
      "fill-opacity": 0.25,
      "fill-outline-color": theme.palette.background.paper,
    };
    return (
      <React.Fragment>
        <FeaturesSource>
          {placeClasses.map((placeClass) => (
            <PlaceNameLayer key={placeClass} placeClass={placeClass} />
          ))}
        </FeaturesSource>
        <ElectionsDataSource>
          <Layer
            id={layerIds.outline}
            beforeId={layerIds.city}
            type="line"
            source-layer={selectedElections.sourceLayer}
            paint={{
              "line-width": selectedFeatureOutline,
              "line-color": theme.palette.text.primary,
              "line-opacity": [
                "case",
                ["any", stateHovered, stateClicked],
                1,
                0,
              ],
            }}
          />
        </ElectionsDataSource>
        <FeaturesSource>
          <Layer
            type="fill"
            source-layer="building"
            id={layerIds.building}
            beforeId={layerIds.outline}
            paint={transparentFillPaint}
          />
          <TransportationLayer transportationClass="road" />
          <TransportationLayer transportationClass="road-secondary" />
          <TransportationLayer transportationClass="rail" color="#757575" />
          <Layer
            type="fill"
            source-layer="water"
            filter={["in", "class", "river", "lake"]}
            id={layerIds.water}
            beforeId={layerIds.road}
            paint={transparentFillPaint}
          />
        </FeaturesSource>
      </React.Fragment>
    );
  }, [selectedElections]);

  return (
    <MapComponent
      ref={mapRef}
      initialViewState={{
        latitude: 52.1911,
        longitude: 19.3554,
        zoom: 6,
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
      mapStyle="/obwody-wyborcze/map-style.json"
    >
      {featuresMapLayers}
      {mapLayers}
      {hovered && hoverPosition ? (
        <Popup district={hovered} position={hoverPosition} />
      ) : null}
      <Legend />
      <DistrictInfoComponent districtInfo={clicked} />
    </MapComponent>
  );
};

export default Map;
