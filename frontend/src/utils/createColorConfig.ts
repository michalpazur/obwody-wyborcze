import { blue } from "@mui/material/colors";
import chroma from "chroma-js";

export type Color = Record<keyof typeof blue, string>;

export type ColorConfig = {
  baseColor: Color;
  color: string;
  gradient: string[];
};

export const GRADIENT_COLORS = 5;

export const createColorConfig = (
  color: Color,
  numColors = GRADIENT_COLORS,
) => {
  return {
    baseColor: color,
    color: color[700],
    gradient: chroma.scale([color[300], color[900]]).colors(numColors),
  };
};
