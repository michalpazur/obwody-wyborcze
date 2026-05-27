import { colors } from "../colors";
import { candidatesConfig } from "../config";
import { ElectionCandidatesConfig } from "../types";
import { createColorConfig, GRADIENT_COLORS } from "./createColorConfig";

export const createElectionsCandidateConfig = (
  baseConfig: ElectionCandidatesConfig,
  numColors: number = GRADIENT_COLORS,
): ElectionCandidatesConfig => {
  const config: ElectionCandidatesConfig = {};

  Object.keys(baseConfig).forEach((k) => {
    const key = k as keyof ElectionCandidatesConfig;
    const candidateConfig = candidatesConfig[key];

    config[key] = {
      ...baseConfig[key],
      ...createColorConfig(
        candidateConfig.baseColor || colors.grey.baseColor,
        numColors,
      ),
    };
  });

  return config;
};
