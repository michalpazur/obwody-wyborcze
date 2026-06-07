import { configureStore } from "@reduxjs/toolkit";
import electionsReducer from "./electionsSlice";
import layoutReducer from "./layoutSlice";

export const store = configureStore({
  reducer: {
    elections: electionsReducer,
    layout: layoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
