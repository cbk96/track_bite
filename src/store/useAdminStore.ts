import { configureStore } from "@reduxjs/toolkit";
import { adminReducer } from "./adminReducer";
import logger from "redux-logger";
import { thunk } from "redux-thunk";
import { useMemo } from "react";

const userLogger = process.env.NODE_ENV !== "production";

const initializeStore = () => {
  const middleware: any[] = [thunk];
  if (userLogger) {
    middleware.push(logger);
  }

  const store = configureStore({
    reducer: adminReducer,
    middleware: (getDefaultMiddleWare) =>
      getDefaultMiddleWare().concat(middleware),
  });
  return store;
};

export function useAdminStore() {
  const store = useMemo(() => initializeStore(), []);
  return store;
}
