import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: ["'Work Sans'", "Roboto", "sans-serif"].join(", "),
    h1: {
      fontSize: "40px",
      fontFamily: "'Bree Serif'"
    },
    h2: {
      fontSize: "32px",
      fontFamily: "'Bree Serif'",
    },
    h3: {
      fontSize: "28px",
      fontFamily: "'Bree Serif'",
    }
  },
});
