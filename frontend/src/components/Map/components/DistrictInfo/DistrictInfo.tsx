import {
  Box,
  Card,
  Collapse,
  Stack,
  SxProps,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { electionsConfig } from "../../../../config";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import { useLayoutStore } from "../../../../redux/layoutSlice";
import { serifFont } from "../../../../theme";
import { DistrictInfo, LayerType } from "../../../../types";
import { sortResults } from "../../../../utils/sortResults";
import { useElectionResults } from "../../../../utils/useElectionResults";
import { useIsLive } from "../../../../utils/useIsLive";
import { useLocalElectionConfig } from "../../../../utils/useLocalElectionConfig";
import { mapComponentInset } from "../../../styles";
import { StackedChart, TurnoutChart } from "../Charts";
import { ResultsTable, TurnoutTable } from "../Tables";
import ElectionsSelects from "./components/ElectionsSelects";
import LiveResultsInfo from "./components/LiveResultsInfo";
import SideButtons from "./components/SideButtons";
import { notCountedSx, stackSpacing, textSx } from "./components/styles";

const helperText: Record<LayerType, string> = {
  districts:
    "Kliknij na mapie żeby zobaczyć szczegółowe wyniki w wybranej Obwodowej Komisji Wyborczej.",
  gminy: "Kliknij na mapie żeby zobaczyć szczegółowe wyniki w wybranej gminie.",
  constituencies:
    "Kliknij na mapie żeby zobaczyć szczegółowe wyniki w wybranym okręgu wyborczym.",
};

const stackSx: SxProps<Theme> = (theme) => ({
  alignItems: "flex-start",
  position: "absolute",
  zIndex: 6,
  inset: mapComponentInset,
  top: theme.spacing(18) + " !important",
  bottom: "unset",
  height: { xs: "calc(100% - 200px)", sm: "calc(100% - 216px)" },
  pointerEvents: "none",
  "> *": {
    pointerEvents: "auto",
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

const countyNameSx: SxProps = {
  fontFamily: serifFont,
};

const CardWithSlide: React.FC<{
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose, children }) => {
  return (
    <Stack direction="row" spacing={stackSpacing} sx={stackSx}>
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
  const { elections, layer, showTurnout } = useElectionsStore();
  const electionResults = useElectionResults();
  const electionConfig = electionsConfig[elections];
  const localElectionsConfig = useLocalElectionConfig();
  const isLive = useIsLive();
  const { navigationOpen } = useLayoutStore();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  useEffect(() => {
    if (districtInfo) {
      setOpen(true);
    }
  }, [districtInfo]);

  useEffect(() => {
    if (navigationOpen && isMobile) {
      setOpen(false);
    }
  }, [navigationOpen, isMobile]);

  const onCloseClick = () => {
    setOpen((open) => !open);
  };

  const results = useMemo(() => {
    if (districtInfo) {
      return sortResults(districtInfo, elections);
    }

    return [];
  }, [districtInfo, elections]);

  const chart = useMemo(() => {
    const { turnout, results } = electionResults || {};

    if (districtInfo) return null;

    if (showTurnout) {
      if (!turnout?.turnout) return null;
      return <TurnoutChart {...turnout} />;
    }

    if (!results || !results.length) return null;

    return <StackedChart results={results} />;
  }, [districtInfo, electionConfig, showTurnout, electionResults]);

  const infoTables = useMemo(() => {
    if (!districtInfo) {
      return null;
    }

    if (isLive && !districtInfo.counted) {
      return (
        <Typography sx={notCountedSx}>
          Wyniki z tego obwodu nie zostały jeszcze opublikowane.
        </Typography>
      );
    }

    return showTurnout ? (
      <TurnoutTable results={results} district={districtInfo} />
    ) : (
      <ResultsTable results={results} district={districtInfo} full />
    );
  }, [districtInfo, showTurnout, isLive]);

  return (
    <CardWithSlide open={open} onClose={onCloseClick}>
      <Stack spacing={4}>
        <Typography variant="h2">
          {localElectionsConfig
            ? localElectionsConfig.name
            : "Szczegółowe wyniki"}
        </Typography>
        <ElectionsSelects />
        {isLive && <LiveResultsInfo />}
        {chart}
        {districtInfo ? (
          <Box>
            <Typography sx={countyNameSx}>
              {layer !== "constituencies"
                ? districtInfo.gmina
                : `Okręg numer ${districtInfo.constituency}`}
            </Typography>
            {layer === "districts" || districtInfo.voivodeship ? (
              <Typography sx={textSx}>
                {layer === "districts"
                  ? `Obwodowa Komisja Wyborcza ${districtInfo.number}`
                  : `województwo ${districtInfo.voivodeship}`}
              </Typography>
            ) : null}
          </Box>
        ) : (
          <Typography sx={textSx}>{helperText[layer]}</Typography>
        )}
        {infoTables}
      </Stack>
    </CardWithSlide>
  );
};

export default DistrictInfoComponent;
