import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { FallbackImg } from "../FallbackImg";
import { useAdminContext } from "../../context/AdminContext";
import { List } from "@mui/material";
import { CaretRight } from "phosphor-react";
import * as CT from "../../constants";
import { SideList } from "./SideList";
import { collapseList } from "../../constants";
import { AuthApi } from "../../service";

export const MobileSideBar = () => {
  const siddBarRef = useRef<HTMLDivElement | null>(null);
  const { loginState, isVisibleMSideBar, setIsVisibleMSideBar } =
    useAdminContext();
  const { useAdminLogout } = AuthApi();
  const { mutateAdminLogout } = useAdminLogout();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const logout = () => {
    // eslint-disable-next-line no-restricted-globals
    const logoutConfirm = confirm("로그아웃 하시겠습니까?");
    if (logoutConfirm && loginState.logined) {
      mutateAdminLogout();
      navigate("/admin/login");
    }
  };

  const backgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      setIsVisibleMSideBar(false);
    }
  };

  const hideMSideBar = () => {
    setIsVisibleMSideBar(false);
  };

  return (
    <>
      <div
        onClick={backgroundClick}
        className={`${
          isVisibleMSideBar ? "" : "hidden"
        } fixed top-0 left-0 lg:hidden duration-200 w-screen h-screen bg-grayCustom animate-fadeIn z-[900]`}
      ></div>
      <div
        ref={siddBarRef}
        className={`${
          isVisibleMSideBar ? "left-0" : "left-[-260px]"
        } fixed top-0 pt-[25px] pl-5 pr-[30px] lg:mr-[20px] w-[260px]
      duration-300 h-screen bg-white rounded-tr-lg rounded-br-lg border-2 z-[901]`}
      >
        <p className="flex mb-[25px] items-center w-full h-6 mr-5 ">
          <button
            type="button"
            onClick={hideMSideBar}
            className="relative flex flex-col justify-center w-6"
          >
            <span className="absolute block top-0 w-full h-1 mb-1 rotate-45 bg-[#ccc]"></span>
            <span className="absolute block top-0 w-full h-1 -rotate-45 bg-[#ccc]"></span>
          </button>
        </p>
        <nav>
          <div className="flex">
            {loginState !== null && loginState.logined && (
              <>
                <p className="w-[88px] ">
                  <FallbackImg
                    src={loginState.logoPath}
                    fallback="defaultStore.jpg"
                    alt="스토어 메인 이미지"
                    className="block w-[80px] h-[80px] bg-white shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-lg"
                  />
                </p>
                <p className="pl-3 text-[16px] w-[108px] font-bold">
                  {loginState.storeName}
                </p>
              </>
            )}
          </div>
          <List>
            {collapseList.map((list, index) => (
              <SideList
                key={index + 1}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                listNumber={index + 1}
                listItemText={list.listItemText}
                collapse={list.collapse}
                phosphor={list.phosphor}
              />
            ))}
            <div className="pl-3 leading-[70px] text-[14px] text-main font-bold">
              <Link
                to={`/store/storeview/${loginState.storePublicId}`}
                className="flex items-center"
              >
                <span className="mr-2">상점 페이지로</span>{" "}
                <CaretRight weight="bold" />
              </Link>
            </div>

            <div className="pl-3 text-[14px] font-bold">
              <button type="button" onClick={logout}>
                로그아웃
              </button>
            </div>
          </List>
        </nav>
      </div>
    </>
  );
};
