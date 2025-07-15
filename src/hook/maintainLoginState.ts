import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "../store";
import type { LoginCustomer, LoginAdmin } from "../type";
import * as U from "../utils";
import * as CS from "../store/customer";
import { useLocation, useNavigate } from "react-router-dom";
import { useCustomerPublic, useAdminContext } from "../context";
import { useEffect } from "react";
import { AuthApi } from "../service";

const customerLoginChkPath = ["/mypage", "/editCustomer", "/mycoupons"];
const adminLoginChkPath = ["/admin/login", "/admin/signup"];

export const useMaintaionCustomerLogin = () => {
  const { setAlertState: setCUSAlertState } = useCustomerPublic();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );

  const onError = () => {
    if (customerLoginChkPath.includes(location.pathname)) {
      setCUSAlertState("로그인 정보가 존재하지 않습니다.");
      navigate("/");
    }
    const guestAccount = U.createGuestAccount();
    dispatch(CS.loginCustomer(guestAccount));
  };

  const { useRefreshCustomerLoginToken } = AuthApi();
  const { mutateLoginExtend } = useRefreshCustomerLoginToken(onError);

  useEffect(() => {
    if (
      !loginStatus ||
      loginStatus.logined !== "login" ||
      loginStatus.logined === undefined
    ) {
      mutateLoginExtend();
    }
  }, []);
};

export const useMaintaionAdminLogin = () => {
  const {
    setAlertState: setADAlertState,
    loginState,
    setLoginState,
  } = useAdminContext();
  const navigate = useNavigate();
  const location = useLocation();

  const onError = () => {
    if (!adminLoginChkPath.includes(location.pathname)) {
      setADAlertState("로그인 정보가 존재하지 않습니다.");
      navigate("/admin/login");
    }
  };

  const { useRefreshAdminLoginToken } = AuthApi();
  const { mutateADLoginExtend } = useRefreshAdminLoginToken(onError);

  useEffect(() => {
    if (!loginState.logined || loginState === undefined) {
      mutateADLoginExtend();
    }
  }, []);
};
