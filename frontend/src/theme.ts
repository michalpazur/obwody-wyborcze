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
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(10px)",
          }),
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottomColor: theme.palette.divider,
          fontSize: "14px",
          padding: theme.spacing(1),
          lineHeight: "1.2",
        }),
        body: {
          "&:last-child": {
            fontFamily: "'Bree Serif', sans-serif",
          },
        },
        head: ({ theme }) => ({
          color: theme.palette.secondary.main,
          fontSize: "12px",
        }),
        footer: ({ theme }) => ({
          color: theme.palette.text.primary,
          borderBottom: "none",
        }),
      },
    },
  },
});
