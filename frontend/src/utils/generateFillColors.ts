import { ExpressionSpecification } from "maplibre-gl";
import { GRADIENT_COLORS } from "../config";
import { ProcentKey } from "../types";

export const generateFillColors = (key: ProcentKey, gradient?: string[]) => {
  if (!gradient) {
    return "#616161";
  }

  const arr = ["step", ["get", key]];
  Array(GRADIENT_COLORS - 1)
    .fill(0)
    .forEach((_, idx) => {
      // @ts-ignore
      arr.push(gradient[idx], ((idx + 1) * 100) / GRADIENT_COLORS);
    });
  arr.push(gradient[GRADIENT_COLORS - 1]);
  return arr as ExpressionSpecification;
};
