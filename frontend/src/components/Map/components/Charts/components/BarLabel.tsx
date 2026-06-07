import { SxProps, Theme, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import { mergeSx } from "../../../../../utils/mergeSx";

type BarLabelProps = {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  backgroundColor?: string;
  variant?: "light" | "dark";
};

const textLabelSx: SxProps<Theme> = {
  fontSize: "12px",
};

const BarLabel: React.FC<BarLabelProps> = ({
  children,
  sx,
  backgroundColor,
  variant,
}) => {
  const theme = useTheme();

  const color = useMemo(() => {
    if ((!backgroundColor && !variant) || variant === "dark") {
      return theme.palette.text.primary;
    }

    if (variant === "light") {
      return theme.palette.background.paper;
    }

    return theme.palette.getContrastText(
      backgroundColor ?? theme.palette.background.paper,
    );
  }, [backgroundColor, variant]);

  return (
    <Typography sx={mergeSx(textLabelSx, sx, { color })}>{children}</Typography>
  );
};

export default BarLabel;
