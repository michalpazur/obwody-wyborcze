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
import { useIsParliamentaryElection } from "../../../../../utils/useIsParliamentaryElection";
import TextField from "../../../../TextField";

const ElectionsSelects: React.FC = () => {
  const { elections, setElections, candidate, setCandidate } =
    useElectionsStore();
  const isParliamentaryElection = useIsParliamentaryElection();

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
      electionsConfig[elections].candidates.filter(
        (candidate) => !!candidatesConfig[candidate].gradient,
      ),
    [elections],
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
      <TextField
        select
        onChange={onChangeCandidate}
        label={isParliamentaryElection ? "Nazwa listy" : "Kandydat"}
        value={candidate}
      >
        <MenuItem value="all">
          {isParliamentaryElection ? "Wszystkie listy" : "Wszyscy"}
        </MenuItem>
        {candidates.map((candidate) => (
          <MenuItem key={candidate} value={candidate}>
            {candidatesConfig[candidate].name}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};

export default ElectionsSelects;
