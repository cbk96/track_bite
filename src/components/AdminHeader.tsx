import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAdminContext } from "../context/AdminContext";
import { AuthApi } from "../service";
import { useNavigate } from "react-router-dom";
import * as CT from "../constants";

export default function AdminHeader() {
  const { loginState, setIsVisibleMSideBar } = useAdminContext();
  const { useAdminLogout } = AuthApi();
  const { mutateAdminLogout } = useAdminLogout();
  const navigate = useNavigate();

  const logout = () => {
    // eslint-disable-next-line no-restricted-globals
    const logoutConfirm = confirm("로그아웃 하시겠습니까?");
    if (logoutConfirm && loginState.logined) {
      mutateAdminLogout();
      navigate("/admin/login");
    }
  };

  const showMSideBar = () => {
    setIsVisibleMSideBar(true);
  };

  return (
    <div className="w-full bg-white">
      <div className="mx-auto pl-5 w-full max-w-screen-sm lg:w-[1300px] lg:max-w-[1300px] min-w-[320px] h-[80px] leading-[80px] flex lg:justify-between">
        <p className="flex items-center w-6 mr-5 lg:hidden">
          <button
            type="button"
            onClick={showMSideBar}
            className="flex flex-col justify-center w-full"
          >
            <span className="block w-full h-1 mb-1 bg-[#ccc]"></span>
            <span className="block w-full h-1 mb-1 bg-[#ccc]"></span>
            <span className="block w-full h-1 bg-[#ccc]"></span>
          </button>
        </p>
        <p className="h-full">
          <span className="mr-3 text-[25px] lg:text-[32px] text-main font-josefin font-bold">
            <Link to="/admin">Track Bite</Link>
          </span>
          <span className="lg:text-[20px] font-bold">사장님 사이트</span>
        </p>
        <p className="hidden lg:flex justify-end lg:w-[350px] h-[80px]">
          <span className="mr-4 text-main">
            <Link to="/amdin">{loginState.storeName}</Link>
          </span>
          <span>
            <button type="button" onClick={logout}>
              로그아웃
            </button>
          </span>
        </p>
      </div>
    </div>
  );
}
