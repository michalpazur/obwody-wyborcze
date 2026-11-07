import { grey } from "@mui/material/colors";
import React from "react";
import { Layer } from "react-map-gl/maplibre";
import { layerIds } from "../../../../config";
import { LayerType } from "../../../../types";
import { useLayerConfig } from "../../../../utils/useLayerConfig";
import { baseOutlineWidth, outlineOpacity, outlineWidth } from "../../styles";
import { ElectionsDataSource } from "./ElectionDataSource";

const widthMultiplier: Record<LayerType, number> = {
  districts: 0.2 / baseOutlineWidth,
  gminy: 0.4 / baseOutlineWidth,
  constituencies: 1 / baseOutlineWidth,
};

const maxZoom: Record<LayerType, number> = {
  districts: 10,
  gminy: 7,
  constituencies: 5,
};

const FeatureOutline: React.FC<{ layer: LayerType }> = ({ layer }) => {
  const layerConfig = useLayerConfig(layer);

  if (!layerConfig) {
    return null;
  }

  return (
    <ElectionsDataSource layer={layer}>
      <Layer
        id={layer}
        beforeId={layerIds.building}
        type="line"
        source-layer={layerConfig.sourceLayer}
        paint={{
          "line-color": grey[300],
          "line-width": outlineWidth(widthMultiplier[layer]),
          "line-opacity": outlineOpacity(maxZoom[layer]),
        }}
      />
    </ElectionsDataSource>
  );
};

export default FeatureOutline;
