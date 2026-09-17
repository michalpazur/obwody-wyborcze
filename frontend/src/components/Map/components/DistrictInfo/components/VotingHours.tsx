import {
  Alert,
  darken,
  lighten,
  LinearProgress,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import React from "react";
import { serifFont } from "../../../../../theme";
import { formatDurationFromInterval } from "../../../../../utils/formatDuration";
import { mergeSx } from "../../../../../utils/mergeSx";
import { VotingHours as VotingHoursType } from "../../../../../utils/useVotingHours";
import { alertSx, textSx } from "./styles";

const timeLeftSx: SxProps = {
  color: "inherit",
  fontFamily: serifFont,
};

const elapsedAlertSx: SxProps = {
  pb: 1,
  overflow: "hidden",
};

const elapsedProgressSx: SxProps<Theme> = {
  height: (theme) => theme.spacing(2),
  position: "absolute",
  inset: "0px",
  top: "unset",
  backgroundColor: (theme) => lighten(theme.palette.success.light, 0.75),
  "& .MuiLinearProgress-bar": {
    backgroundColor: (theme) => theme.palette.success.light,
  },
};

const VotingHours: React.FC<{ votingHours: VotingHoursType }> = ({
  votingHours,
}) => {
  const { timeToStart, timeToEnd, now, start, end } = votingHours;

  if (timeToStart > 0) {
    return (
      <Alert severity="info" icon={false} sx={alertSx}>
        Do otwarcia lokali wyborczych pozostało:
        <Typography sx={mergeSx(textSx, timeLeftSx)}>
          {formatDurationFromInterval({ start: now, end: start })}.
        </Typography>
      </Alert>
    );
  }

  if (timeToEnd > 0) {
    const elapsed = Math.abs(timeToStart);
    const totalDuration = elapsed + timeToEnd;

    return (
      <Alert
        severity="success"
        icon={false}
        sx={mergeSx(alertSx, elapsedAlertSx)}
      >
        Do zamknięcia lokali wyborczych pozostało:
        <Typography sx={mergeSx(textSx, timeLeftSx)}>
          {formatDurationFromInterval({ start: now, end })}.
        </Typography>
        <LinearProgress
          min={0}
          max={totalDuration}
          value={elapsed}
          variant="determinate"
          sx={elapsedProgressSx}
        />
      </Alert>
    );
  }

  return null;
};

export default VotingHours;
