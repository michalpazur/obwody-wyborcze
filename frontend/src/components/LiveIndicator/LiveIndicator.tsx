import { Box, keyframes } from "@mui/material";
import React from "react";

type LiveIndicatorProps = { variant?: "contrast" | "filled" };

const pulse = keyframes(`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`);

const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  variant = "filled",
}) => {
  return (
    <Box
      sx={{
        backgroundColor: (theme) =>
          variant === "contrast"
            ? theme.palette.error.contrastText
            : theme.palette.error.main,
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        animation: `${pulse} 2s ease-in-out 0.5s infinite`
      }}
    />
  );
};

export default LiveIndicator;
