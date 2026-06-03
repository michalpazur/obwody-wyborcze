import { MenuItem, Stack, Tab, Tabs, Typography } from "@mui/material";
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
  const { elections, setElections, candidate, setCandidate } =
    useElectionsStore();
  const electionConfig = electionsConfig[elections];
  const { availableElections, localElections } = useContext(MapContext);

  const onChangeElections = (e: React.ChangeEvent<HTMLInputElement>) => {
    const elections = e.target.value as ElectionId;
    setElections(elections);
  };

  const onTabChange = (e: React.SyntheticEvent, value: ElectionId) => {
    setElections(value);
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
    <Stack spacing={localElections ? 4 : 2}>
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
      {electionConfig.type === "referendum" && (
        <Typography
          variant="h3"
          sx={mergeSx(textSx, { fontFamily: "'Bree Serif'" })}
        >
          {electionConfig.question}
        </Typography>
      )}
      {!electionConfig.hideWinners && (
        <TextField
          select
          onChange={onChangeCandidate}
          label={getNameColumnLabel(elections)}
          value={candidate}
        >
          <MenuItem value="all">{getAllWinnersLabel(elections)}</MenuItem>
          {candidates.map((candidate) => (
            <MenuItem key={candidate} value={candidate}>
              {candidatesConfig[candidate].name}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Stack>
  );
};

export default ElectionsSelects;
