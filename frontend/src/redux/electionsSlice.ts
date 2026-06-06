import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CandidateId, ElectionId, electionsConfig } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";

export type CandidatesKey = CandidateId | "all";
export interface ElectionsState {
  elections: keyof typeof electionsConfig;
  candidate: CandidatesKey;
  showTurnout: boolean;
}

const initialState: ElectionsState = {
  elections: "pres_2025_1",
  candidate: "all",
  showTurnout: false,
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
      state.showTurnout = false;
    },
    setShowTurnout: (state, action: PayloadAction<boolean>) => {
      state.showTurnout = action.payload;
    },
  },
});

export default electionsSlice.reducer;

export const useElectionsStore = () => {
  const dispatch = useDispatch();
  const { elections, candidate, showTurnout } = useSelector(
    (state: RootState) => state.elections,
  );

  const setElections = (id: ElectionId) =>
    dispatch(electionsSlice.actions.setElections(id));

  const setCandidate = (id: CandidatesKey) =>
    dispatch(electionsSlice.actions.setCandidate(id));

  const setShowTurnout = (showTurnout: boolean) => {
    dispatch(electionsSlice.actions.setShowTurnout(showTurnout));
  };

  return {
    elections,
    setElections,
    candidate,
    setCandidate,
    showTurnout,
    setShowTurnout,
  };
};
