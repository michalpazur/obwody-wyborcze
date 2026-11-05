import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { CandidateId, ElectionId, electionsConfig } from "../config";
import { LayersConfig } from "../types";
import { RootState } from "./store";

export type CandidatesKey = CandidateId | "all";
export interface ElectionsState {
  elections: keyof typeof electionsConfig;
  candidate: CandidatesKey;
  layer: keyof LayersConfig;
  showTurnout: boolean;
}

const initialState: ElectionsState = {
  elections: "pres_2025_1",
  candidate: "all",
  layer: "districts",
  showTurnout: false,
};

export const electionsSlice = createSlice({
  name: "elections",
  initialState,
  reducers: {
    setElections: (state, action: PayloadAction<ElectionId>) => {
      state.elections = action.payload;
      state.candidate = "all";
      state.layer = "districts";
    },
    setCandidate: (state, action: PayloadAction<CandidatesKey>) => {
      state.candidate = action.payload;
      state.showTurnout = false;
    },
    setLayer: (state, action: PayloadAction<keyof LayersConfig>) => {
      state.layer = action.payload;
    },
    setShowTurnout: (state, action: PayloadAction<boolean>) => {
      state.showTurnout = action.payload;
    },
  },
});

export default electionsSlice.reducer;

export const useElectionsStore = () => {
  const dispatch = useDispatch();
  const { elections, candidate, layer, showTurnout } = useSelector(
    (state: RootState) => state.elections,
  );

  const setElections = (id: ElectionId) =>
    dispatch(electionsSlice.actions.setElections(id));

  const setCandidate = (id: CandidatesKey) =>
    dispatch(electionsSlice.actions.setCandidate(id));

  const setLayer = (layer: keyof LayersConfig) =>
    dispatch(electionsSlice.actions.setLayer(layer));

  const setShowTurnout = (showTurnout: boolean) => {
    dispatch(electionsSlice.actions.setShowTurnout(showTurnout));
  };

  return {
    elections,
    setElections,
    candidate,
    setCandidate,
    layer,
    setLayer,
    showTurnout,
    setShowTurnout,
  };
};
