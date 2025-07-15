import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { FallbackImg } from "../FallbackImg";
import { useAdminContext } from "../../context/AdminContext";
import { List } from "@mui/material";
import { CaretRight } from "phosphor-react";
import * as CT from "../../constants";
import { SideList } from "./SideList";
import { collapseList } from "../../constants";

export const SideBar = () => {
  const siddBarRef = useRef<HTMLDivElement | null>(null);
  const { loginState } = useAdminContext();
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  return (
    <div
      ref={siddBarRef}
      className="hidden lg:block lg:left-0 lg:relative pt-[50px] pl-[30px] pr-[30px] lg:mr-[20px] w-[260px] bg-white rounded-lg border-2"
    >
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
        </List>
      </nav>
    </div>
  );
};
