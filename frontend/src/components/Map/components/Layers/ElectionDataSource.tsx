import { Source } from "react-map-gl/maplibre";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import { LayerType } from "../../../../types";
import { useLayerConfig } from "../../../../utils/useLayerConfig";

const promoteId: Record<LayerType, string> = {
  districts: "district",
  gminy: "teryt",
  constituencies: "constituency",
};

export const ElectionsDataSource: React.FC<{
  children: React.ReactNode;
  layer?: LayerType;
}> = ({ children, layer: layerProp }) => {
  const { layer } = useElectionsStore();
  const layerConfig = useLayerConfig(layerProp);

  if (!layerConfig) {
    return null;
  }

  const layerName = layerConfig.layerId ?? layerConfig.sourceLayer;

  return (
    <Source
      id={layerConfig.sourceLayer}
      key={layerConfig.sourceLayer}
      type="vector"
      promoteId={layerProp ? undefined : promoteId[layer]}
      url={`${import.meta.env.VITE_TILE_SERVER_URL}/${layerName}`}
    >
      {children}
    </Source>
  );
};
