import { useState } from "react";
import { useAsyncError } from "react-router-dom";

export type AlertState = string | undefined;

export const useAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>();
  return { alertState, setAlertState };
};
