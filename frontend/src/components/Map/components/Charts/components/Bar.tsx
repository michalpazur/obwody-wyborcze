import { Box, SxProps, Theme } from "@mui/material";
import { tieColorConfig } from "../../../../../config";
import { mergeSx } from "../../../../../utils/mergeSx";
import React, { ForwardedRef } from "react";

type BarProps = {
  value: number;
  color?: string;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  flex?: boolean;
  round?: boolean;
};

const barSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  p: 1,
  minHeight: "24px",
  transition: (theme) =>
    theme.transitions.create(["width", "flex-basis"], {
      duration: theme.transitions.duration.shorter,
    }),
};

const Bar: React.FC<BarProps & { ref?: ForwardedRef<HTMLDivElement> }> = ({
  value,
  color = tieColorConfig.color,
  children,
  sx,
  flex,
  round,
  ref,
  ...props
}) => {
  return (
    <Box
      ref={ref}
      sx={mergeSx(
        barSx,
        sx,
        { backgroundColor: color },
        flex ? { flex: `1 1 ${value}%` } : { width: `${value}%` },
        round ? { borderRadius: (theme) => theme.spacing(1) } : {},
      )}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Bar;
