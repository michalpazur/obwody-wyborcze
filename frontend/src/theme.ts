import { alpha, createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: ["'Work Sans'", "Roboto", "sans-serif"].join(", "),
    h1: {
      fontSize: "40px",
      fontFamily: "'Bree Serif'",
    },
    h2: {
      fontSize: "32px",
      fontFamily: "'Bree Serif'",
    },
    h3: {
      fontSize: "28px",
      fontFamily: "'Bree Serif'",
    },
  },
  palette: {
    secondary: {
      main: "#424242",
    },
  },
  spacing: 4,
  shape: {
    borderRadius: "8px",
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          lineHeight: "1.2",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.variant === "outlined" && {
            border: "none",
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: "blur(10px)",
          }),
        }),
      },
    },
  },
});
