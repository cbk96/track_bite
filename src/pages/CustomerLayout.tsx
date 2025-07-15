import Header from "../components/Header";
import Footer from "../components/Footer";
import { BottomNaviBar, SearchForm } from "../components";
import { Outlet, useLocation } from "react-router-dom";
import { CustomAlert } from "../components/alert";
import { useCustomerPublic } from "../context";
import { useEffect } from "react";
import { useMaintaionCustomerLogin } from "../hook";
import { useDispatch, useSelector } from "react-redux";
import * as CS from "../store/customer";
import * as U from "../utils";
import { AppState } from "../store";

export function CustomerLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const noLayoutPages = ["/login", "/signup"];
  const { alertState, setAlertState } = useCustomerPublic();

  const loginStatus = useSelector<AppState, CS.LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );

  //페이지 마운트시 최상단으로 이동
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  //로그인 유지
  useMaintaionCustomerLogin();

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
