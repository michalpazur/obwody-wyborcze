import { colors } from "../colors";
import { tieGradient } from "../config";
import {
  ColorConfig,
  createColorConfig,
  GRADIENT_COLORS,
} from "./createColorConfig";

export const getGradient = (
  colorConfig: Partial<ColorConfig>,
  numColors: number = GRADIENT_COLORS,
) => {
  if (numColors !== GRADIENT_COLORS) {
    return createColorConfig(
      colorConfig.baseColor ?? colors.grey.baseColor,
      numColors,
    ).gradient;
  }

  return colorConfig.gradient ? colorConfig.gradient : tieGradient;
};
