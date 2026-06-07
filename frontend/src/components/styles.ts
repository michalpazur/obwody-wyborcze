import { alpha, CSSObject, SxProps, Theme } from "@mui/material";

export const glassStyle = (theme: Theme): CSSObject => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(10px)",
  boxShadow: `0 4px 12px 0 ${alpha(theme.palette.text.primary, 0.1)}`,
});

export const mapComponentInset = (theme: Theme) => ({
  xs: theme.spacing(3),
  sm: theme.spacing(6),
});

export const topComponentInset = (theme: Theme) => theme.spacing(18);
