import { useElectionsStore } from "../redux/electionsSlice";
import { useElectionConfig } from "./useElectionConfig";

export const useLayerConfig = () => {
  const electionConfig = useElectionConfig();
  const { layer } = useElectionsStore();
  const layersConfig = electionConfig.layersConfig;

  return layersConfig[layer] ?? layersConfig.districts;
};
