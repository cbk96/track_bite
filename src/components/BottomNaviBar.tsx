import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { User, House } from "phosphor-react";
import { ReactComponent as UnUsedCouponIcon } from "../svg/coupon_unused.svg";
import { ReactComponent as UnUsedCouponIconFill } from "../svg/coupon_unused_fill.svg";
import { useSelector } from "react-redux";
import { AppState } from "../store";
import { LoginCustomer } from "../type";

export const BottomNaviBar = () => {
  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );
  const location = useLocation();
  const [naviPath, setNaviPath] = useState<string>(); // "/" | "/mypage" | "/mycoupons"

  const path = location.pathname;

  useEffect(() => {
    setNaviPath(path);
  }, [path]);

  return (
    <div
      className={`fixed bottom-0 flex justify-center items-center ${
        loginStatus.logined === "login" ? "px-6" : "px-12"
      } 
    border-t-2 lg:hidden w-full bg-white h-[50px] text-center text-[10px] z-10`}
    >
      <Link to="/" className="flex flex-col items-center w-1/3 mx-5">
        <House weight={naviPath === "/" ? "fill" : "regular"} size={25} />
        <span>홈</span>
      </Link>

      {loginStatus.logined === "login" ? (
        <>
          <Link to="/mypage" className="flex flex-col items-center w-1/3 mx-5">
            <User
              weight={naviPath === "/mypage" ? "fill" : "regular"}
              size={25}
            />
            <span>마이페이지</span>
          </Link>
          <Link
            to="/mycoupons"
            className="flex flex-col items-center w-1/3 mx-5"
          >
            {naviPath === "/mycoupons" ? (
              <UnUsedCouponIconFill className="h-[15px]" />
            ) : (
              <UnUsedCouponIcon className="h-[15px]" />
            )}
            <span>쿠폰</span>
          </Link>
        </>
      ) : (
        <Link to="/login" className="flex flex-col items-center w-1/3 mx-5">
          <User weight={naviPath === "/login" ? "fill" : "regular"} size={25} />
          <span>로그인</span>
        </Link>
      )}
    </div>
  );
};
