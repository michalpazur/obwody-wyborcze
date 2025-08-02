import CloseIcon from "@mui/icons-material/CloseRounded";
import {
  Box,
  Card,
  IconButton,
  Slide,
  Stack,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import { DistrictInfo } from "../../../../types";
import { sortResults } from "../../../../utils/sortResults";
import ResultsTable from "../ResultsTable";
import ElectionsSelects from "./components/ElectionsSelects";

const root: SxProps<Theme> = (theme) => ({
  width: "100%",
  position: "absolute",
  top: (theme) => theme.spacing(6),
  left: (theme) => theme.spacing(6),
  p: 5,
  zIndex: 6,
  maxWidth: "360px",
  maxHeight: "calc(100% - 156px)",
  overflowY: "auto",
  [theme.breakpoints.down("sm")]: {
    maxWidth: `calc(100% - ${theme.spacing(6)})`,
    top: (theme) => theme.spacing(3),
    left: (theme) => theme.spacing(3),
    maxHeight: "calc(100% - 140px)",
  },
});

const closeButton: SxProps = {
  position: "absolute",
  right: "0px",
  top: "0px",
  display: { xs: "block", sm: "none" },
};

const header: SxProps<Theme> = (theme) => ({
  [theme.breakpoints.down("sm")]: {
    marginRight: theme.spacing(5),
  },
});

const countyName: SxProps = {
  fontFamily: "'Bree Serif'",
};

const text: SxProps<Theme> = {
  fontSize: "14px",
  color: (theme) => theme.palette.secondary.main,
};

const CardWithSlide: React.FC<{
  children: React.ReactNode;
  open: boolean;
  onExited: () => void;
}> = ({ open, children, onExited }) => {
  return (
    <Slide in={open} direction="right" appear={false} onExited={onExited}>
      <Card variant="outlined" sx={root}>
        {children}
      </Card>
    </Slide>
  );
};

const DistrictInfoComponent: React.FC<{
  districtInfo?: DistrictInfo;
  setDistrictInfo: (districtInfo: DistrictInfo | undefined) => void;
}> = ({ districtInfo, setDistrictInfo }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (districtInfo) {
      setOpen(true);
    }
  }, [districtInfo]);

  const onCloseClick = () => {
    setOpen(false);
  };

  const onExited = () => {
    setDistrictInfo(undefined);
  };

  const results = useMemo(() => {
    if (districtInfo) {
      return sortResults(districtInfo);
    }

    return [];
  }, [districtInfo]);

  return (
    <CardWithSlide open={open} onExited={onExited}>
      <IconButton
        aria-label="Zamknij szczegóły"
        sx={closeButton}
        onClick={onCloseClick}
        color="secondary"
      >
        <CloseIcon />
      </IconButton>
      <Stack spacing={4}>
        <Typography variant="h2" sx={header}>
          Szczegółowe wyniki
        </Typography>
        <ElectionsSelects />
        {districtInfo ? (
          <Box>
            <Typography sx={text}>
              Okręgowa Komisja Wyborcza {districtInfo.number}
            </Typography>
            <Typography sx={countyName}>{districtInfo.gmina}</Typography>
            <Typography sx={text}>
              Frekwencja{" "}
              <Typography component="span" sx={countyName}>
                {districtInfo.turnout}%
              </Typography>
            </Typography>
          </Box>
        ) : (
          <Typography sx={text}>
            Kliknij na mapie żeby zobaczyć szczegółowe wyniki w wybranej
            Okręgowej Komisji Wyborczej.
          </Typography>
        )}
        {districtInfo && <ResultsTable results={results} full />}
      </Stack>
    </CardWithSlide>
  );
};

export default DistrictInfoComponent;
