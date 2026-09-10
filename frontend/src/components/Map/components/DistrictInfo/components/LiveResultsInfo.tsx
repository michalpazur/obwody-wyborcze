import {
  Alert,
  LinearProgress,
  Stack,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { AxiosError, isAxiosError } from "axios";
import React, { useMemo } from "react";
import { notCountedColorConfig } from "../../../../../config";
import { useLiveElectionResults } from "../../../../../services/useLiveElectionResults";
import { getPercent } from "../../../../../utils/getPercent";
import { mergeSx } from "../../../../../utils/mergeSx";
import LiveIndicator from "../../../../LiveIndicator";
import Skeleton from "../../../../Skeleton";

const liveBoxSx: SxProps<Theme> = {
  px: 2,
  py: 1,
  borderRadius: (theme) => theme.spacing(1),
  backgroundColor: (theme) => theme.palette.error.main,
  color: (theme) => theme.palette.error.contrastText,
  width: "fit-content",
  alignItems: "center",
};

const progressSx: SxProps<Theme> = {
  height: "8px",
  borderRadius: "4px",
  backgroundColor: (theme) => theme.palette.divider,
  "& .MuiLinearProgress-bar": {
    backgroundColor: notCountedColorConfig.color,
  },
};

const textSx: SxProps = { fontSize: "14px" };

const countedSx: SxProps = { fontFamily: "'Bree Serif'", fontSize: "inherit" };

const alertSx: SxProps = {
  p: 0,
  "& .MuiAlert-message": {
    p: 3,
  },
};

const getErrorMessage = (e: Error) => {
  let message = "W trakcie pobierania danych wystąpił błąd. ";

  if (!isAxiosError(e)) {
    return message.trim();
  }

  if (e.code === AxiosError.ECONNREFUSED) {
    message += "(ERR_CONNECTION_REFUSED)";
  } else if (e.code === AxiosError.ERR_NETWORK) {
    message += "(ERR_NETWORK)";
  } else if (e.response?.status) {
    message += `[${e.response.status}]`;
  }

  return message;
};

const LiveResultsInfo: React.FC = () => {
  const { data: results, isLoading, error } = useLiveElectionResults();

  const { reported = 0, totalDistricts = 0 } = results ?? {};
  const countedProc = getPercent(reported, totalDistricts);

  const reportedInfo = useMemo(() => {
    if (!results && !isLoading) {
      return null;
    }

    return (
      <React.Fragment>
        <Stack direction="row" spacing={1} sx={liveBoxSx}>
          <LiveIndicator variant="contrast" />
          <Typography sx={mergeSx(textSx, countedSx)}>Na żywo</Typography>
        </Stack>
        <LinearProgress
          variant={isLoading ? "indeterminate" : "determinate"}
          value={countedProc}
          sx={progressSx}
        />
        <Skeleton isLoading={isLoading}>
          <Typography sx={textSx}>
            Policzono głosy w{" "}
            <Typography component="span" sx={countedSx}>
              {countedProc}%
            </Typography>{" "}
            ({reported} z {totalDistricts}) obwodów.
          </Typography>
        </Skeleton>
        <Skeleton isLoading={isLoading}>
          <Typography sx={textSx}>
            Dane z godziny:{" "}
            {new Date(results?.timestamp ?? "").toLocaleTimeString("pl-PL")}
          </Typography>
        </Skeleton>
      </React.Fragment>
    );
  }, [results, isLoading]);

  if (!results && !isLoading && !error) {
    return null;
  }

  return (
    <Stack spacing={1}>
      {reportedInfo}
      {error && (
        <Alert severity="error" sx={alertSx} icon={false}>
          {getErrorMessage(error)}
        </Alert>
      )}
    </Stack>
  );
};

export default LiveResultsInfo;
