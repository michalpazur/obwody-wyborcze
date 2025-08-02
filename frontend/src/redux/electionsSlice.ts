import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ElectionId, electionsConfig } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";

export interface ElectionsState {
  elections: keyof typeof electionsConfig;
}

const initialState: ElectionsState = {
  elections: "pres_2025_1",
};

export const electionsSlice = createSlice({
  name: "elections",
  initialState,
  reducers: {
    setElections: (state, action: PayloadAction<ElectionId>) => {
      state.elections = action.payload;
    },
  },
});

export default electionsSlice.reducer;

export const useElectionsStore = () => {
  const dispatch = useDispatch();
  const { elections } = useSelector((state: RootState) => state.elections);

  const setElections = (id: ElectionId) =>
    dispatch(electionsSlice.actions.setElections(id));

  return { elections, setElections };
};
