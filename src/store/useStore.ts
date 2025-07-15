import { configureStore } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { rootReducer } from "./rootReducer";
import logger from "redux-logger";
import { thunk } from "redux-thunk";

const userLogger = process.env.NODE_ENV !== "production";

const initializeStore = () => {
  const middleware: any[] = [thunk];
  if (userLogger) {
    middleware.push(logger);
    //middleware.push(thunk);
    //console.log("middleware : ", middleware);
  }

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleWare) =>
      getDefaultMiddleWare().concat(middleware),
  });
  return store;
};

export function useStore() {
  const store = useMemo(() => initializeStore(), []);
  return store;
}
