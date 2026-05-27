import { MenuItem, Stack } from "@mui/material";
import React, { useMemo } from "react";
import {
  candidatesConfig,
  ElectionId,
  electionsConfig,
} from "../../../../../config";
import {
  CandidatesKey,
  useElectionsStore,
} from "../../../../../redux/electionsSlice";
import {
  getAllWinnersLabel,
  getNameColumnLabel,
} from "../../../../../utils/getLabels";
import TextField from "../../../../TextField";

const ElectionsSelects: React.FC = () => {
  const { elections, setElections, candidate, setCandidate } =
    useElectionsStore();
  const electionConfig = electionsConfig[elections];

  const onChangeElections = (e: React.ChangeEvent<HTMLInputElement>) => {
    const elections = e.target.value as ElectionId;
    setElections(elections);
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
      <TextField
        select
        onChange={onChangeElections}
        label="Wybory"
        value={elections}
      >
        {(Object.keys(electionsConfig) as ElectionId[]).map((key) => (
          <MenuItem key={key} value={key}>
            {electionsConfig[key].name}
          </MenuItem>
        ))}
      </TextField>
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
