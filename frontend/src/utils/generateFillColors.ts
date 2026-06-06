import { ExpressionSpecification } from "maplibre-gl";
import { ProcentKey } from "../types";
import { ColorConfig, GRADIENT_COLORS } from "./createColorConfig";
import { getGradient } from "./getGradient";

export type GradientOptions = {
  minGradient?: number;
  maxGradient?: number;
  numColors?: number;
};

export const generateFillColors = (
  key: ProcentKey,
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

  const arr = ["step", ["get", key]];
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
