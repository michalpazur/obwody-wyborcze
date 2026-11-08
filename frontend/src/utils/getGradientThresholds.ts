import { GradientOptions } from "../types/colors";
import { resolveGradientOptions } from "./getGradientOptions";

export const getGradientThresholds = (options?: GradientOptions) => {
  const { minGradient, maxGradient, numColors } =
    resolveGradientOptions(options);

  return Array.from(
    Array(numColors - 1),
    (_, idx) =>
      ((idx + 1) * (maxGradient - minGradient)) / numColors + minGradient,
  );
};
