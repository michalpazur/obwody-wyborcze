import { Box, Card, Stack, SxProps, Theme, Typography } from "@mui/material";
import React from "react";
import {
  candidatesConfig,
  electionsConfig,
  GRADIENT_COLORS,
} from "../../../../config";
import { getLastName } from "../../../../utils/getLastName";

const colors = Array(GRADIENT_COLORS).fill(0);
const colorBoxWidth = 5;
const colorBoxSpacing = 0.25;

const root: SxProps<Theme> = (theme) => ({
  position: "absolute",
  bottom: (theme) => theme.spacing(3),
  left: (theme) => theme.spacing(6),
  p: 2,
  zIndex: 5,
  [theme.breakpoints.down("sm")]: {
    left: (theme) => theme.spacing(3),
  },
});

const text: SxProps<Theme> = {
  fontSize: "12px",
  color: (theme) => theme.palette.secondary.light,
  flexGrow: "1",
};

const legendText: SxProps<Theme> = {
  fontSize: "10px",
  color: (theme) => theme.palette.secondary.light,
  width: (theme) => theme.spacing(colorBoxWidth),
  textAlign: "center",
  "&:last-child::after": {
    content: "'%'",
  },
};

const colorBox: SxProps<Theme> = {
  width: (theme) => theme.spacing(colorBoxWidth),
  height: (theme) => theme.spacing(2),
};

const Legend: React.FC = () => {
  return (
    <Card variant="outlined" elevation={1} sx={root}>
      <Typography sx={{ fontFamily: "'Bree Serif'", mb: 2 }}>Wynik</Typography>
      <Stack spacing={1}>
        {electionsConfig.pres_2025_1.winners.map((winner) => (
          <Stack spacing={2} direction="row" alignItems="center">
            <Typography sx={text}>
              {getLastName(candidatesConfig[winner].name)}
            </Typography>
            <Stack direction="row" spacing={colorBoxSpacing}>
              {colors.map((_, idx) => (
                <Box
                  component="span"
                  key={idx}
                  sx={[
                    colorBox,
                    {
                      backgroundColor: candidatesConfig[winner].gradient?.[idx],
                    },
                  ]}
                />
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
      <Stack direction="row" spacing={2}>
        <Box flexGrow="1" />
        <Stack
          direction="row"
          sx={{
            position: "relative",
            left: (theme) => theme.spacing(-colorBoxWidth / 2),
          }}
          spacing={colorBoxSpacing}
        >
          {colors.slice(0, GRADIENT_COLORS - 1).map((_, idx) => (
            <Typography sx={legendText} key={idx}>
              {((idx + 1) * 100) / GRADIENT_COLORS}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

export default Legend;
