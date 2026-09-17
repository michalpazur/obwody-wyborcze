import { StackProps, SxProps, Theme } from "@mui/material";
import { notCountedColorConfig } from "../../../../../config";

export const stackSpacing: StackProps["spacing"] = { xs: 1, sm: 2 };

export const textSx: SxProps<Theme> = {
  fontSize: "14px",
  color: (theme) => theme.palette.secondary.main,
};

export const notCountedSx: SxProps<Theme> = {
  fontSize: "14px",
  color: (theme) => theme.palette.secondary.light,
};

export const progressSx: SxProps<Theme> = {
  height: "8px",
  borderRadius: "4px",
  backgroundColor: (theme) => theme.palette.divider,
  "& .MuiLinearProgress-bar": {
    backgroundColor: notCountedColorConfig.color,
  },
};

export const alertSx: SxProps = {
  position: "relative",
  p: 0,
  lineHeight: 1.2,
  "& .MuiAlert-message": {
    p: 3,
  },
};
