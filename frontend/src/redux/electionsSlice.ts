import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CandidateId, ElectionId, electionsConfig } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";

export type CandidatesKey = CandidateId | "all";
export interface ElectionsState {
  elections: keyof typeof electionsConfig;
  candidate: CandidatesKey;
}

const initialState: ElectionsState = {
  elections: "pres_2025_1",
  candidate: "all",
};

export const electionsSlice = createSlice({
  name: "elections",
  initialState,
  reducers: {
    setElections: (state, action: PayloadAction<ElectionId>) => {
      state.elections = action.payload;
      state.candidate = "all";
    },
    setCandidate: (state, action: PayloadAction<CandidatesKey>) => {
      state.candidate = action.payload;
    },
  },
});

export default electionsSlice.reducer;

export const useElectionsStore = () => {
  const dispatch = useDispatch();
  const { elections, candidate } = useSelector(
    (state: RootState) => state.elections
  );

  const setElections = (id: ElectionId) =>
    dispatch(electionsSlice.actions.setElections(id));

  const setCandidate = (id: CandidatesKey) =>
    dispatch(electionsSlice.actions.setCandidate(id));

  return { elections, setElections, candidate, setCandidate };
};
