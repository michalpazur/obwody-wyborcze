import { Source } from "react-map-gl/maplibre";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import { LayersConfig } from "../../../../types";
import { useLayerConfig } from "../../../../utils/useLayerConfig";

const promoteId: Record<keyof LayersConfig, string> = {
  districts: "district",
  gminy: "teryt",
  constituencies: "constituency",
};

export const ElectionsDataSource: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { layer } = useElectionsStore();
  const layerConfig = useLayerConfig();
  const layerName = layerConfig.layerId ?? layerConfig.sourceLayer;

  return (
    <Source
      id={layerConfig.sourceLayer}
      key={layerConfig.sourceLayer}
      type="vector"
      promoteId={promoteId[layer]}
      url={`${import.meta.env.VITE_TILE_SERVER_URL}/${layerName}`}
    >
      {children}
    </Source>
  );
};
