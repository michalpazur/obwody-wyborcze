import { MenuItem, Stack } from "@mui/material";
import React, { useState } from "react";
import { ElectionId, electionsConfig } from "../../../../../config";
import { useElectionsStore } from "../../../../../redux/electionsSlice";
import TextField from "../../../../TextField";

const ElectionsSelects: React.FC = () => {
  const { elections, setElections } = useElectionsStore();

  const onChangeElections = (e: React.ChangeEvent<HTMLInputElement>) => {
    const elections = e.target.value as ElectionId;
    setElections(elections);
  };

  return (
    <Stack spacing={2}>
      <TextField select onChange={onChangeElections} label="Wybory" value={elections}>
        {Object.keys(electionsConfig).map((key) => (
          <MenuItem key={key} value={key}>
            {electionsConfig[key].name}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};

export default ElectionsSelects;
