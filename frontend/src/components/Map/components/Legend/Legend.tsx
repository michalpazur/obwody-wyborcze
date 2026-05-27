import { Box, Card, Stack, SxProps, Theme, Typography } from "@mui/material";
import React, { useCallback, useMemo } from "react";
import {
  CandidateId,
  candidatesConfig,
  electionsConfig,
  mapOpacity,
  tieColorConfig,
} from "../../../../config";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import {
  createColorConfig,
  GRADIENT_COLORS,
} from "../../../../utils/createColorConfig";
import { getCandidateConfig } from "../../../../utils/getCandidateConfig";
import { getGradientOptions } from "../../../../utils/getGradientOptions";
import { getLastName } from "../../../../utils/getLastName";
import { mergeSx } from "../../../../utils/mergeSx";

const colorBoxWidth = 5;
const colorBoxSpacing = 0.25;

const root: SxProps<Theme> = (theme) => ({
  position: "absolute",
  bottom: (theme) => theme.spacing(3),
  right: (theme) => theme.spacing(3),
  left: (theme) => theme.spacing(6),
  p: 2,
  zIndex: 5,
  maxWidth: "fit-content",
  [theme.breakpoints.down("sm")]: {
    left: (theme) => theme.spacing(3),
    right: (theme) => theme.spacing(3),
  },
});

const text: SxProps<Theme> = (theme) => ({
  fontSize: "12px",
  color: (theme) => theme.palette.secondary.light,
  flex: "1",
  minWidth: (theme) => theme.spacing(20),
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  [theme.breakpoints.down("sm")]: {
    minWidth: "0px",
  },
});

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
  const electionConfig = electionsConfig[elections];
  const {
    minGradient = 0,
    maxGradient = 100,
    numColors = GRADIENT_COLORS,
  } = getGradientOptions(candidate, elections);

  const winners = useMemo(() => {
    const electionWinners = electionConfig.winners.filter(
      (candidate) =>
        !electionConfig.candidatesConfig?.[candidate]?.hideInLegend,
    );

    return candidate === "all" ? electionWinners.slice(0, 3) : [candidate];
  }, [candidate, elections]);

  const tieGradient = useMemo(() => {
    if (numColors !== GRADIENT_COLORS) {
      return createColorConfig(tieColorConfig.baseColor, numColors).gradient;
    }

    return tieColorConfig.gradient;
  }, [numColors]);

  const colorsArr = Array.from(Array(numColors));

  const getLegendName = useCallback(
    (winner: CandidateId) => {
      const candidateConfig = candidatesConfig[winner];

      return electionConfig.type === "president"
        ? getLastName(candidateConfig.name)
        : candidateConfig.name;
    },
    [candidatesConfig, electionConfig],
  );

  const nameSx = mergeSx([
    text,
    electionConfig.type !== "president" ? { minWidth: "unset" } : {},
  ]);

  return (
    <Card variant="outlined" elevation={1} sx={root}>
      <Typography sx={{ fontFamily: "'Bree Serif'", mb: 2 }}>Wynik</Typography>
      <Stack spacing={1}>
        {winners.map((winner) => (
          <Stack spacing={2} direction="row" alignItems="center" key={winner}>
            <Typography sx={nameSx}>{getLegendName(winner)}</Typography>
            <Stack direction="row" spacing={colorBoxSpacing}>
              {colorsArr.map((_, idx) => (
                <Box
                  component="span"
                  key={idx}
                  sx={[
                    colorBox,
                    {
                      backgroundColor:
                        getCandidateConfig(winner, elections).gradient?.[idx] ||
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
          {colorsArr.slice(0, numColors - 1).map((_, idx) => (
            <Typography sx={legendText} key={idx}>
              {((idx + 1) * (maxGradient - minGradient)) / numColors +
                minGradient}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

export default Legend;
