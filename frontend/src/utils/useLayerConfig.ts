import { useElectionsStore } from "../redux/electionsSlice";
import { LayerConfig, LayersConfig, LayerType } from "../types";
import { useElectionConfig } from "./useElectionConfig";

export function useLayerConfig(): LayerConfig;
export function useLayerConfig<T extends LayerType>(
  layerProp: T,
): LayersConfig[T];
export function useLayerConfig(layerProp?: LayerType): LayerConfig | undefined;
export function useLayerConfig(layerProp?: LayerType) {
  const electionConfig = useElectionConfig();
  const { layer } = useElectionsStore();
  const layersConfig = electionConfig.layersConfig;

  if (layerProp) {
    return layersConfig[layerProp];
  }

  return layersConfig[layer] ?? layersConfig.districts;
}
