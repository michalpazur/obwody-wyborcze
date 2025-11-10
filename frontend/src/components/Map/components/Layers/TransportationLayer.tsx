import { useTheme } from "@mui/material";
import React from "react";
import { Layer } from "react-map-gl/maplibre";
import { transportationLineWidth } from "../../styles";

type TransportationLayerProps = {
  transportationClass: "road" | "road-secondary" | "rail";
  color?: string;
  opacity?: number;
};

export const TransportationLayer: React.FC<TransportationLayerProps> = ({
  transportationClass,
  color,
  opacity = 0.4,
}) => {
  const theme = useTheme();
  const widthMultiplier = transportationClass === "road" ? 2 : 1;

  return (
    <Layer
      type="line"
      source="maptiler-source"
      source-layer="transportation"
      id={transportationClass}
      filter={
        transportationClass === "road"
          ? ["in", "class", "primary", "secondary", "motorway", "trunk"]
          : transportationClass === "road-secondary"
          ? ["in", "class", "tertiary", "minor"]
          : ["==", "class", transportationClass]
      }
      paint={{
        "line-color": color || theme.palette.background.default,
        "line-width": transportationLineWidth(widthMultiplier),
        "line-opacity": opacity,
      }}
    />
  );
};
