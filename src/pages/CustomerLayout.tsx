import Header from "../components/Header";
import Footer from "../components/Footer";
import { BottomNaviBar, SearchForm } from "../components";
import { Outlet, useLocation } from "react-router-dom";
import { CustomAlert } from "../components/alert";
import { useCustomerPublic } from "../context";
import { useEffect } from "react";
import { useMaintaionCustomerLogin } from "../hook";
import { useSelector } from "react-redux";
import * as CS from "../store/customer";
import { AppSettingApi } from "../service";
import { AppState } from "../store";

export function CustomerLayout() {
  const location = useLocation();
  const noLayoutPages = ["/login", "/signup"];
  const { alertState, setAlertState } = useCustomerPublic();
  const { useKeepWork } = AppSettingApi();
  const { keepMutate } = useKeepWork();

  //페이지 마운트시 최상단으로 이동
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  //로그인 유지
  useMaintaionCustomerLogin();

  //render 서버 다운을 방지하기 위해 12분 주기로 핑 전송
  useEffect(() => {
    const interval = setInterval(() => {
      keepMutate();
    }, 12 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return noLayoutPages.includes(location.pathname) ? (
    <>
      <Outlet />
      <Footer />
    </>
  ) : (
    <>
      <Header />
      <Outlet />
      <Footer />
      <BottomNaviBar />
      <CustomAlert
        userRole="customer"
        alertState={alertState}
        setAlertState={setAlertState}
      />
    </>
  );
}

export default CustomerLayout;
