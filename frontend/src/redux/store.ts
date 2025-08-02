import { configureStore } from "@reduxjs/toolkit";
import electionsReducer from "./electionsSlice";

export const store = configureStore({
  reducer: {
    elections: electionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
