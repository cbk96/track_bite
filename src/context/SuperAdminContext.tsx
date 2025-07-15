import React, { useState, createContext } from "react";
import { FC, PropsWithChildren, useContext } from "react";
import { useAlert } from "../components/alert";
import type { AlertState } from "../components/alert/useAlert";

type Callback = () => void;
type contextType = {
  loginState: { sAdminId: string; logined: boolean };
  alertState: AlertState;
  setLoginState: React.Dispatch<
    React.SetStateAction<{ sAdminId: string; logined: boolean }>
  >;
  setAlertState: React.Dispatch<React.SetStateAction<AlertState>>;
};

export const SuperAdminContext = createContext<contextType>({
  loginState: { sAdminId: "", logined: false },
  alertState: undefined,
  setLoginState: () => {},
  setAlertState: () => {},
});

export const SuperAdminProvider: FC<PropsWithChildren> = ({
  children,
  ...props
}) => {
  const [loginState, setLoginState] = useState<{
    sAdminId: string;
    logined: boolean;
  }>({ sAdminId: "", logined: false });

  const { alertState, setAlertState } = useAlert();

  const value = {
    loginState,
    alertState,
    setLoginState,
    setAlertState,
  };

  return (
    <SuperAdminContext.Provider value={value}>
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdminContext = () => {
  return useContext(SuperAdminContext);
};
