import { StackProps, SxProps, Theme } from "@mui/material";

export const stackSpacing: StackProps["spacing"] = { xs: 1, sm: 2 };

export const textSx: SxProps<Theme> = {
  fontSize: "14px",
  color: (theme) => theme.palette.secondary.main,
};
