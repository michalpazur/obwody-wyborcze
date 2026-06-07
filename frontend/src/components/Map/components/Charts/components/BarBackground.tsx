import { Box, SxProps, Theme } from "@mui/material";
import React from "react";

const barBgSx: SxProps<Theme> = {
  display: "flex",
  borderRadius: (theme) => theme.shape.borderRadius,
  backgroundColor: (theme) => theme.palette.divider,
  overflow: "hidden",
  position: "relative",
};

const BarBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Box sx={barBgSx}>{children}</Box>;
};

export default BarBackground;
