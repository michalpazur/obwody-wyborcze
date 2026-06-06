import { Box, MenuItem, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useContext, useMemo } from "react";
import {
  candidatesConfig,
  ElectionId,
  electionsConfig,
} from "../../../../../config";
import { MapContext } from "../../../../../context/MapContext";
import {
  CandidatesKey,
  useElectionsStore,
} from "../../../../../redux/electionsSlice";
import {
  getAllWinnersLabel,
  getElectionLabel,
  getNameColumnLabel,
} from "../../../../../utils/getLabels";
import { mergeSx } from "../../../../../utils/mergeSx";
import TextField from "../../../../TextField";
import { textSx } from "./styles";

const ElectionsSelects: React.FC = () => {
  const {
    elections,
    setElections,
    candidate,
    setCandidate,
    showTurnout,
    setShowTurnout,
  } = useElectionsStore();
  const electionConfig = electionsConfig[elections];
  const { availableElections, localElections } = useContext(MapContext);

  const onChangeElections = (e: React.ChangeEvent<HTMLInputElement>) => {
    const elections = e.target.value as ElectionId;
    setElections(elections);
  };

  const onTabChange = (e: React.SyntheticEvent, value: ElectionId) => {
    setElections(value);
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

  const candidates = useMemo(
    () =>
      electionConfig.candidates.filter(
        (candidate) => !!candidatesConfig[candidate].gradient,
      ),
    [electionConfig],
  );

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
      ) : (
        <Tabs value={elections} onChange={onTabChange}>
          {availableElections.map((electionId) => (
            <Tab
              key={electionId}
              value={electionId}
              label={getElectionLabel(electionId)}
            />
          ))}
        </Tabs>
      )}
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
          sx={mergeSx(textSx, { fontFamily: "'Bree Serif'" })}
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
