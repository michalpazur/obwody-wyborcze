import { Box, Card, Stack, SxProps, Theme, Typography } from "@mui/material";
import React, { useMemo } from "react";
import {
  CandidateId,
  electionsConfig,
  mapOpacity,
  turnoutColorConfig,
} from "../../../../config";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import { ColorConfig } from "../../../../utils/createColorConfig";
import { getCandidateConfig } from "../../../../utils/getCandidateConfig";
import { getGradient } from "../../../../utils/getGradient";
import { getGradientOptions } from "../../../../utils/getGradientOptions";
import { getWinnerName } from "../../../../utils/getLabels";
import { mergeSx } from "../../../../utils/mergeSx";

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
  textAlign: "center",
  "&:last-child::after": {
    content: "'%'",
  },
};

const colorBox: SxProps<Theme> = {
  height: (theme) => theme.spacing(2),
  opacity: mapOpacity,
};

type WinnerRowProps = {
  numColors: number;
  colorBoxWidth: number;
} & (
  | { candidateId: CandidateId; showTurnout?: false }
  | { showTurnout: true; candidateId?: never }
);

const WinnerRow: React.FC<WinnerRowProps> = ({
  candidateId,
  numColors,
  colorBoxWidth,
  showTurnout,
}) => {
  const { elections } = useElectionsStore();
  const electionConfig = electionsConfig[elections];

  const nameSx = mergeSx([
    text,
    (electionConfig.type === "president" && !showTurnout) ? { minWidth: "80px" } : {},
  ]);

  const gradient = useMemo(() => {
    let colorConfig: Partial<ColorConfig>;
    if (showTurnout) {
      colorConfig = turnoutColorConfig;
    } else {
      colorConfig = getCandidateConfig(candidateId, elections);
    }

    return getGradient(colorConfig, numColors);
  }, [candidateId, elections, numColors]);

  const colorsArr = Array.from(Array(numColors));

  return (
    <Stack spacing={2} direction="row" sx={{ alignItems: "center" }}>
      <Typography sx={nameSx}>
        {showTurnout ? "Frekwencja" : getWinnerName(candidateId, elections)}
      </Typography>
      <Stack direction="row" spacing={colorBoxSpacing}>
        {colorsArr.map((_, idx) => (
          <Box
            component="span"
            key={idx}
            sx={[
              colorBox,
              (theme) => ({ width: theme.spacing(colorBoxWidth) }),
              {
                backgroundColor: gradient[idx],
              },
            ]}
          />
        ))}
      </Stack>
    </Stack>
  );
};

const Legend: React.FC = () => {
  const { elections, candidate, showTurnout } = useElectionsStore();
  const electionConfig = electionsConfig[elections];
  const { minGradient, maxGradient, numColors } = getGradientOptions(
    showTurnout,
    candidate,
    elections,
  );
  const colorBoxWidth = numColors <= 5 ? 5 : 2.5;

  const winners = useMemo(() => {
    const electionWinners = electionConfig.winners.filter(
      (candidate) =>
        !electionConfig.candidatesConfig?.[candidate]?.hideInLegend,
    );

    return candidate === "all" ? electionWinners.slice(0, 3) : [candidate];
  }, [candidate, elections]);

  const colorsArr = Array.from(Array(numColors));

  const widthSx: SxProps<Theme> = (theme) => ({
    width: theme.spacing(colorBoxWidth),
  });

  return (
    <Card variant="outlined" elevation={1} sx={root}>
      <Stack spacing={1}>
        {!showTurnout ? (
          winners.map((winner) => (
            <WinnerRow
              key={winner}
              candidateId={winner}
              numColors={numColors}
              colorBoxWidth={colorBoxWidth}
            />
          ))
        ) : (
          <WinnerRow
            showTurnout
            numColors={numColors}
            colorBoxWidth={colorBoxWidth}
          />
        )}
      </Stack>
      <Stack direction="row" spacing={2}>
        <Box sx={{ flexGrow: 1 }} />
        <Stack
          direction="row"
          sx={{
            position: "relative",
            left: (theme) => theme.spacing(-colorBoxWidth / 2),
          }}
          spacing={colorBoxSpacing}
        >
          {colorsArr.slice(0, numColors - 1).map((_, idx) =>
            numColors <= 5 || idx % 2 == 0 ? (
              <Typography sx={[legendText, widthSx]} key={idx}>
                {((idx + 1) * (maxGradient - minGradient)) / numColors +
                  minGradient}
              </Typography>
            ) : (
              <Box key={idx} sx={widthSx} />
            ),
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

export default Legend;
