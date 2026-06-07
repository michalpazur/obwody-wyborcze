import { Box, Stack, SxProps, Theme } from "@mui/material";
import React from "react";
import { colors } from "../../../../../colors";
import { TurnoutResults } from "../../../../../types";
import { mergeSx } from "../../../../../utils/mergeSx";
import Bar from "../components/Bar";
import BarBackground from "../components/BarBackground";
import BarLabel from "../components/BarLabel";
import { formatNumber } from "../utils/formatNumber";
import { getMaxValue } from "../utils/getMaxValue";

const thresholdBarSx: SxProps<Theme> = {
  position: "absolute",
  top: "0px",
  bottom: "0px",
  borderRight: "1px dashed",
  borderColor: (theme) => theme.palette.text.disabled,
  transition: (theme) =>
    theme.transitions.create("left", {
      duration: theme.transitions.duration.shorter,
    }),
};

const thresholdLabelSx: SxProps<Theme> = {
  position: "relative",
  alignItems: "center",
  width: "fit-content",
  transform: "translateX(-50%)",
  transition: (theme) =>
    theme.transitions.create("left", {
      duration: theme.transitions.duration.shorter,
    }),
};

const TurnoutChart: React.FC<TurnoutResults> = ({
  votes,
  votesProc,
  threshold,
  thresholdProc,
}) => {
  const max = getMaxValue(votesProc);
  const width = (votesProc * 100) / max;
  const thresholdPosition = ((thresholdProc ?? 0) * 100) / max;
  const passedThreshold = thresholdProc ? votesProc >= thresholdProc : true;
  const color = passedThreshold ? colors.green.color : colors.red.color;

  return (
    <Stack spacing={1}>
      <BarBackground>
        <Bar value={width} color={color} round>
          <BarLabel
            sx={{ color: (theme) => theme.palette.background.paper }}
            backgroundColor={color}
          >
            {votesProc}% ({formatNumber(votes)})
          </BarLabel>
        </Bar>
        <Box sx={mergeSx(thresholdBarSx, { left: `${thresholdPosition}%` })} />
      </BarBackground>
      {thresholdProc && (
        <Box>
          <Stack
            sx={mergeSx(thresholdLabelSx, {
              left: `${thresholdPosition}%`,
            })}
          >
            <BarLabel sx={{ fontFamily: "'Bree Serif'" }}>
              Próg ważności
            </BarLabel>
            <BarLabel>
              {thresholdProc}% ({formatNumber(threshold)})
            </BarLabel>
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

export default TurnoutChart;
