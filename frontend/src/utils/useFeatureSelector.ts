import { useMemo } from "react";
import { useElectionsStore } from "../redux/electionsSlice";
import { FeatureSelector } from "../types/map";
import { useLayerConfig } from "./useLayerConfig";

export const useFeatureSelector = (): FeatureSelector => {
  const layerConfig = useLayerConfig();

  const source = useMemo(
    () => ({
      source: layerConfig.sourceLayer,
      sourceLayer: layerConfig.sourceLayer,
    }),
    [layerConfig.sourceLayer],
  );

  return source;
};
