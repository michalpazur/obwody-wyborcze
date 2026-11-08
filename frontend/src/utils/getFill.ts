import { ExpressionSpecification } from "maplibre-gl";
import { electionsConfig, tieColorConfig } from "../config";
import { ElectionId, ProcentKey } from "../types";
import { GradientOptions } from "../types/colors";
import { ColorConfig } from "./createColorConfig";
import { getCandidateConfig } from "./getCandidateConfig";
import { getGradient } from "./getGradient";
import { resolveGradientOptions } from "./getGradientOptions";
import { getGradientThresholds } from "./getGradientThresholds";

export const generateFillColors = (
  key: ProcentKey,
  isLive: boolean,
  colorConfig: Partial<ColorConfig>,
  options?: GradientOptions,
) => {
  const { numColors } = resolveGradientOptions(options);

  if (!colorConfig) {
    return "#616161";
  }

  const gradient = getGradient(colorConfig, numColors);

  const arr = ["step", [isLive ? "feature-state" : "get", key]];
  getGradientThresholds(options).forEach((threshold, idx) => {
    // @ts-expect-error
    arr.push(gradient[idx], threshold);
  });
  arr.push(gradient[numColors - 1]);
  return arr as ExpressionSpecification;
};

export const getWinnerFillColors = (
  election: ElectionId,
  isLive: boolean,
  options?: GradientOptions,
) => {
  const fill: unknown[] = [
    "match",
    [isLive ? "feature-state" : "get", "winner"],
  ];
  const electionConfig = electionsConfig[election];

  electionConfig.winners.forEach((winner) => {
    fill.push(
      winner,
      generateFillColors(
        `${winner}_proc`,
        isLive,
        getCandidateConfig(winner, election),
        options,
      ),
    );
  });

  fill.push(generateFillColors("winner_proc", isLive, tieColorConfig, options));

  return fill as ExpressionSpecification;
};
