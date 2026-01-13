import {
  blue,
  brown,
  deepOrange,
  indigo,
  pink,
  purple,
  yellow,
} from "@mui/material/colors";
import chroma from "chroma-js";

export const GRADIENT_COLORS = 5;

export const colors = {
  blue: {
    color: blue[700],
    gradient: chroma.scale([blue[300], blue[900]]).colors(GRADIENT_COLORS),
  },
  brat: {
    color: "#8ACE00",
    gradient: chroma.scale(["#B4FF1C", "#689B00"]).colors(GRADIENT_COLORS),
  },
  brown: {
    color: brown[700],
    gradient: chroma.scale([brown[300], brown[900]]).colors(GRADIENT_COLORS),
  },
  indigo: {
    color: indigo[700],
    gradient: chroma.scale([indigo[300], indigo[900]]).colors(GRADIENT_COLORS),
  },
  orange: {
    color: deepOrange[700],
    gradient: chroma
      .scale([deepOrange[300], deepOrange[900]])
      .colors(GRADIENT_COLORS),
  },
  pink: {
    color: pink[700],
    gradient: chroma.scale([purple[300], purple[900]]).colors(GRADIENT_COLORS),
  },
  purple: {
    color: purple[700],
    gradient: chroma.scale([purple[300], purple[900]]).colors(GRADIENT_COLORS),
  },
  yellow: {
    color: yellow[700],
    gradient: chroma.scale([yellow[300], yellow[900]]).colors(GRADIENT_COLORS),
  },
};
