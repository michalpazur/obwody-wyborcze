import { useTheme } from "@mui/material";
import { Layer } from "react-map-gl/maplibre";
import { exponentialBase, textLayout } from "../../styles";

type PlaceNameLayerProps = {
  placeClass: "city" | "town" | "village" | "suburb";
};

export const PlaceNameLayer: React.FC<PlaceNameLayerProps> = ({
  placeClass,
}) => {
  const theme = useTheme();
  const fontSize = placeClass === "city" ? 14 : placeClass === "town" ? 12 : 10;
  const minZoom = placeClass === "city" ? 0 : placeClass === "town" ? 8 : 12;

  return (
    <Layer
      type="symbol"
      source="maptiler-source"
      source-layer="place"
      id={placeClass}
      filter={["==", "class", placeClass]}
      minzoom={minZoom}
      maxzoom={15}
      layout={textLayout(fontSize)}
      paint={{
        "text-color": theme.palette.text.primary,
        "text-halo-color": theme.palette.background.paper,
        "text-halo-width": [
          "interpolate",
          ["exponential", exponentialBase],
          ["zoom"],
          10,
          1.5,
          14,
          2,
        ],
      }}
    />
  );
};
