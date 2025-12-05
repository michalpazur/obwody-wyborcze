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
    background: {
      default: "#E0E0E0",
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
            boxShadow: `0 4px 12px 0 ${alpha(theme.palette.text.primary, 0.1)}`,
          }),
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          variants: [
            {
              props: { color: "default" },
              style: { color: theme.palette.text.primary },
            },
            {
              props: { variant: "outlined" },
              style: {
                borderRadius: theme.shape.borderRadius,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: "blur(10px)",
                boxShadow: `0 4px 12px 0 ${alpha(
                  theme.palette.text.primary,
                  0.1
                )}`,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.background.default, 0.8),
                },
              },
            },
          ],
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
    MuiOutlinedInput: {
      styleOverrides: {
        input: ({ theme }) => ({
          padding: theme.spacing(2, 3),
          background: theme.palette.background.paper,
        }),
        notchedOutline: ({ theme }) => ({
          transition: theme.transitions.create("border-color", {
            duration: theme.transitions.duration.shortest,
          }),
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: "unset !important",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: ({ theme }) => ({
          transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.short,
          }),
        }),
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: ({ theme }) => ({
          marginTop: theme.spacing(2),
        }),
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.background.paper,
        }),
      },
    },
  },
});
