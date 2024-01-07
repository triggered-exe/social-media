import { configureStore } from "@reduxjs/toolkit";

import { reducer } from "./reduxSlice";
export const store = configureStore({
  reducer: {
    reducer,
  }
})