import { Box, Card, Stack, SxProps, Theme, Typography } from "@mui/material";
import React from "react";
import {
  candidatesConfig,
  electionsConfig,
  GRADIENT_COLORS,
  mapOpacity,
  tieGradient,
} from "../../../../config";
import { useElectionsStore } from "../../../../redux/electionsSlice";
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
  minWidth: (theme) => theme.spacing(20),
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
  opacity: mapOpacity,
};

const Legend: React.FC = () => {
  const { elections, candidate } = useElectionsStore();

  const winners =
    candidate === "all" ? electionsConfig[elections].winners : [candidate];

  const maxGradient =
    candidate === "all" ? 100 : candidatesConfig[candidate].maxGradient ?? 100;

  return (
    <Card variant="outlined" elevation={1} sx={root}>
      <Typography sx={{ fontFamily: "'Bree Serif'", mb: 2 }}>Wynik</Typography>
      <Stack spacing={1}>
        {winners.map((winner) => (
          <Stack spacing={2} direction="row" alignItems="center" key={winner}>
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
                      backgroundColor:
                        candidatesConfig[winner].gradient?.[idx] ||
                        tieGradient[idx],
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
              {((idx + 1) * maxGradient) / GRADIENT_COLORS}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

export default Legend;
