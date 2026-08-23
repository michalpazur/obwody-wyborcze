import { useMemo } from "react";
import { electionsConfig } from "../config";
import { useElectionsStore } from "../redux/electionsSlice";
import { FeatureSelector } from "../types/map";

export const useFeatureSelector = (): FeatureSelector => {
  const { elections } = useElectionsStore();

  const source = useMemo(
    () => ({
      source: elections,
      sourceLayer: electionsConfig[elections].sourceLayer || elections,
    }),
    [elections],
  );

  return source;
};
