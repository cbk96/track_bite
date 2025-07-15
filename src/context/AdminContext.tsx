import React, { useState, createContext, useCallback, useEffect } from "react";
import { FC, PropsWithChildren, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { LoginAdmin, OperatingHours } from "../type/adminInfoTypes";
import * as IT from "../type";
import { useAlert } from "../components/alert";
import { post } from "../server";
import type { AlertState } from "../components/alert/useAlert";
import { useLocation } from "react-router-dom";

type Callback = () => void;
type contextType = {
  loginState: LoginAdmin;
  alertState: AlertState;
  isVisibleMSideBar: boolean;
  setLoginState: React.Dispatch<React.SetStateAction<LoginAdmin>>;
  login: (storeId: string, password: string, callback?: Callback) => void;
  setAlertState: React.Dispatch<React.SetStateAction<AlertState>>;
  setIsVisibleMSideBar: (visiable: boolean) => void;
};

export const AdminContext = createContext<contextType>({
  loginState: IT.initialLoginAdmin,
  alertState: undefined,
  isVisibleMSideBar: false,
  setLoginState: () => {},
  login: () => {},
  setAlertState: () => {},
  setIsVisibleMSideBar: () => {},
});

interface AdminDBProviderProps {}
export const AdminDBProvider: FC<PropsWithChildren<AdminDBProviderProps>> = ({
  children,
  ...props
}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loginState, setLoginState] = useState<LoginAdmin>(
    IT.initialLoginAdmin
  );
  const [isVisibleMSideBar, setIsVisibleMSideBar] = useState(false);

  const location = useLocation();
  const path = location.pathname;
  useEffect(() => {
    setIsVisibleMSideBar(false);
  }, [path]);

  const { alertState, setAlertState } = useAlert();

  const login = useCallback(
    (storeId: string, password: string, callback?: Callback) => {
      const admin = { storeId, password };
      post("/admin/login", admin)
        .then((res) => res.json())
        .then(
          (result: {
            ok: boolean;
            errorMsg?: string;
            loginInfo?: LoginAdmin;
          }) => {
            if (result.ok && result.loginInfo !== undefined) {
              setLoginState(result.loginInfo);
              callback && callback();
            } else {
              setAlertState(result.errorMsg);
            }
          }
        )
        .catch((error) => {
          setAlertState("로그인 처리 중 오류가 발생했습니다.");
        });
    },
    []
  );

  const value = {
    loginState,
    alertState,
    isVisibleMSideBar,
    setLoginState,
    login,
    setAlertState,
    setIsVisibleMSideBar,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  return useContext(AdminContext);
};
