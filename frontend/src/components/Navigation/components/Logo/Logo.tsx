import { Box, Stack, SxProps, Typography, Zoom } from "@mui/material";
import React from "react";
import { colors } from "../../../../colors";
import { mergeSx } from "../../../../utils/mergeSx";

const boxes = [
  colors.orange.color,
  colors.blue.color,
  colors.indigo.color,
  colors.brown.color,
  colors.purple.color,
];

const boxSx: SxProps = {
  width: "16px",
  height: "16px",
  borderRadius: "50%",
};

const Logo: React.FC = () => {
  return (
    <Stack direction="row" spacing={0.5} aria-label="Logo serwisu">
      {boxes.map((color, index) => (
        <Zoom
          in
          appear
          key={color}
          style={{ transitionDelay: `${index * 75}ms` }}
        >
          <Box sx={mergeSx(boxSx, { backgroundColor: color })} />
        </Zoom>
      ))}
    </Stack>
  );
};

export default Logo;
