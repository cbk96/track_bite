import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../store";
import { AuthApi } from "../service";
import { useNavigate } from "react-router-dom";
import { useCustomerPublic } from "../context";
import { SearchForm } from "./";
import type { LoginCustomer } from "../type";
import * as CT from "../constants";

export default function Header() {
  const { setAlertState } = useCustomerPublic();
  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );
  const navigate = useNavigate();

  const { useCustomerLogout } = AuthApi();
  const { mutateLogout } = useCustomerLogout();

  const logout = () => {
    // eslint-disable-next-line no-restricted-globals
    const logoutConfirm = confirm("로그아웃 하시겠습니까?");
    if (logoutConfirm && loginStatus.logined === "login") {
      mutateLogout();
      navigate("/");
    } else {
      setAlertState("로그인 상태가 아닙니다.");
    }
  };

  return (
    <div className="w-full min-w-[320px] bg-main-cust ">
      <div className="flex justify-between mx-auto py-5 lg:py-0 w-full min-w-[320px] max-w-screen-sm lg:w-[1020px] lg:max-w-[1020px] lg:h-[80px] leading-[80px] items-center">
        <p className="hidden h-full lg:block">
          <span className="mr-3 text-[32px] text-white font-josefin font-bold">
            <Link to="/">Track Bite</Link>
          </span>
        </p>
        <SearchForm className="flex-grow" />
        <p className="justify-end hidden h-full text-white lg:flex">
          {loginStatus.logined === "login" ? (
            <>
              <span className="mr-4 ">
                <Link to="/mypage">마이페이지</Link>
              </span>
              <span>
                <button type="button" onClick={logout}>
                  로그아웃
                </button>
              </span>
            </>
          ) : (
            <>
              <span>
                <Link to="/login">로그인</Link>
              </span>
              <span className="ml-4">
                <Link to="/signup">회원가입</Link>
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
