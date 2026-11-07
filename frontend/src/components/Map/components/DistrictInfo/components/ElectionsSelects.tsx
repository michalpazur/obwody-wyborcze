import { Box, MenuItem, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useContext, useMemo } from "react";
import {
  candidatesConfig,
  ElectionId,
  electionsConfig,
  layerTypes,
} from "../../../../../config";
import { MapContext } from "../../../../../context/MapContext";
import {
  CandidatesKey,
  useElectionsStore,
} from "../../../../../redux/electionsSlice";
import { serifFont } from "../../../../../theme";
import { LayerType } from "../../../../../types";
import {
  getAllWinnersLabel,
  getElectionLabel,
  getNameColumnLabel,
} from "../../../../../utils/getLabels";
import { mergeSx } from "../../../../../utils/mergeSx";
import { sortCandidates } from "../../../../../utils/sortCandidates";
import { useElectionConfig } from "../../../../../utils/useElectionConfig";
import { useElectionResults } from "../../../../../utils/useElectionResults";
import TextField from "../../../../TextField";
import { textSx } from "./styles";

const layerNames: Record<LayerType, string> = {
  districts: "Obwody",
  gminy: "Gminy",
  constituencies: "Okręgi",
};

const ElectionsSelects: React.FC = () => {
  const {
    elections,
    setElections,
    candidate,
    setCandidate,
    layer,
    setLayer,
    showTurnout,
    setShowTurnout,
  } = useElectionsStore();
  const electionConfig = useElectionConfig();
  const layersConfig = electionConfig.layersConfig;
  const { availableElections, localElections } = useContext(MapContext);
  const results = useElectionResults();

  const onChangeElections = (e: React.ChangeEvent<HTMLInputElement>) => {
    const elections = e.target.value as ElectionId;
    setElections(elections);
  };

  const onElectionsTabChange = (e: React.SyntheticEvent, value: ElectionId) => {
    setElections(value);
  };

  const onLayerChange = (e: React.SyntheticEvent, value: LayerType) => {
    setLayer(value);
  };

  const onChangeShowTurnout = (
    e: React.SyntheticEvent,
    value: "turnout" | "results",
  ) => {
    setShowTurnout(value === "turnout");
  };

  const onChangeCandidate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const candidate = e.target.value as CandidatesKey;
    setCandidate(candidate);
  };

  const candidates = useMemo(() => {
    const candidates = sortCandidates(elections, results?.results);
    return candidates.filter(
      (candidate) => !!candidatesConfig[candidate].gradient,
    );
  }, [elections, results]);

  return (
    <Stack spacing={2}>
      {!localElections ? (
        <TextField
          select
          onChange={onChangeElections}
          label="Wybory"
          value={elections}
        >
          {availableElections.map((key) => (
            <MenuItem key={key} value={key}>
              {electionsConfig[key].name}
            </MenuItem>
          ))}
        </TextField>
      ) : availableElections.length > 1 ? (
        <Tabs value={elections} onChange={onElectionsTabChange}>
          {availableElections.map((electionId) => (
            <Tab
              key={electionId}
              value={electionId}
              label={getElectionLabel(electionId)}
            />
          ))}
        </Tabs>
      ) : null}
      {layersConfig.gminy || layersConfig.constituencies ? (
        <Tabs value={layer} onChange={onLayerChange}>
          {layerTypes.map(
            (layer) =>
              layersConfig[layer] && (
                <Tab key={layer} value={layer} label={layerNames[layer]} />
              ),
          )}
        </Tabs>
      ) : null}
      <Tabs
        value={showTurnout ? "turnout" : "results"}
        onChange={onChangeShowTurnout}
      >
        <Tab value="results" label="Wyniki" />
        <Tab value="turnout" label="Frekwencja" />
      </Tabs>
      {electionConfig.type === "referendum" && (
        <Typography
          variant="h3"
          sx={mergeSx(textSx, { fontFamily: serifFont })}
        >
          {electionConfig.question}
        </Typography>
      )}
      {!electionConfig.hideWinners && !showTurnout && (
        <Box>
          <TextField
            select
            onChange={onChangeCandidate}
            label={getNameColumnLabel(elections)}
            value={candidate}
            sx={{ mt: 1, width: "100%" }}
          >
            <MenuItem value="all">{getAllWinnersLabel(elections)}</MenuItem>
            {candidates.map((candidate) => (
              <MenuItem key={candidate} value={candidate}>
                {candidatesConfig[candidate].name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}
    </Stack>
  );
};

export default ElectionsSelects;
