import { ExpressionSpecification } from "maplibre-gl";
import { ElectionId, ProcentKey } from "../types";
import { ColorConfig, GRADIENT_COLORS } from "./createColorConfig";
import { getGradient } from "./getGradient";
import { electionsConfig, tieColorConfig } from "../config";
import { getCandidateConfig } from "./getCandidateConfig";

export type GradientOptions = {
  minGradient?: number;
  maxGradient?: number;
  numColors?: number;
};

export const generateFillColors = (
  key: ProcentKey,
  isLive: boolean,
  colorConfig: Partial<ColorConfig>,
  options?: GradientOptions,
) => {
  const {
    minGradient = 0,
    maxGradient = 100,
    numColors = GRADIENT_COLORS,
  } = options || {};

  if (!colorConfig) {
    return "#616161";
  }

  const gradient = getGradient(colorConfig, numColors);

  const arr = ["step", [isLive ? "feature-state" : "get", key]];
  Array(numColors - 1)
    .fill(0)
    .forEach((_, idx) => {
      arr.push(
        gradient[idx],
        // @ts-expect-error
        ((idx + 1) * (maxGradient - minGradient)) / numColors + minGradient,
      );
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
