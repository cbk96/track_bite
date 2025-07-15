import Header from "../../components/AdminHeader";
import Footer from "../../components/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { CustomAlert } from "../../components/alert";
import { useAdminContext } from "../../context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMaintaionAdminLogin } from "../../hook";

export function AdminLayout() {
  const location = useLocation();
  const noLayoutPages = ["/admin/login", "/admin/signup"];
  const { alertState, loginState, setAlertState } = useAdminContext();

  //페이지 마운트시 최상단으로 이동
  useEffect(() => {
    window.scrollTo({ top: 0 });
  });

  useMaintaionAdminLogin();

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
      <CustomAlert
        userRole="admin"
        alertState={alertState}
        setAlertState={setAlertState}
      />
    </>
  );
}

export default AdminLayout;
