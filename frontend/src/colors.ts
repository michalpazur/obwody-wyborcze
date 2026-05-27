import {
  blue,
  brown,
  deepOrange,
  green,
  grey,
  indigo,
  lightGreen,
  pink,
  purple,
  red,
  yellow,
} from "@mui/material/colors";
import chroma from "chroma-js";
import { createColorConfig, GRADIENT_COLORS } from "./utils/createColorConfig";

export const colors = {
  blue: createColorConfig(blue),
  brat: {
    color: "#8ACE00",
    gradient: chroma.scale(["#B4FF1C", "#689B00"]).colors(GRADIENT_COLORS),
  },
  brown: createColorConfig(brown),
  green: createColorConfig(green),
  grey: createColorConfig(grey),
  indigo: createColorConfig(indigo),
  lightGreen: createColorConfig(lightGreen),
  orange: createColorConfig(deepOrange),
  pink: createColorConfig(pink),
  purple: createColorConfig(purple),
  red: createColorConfig(red),
  yellow: createColorConfig(yellow),
};
