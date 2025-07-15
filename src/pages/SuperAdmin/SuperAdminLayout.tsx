import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSuperAdminContext } from "../../context";

export function SuperAdminLayout() {
  const { loginState } = useSuperAdminContext();

  const navigate = useNavigate();

  //페이지 마운트시 최상단으로 이동
  useEffect(() => {
    window.scrollTo({ top: 0 });
  });

  useEffect(() => {
    if (!loginState.logined) {
      navigate("/superadmin/login");
    }
  }, [loginState]);

  return <Outlet />;
}

export default SuperAdminLayout;
