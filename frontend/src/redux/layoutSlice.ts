import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";

export interface LayoutState {
  navigationOpen: boolean;
}

const initialState: LayoutState = {
  navigationOpen: false,
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setNavigationOpen: (state, action: PayloadAction<boolean>) => {
      state.navigationOpen = action.payload;
    },
  },
});

export default layoutSlice.reducer;

export const useLayoutStore = () => {
  const dispatch = useDispatch();
  const { navigationOpen } = useSelector((state: RootState) => state.layout);

  const setNavigationOpen = (open: boolean) =>
    dispatch(layoutSlice.actions.setNavigationOpen(open));

  return {
    navigationOpen,
    setNavigationOpen,
  };
};
