import {
  Box,
  Card,
  Collapse,
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
import SideButtons from "./components/SideButtons";
import { stackSpacing } from "./components/styles";

const stackSx: SxProps<Theme> = (theme) => ({
  position: "absolute",
  zIndex: 6,
  top: theme.spacing(6),
  left: theme.spacing(6),
  right: theme.spacing(6),
  height: "calc(100% - 156px)",
  pointerEvents: "none",
  "> *": {
    pointerEvents: "auto",
  },
  [theme.breakpoints.down("sm")]: {
    top: theme.spacing(3),
    left: theme.spacing(3),
    right: theme.spacing(3),
    height: "calc(100% - 140px)",
  },
});

const rootSx: SxProps<Theme> = (theme) => ({
  p: { xs: 4, sm: 5 },
  pointerEvents: "auto",
  width: "360px",
  maxHeight: "100%",
  overflowY: "auto",
  [theme.breakpoints.down("sm")]: {
    width: `calc(100vw - ${theme.spacing(6)} - ${theme.spacing(1)} - 40px)`,
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
  onClose: () => void;
}> = ({ open, onClose, children }) => {
  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      spacing={stackSpacing}
      sx={stackSx}
    >
      <Collapse
        in={open}
        orientation="horizontal"
        appear={false}
        sx={{ height: "100% !important", pointerEvents: "none" }}
      >
        <Card variant="outlined" sx={rootSx}>
          {children}
        </Card>
      </Collapse>
      <SideButtons open={open} onClose={onClose} />
    </Stack>
  );
};

const DistrictInfoComponent: React.FC<{
  districtInfo?: DistrictInfo;
}> = ({ districtInfo }) => {
  const [open, setOpen] = useState(true);
  const { elections } = useElectionsStore();

  useEffect(() => {
    if (districtInfo) {
      setOpen(true);
    }
  }, [districtInfo]);

  const onCloseClick = () => {
    setOpen((open) => !open);
  };

  const results = useMemo(() => {
    if (districtInfo) {
      return sortResults(districtInfo, elections);
    }

    return [];
  }, [districtInfo, elections]);

  return (
    <CardWithSlide open={open} onClose={onCloseClick}>
      <Stack spacing={4}>
        <Typography variant="h2">Szczegółowe wyniki</Typography>
        <ElectionsSelects />
        {districtInfo ? (
          <Box>
            <Typography sx={text}>
              Obwodowa Komisja Wyborcza {districtInfo.number}
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
            Obwodowej Komisji Wyborczej.
          </Typography>
        )}
        {districtInfo && <ResultsTable results={results} full />}
      </Stack>
    </CardWithSlide>
  );
};

export default DistrictInfoComponent;
