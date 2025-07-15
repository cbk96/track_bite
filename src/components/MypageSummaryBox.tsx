import { FC, useState } from "react";
import { PurchaseApi, CouponApi } from "../service";
import { useSelector } from "react-redux";
import type { AppState } from "../store";
import type { CouponIssue, LoginCustomer } from "../type";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Gear } from "phosphor-react";

interface MypageSummaryBoxProps {
  activeCartListPopup: () => void;
}

export const MypageSummaryBox: FC<MypageSummaryBoxProps> = ({
  activeCartListPopup,
}) => {
  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );
  const { useGetCouponIssues } = CouponApi();
  const { couponIssueGetData } = useGetCouponIssues(
    "",
    loginStatus.customerId,
    loginStatus.logined === "login"
  );
  const { useGetPurchaseCustCount } = PurchaseApi();
  const { getPurchaseCustCountData } = useGetPurchaseCustCount(
    loginStatus.customerId
  );
  const [couponIsslist, setCouponIsslist] = useState<CouponIssue[]>([]);

  useEffect(() => {
    if (couponIssueGetData && Array.isArray(couponIssueGetData)) {
      setCouponIsslist(couponIssueGetData);
    }
  }, [couponIssueGetData]);

  return (
    <section className="relative w-full bg-main-cust">
      <div className="relative pt-[28px] w-full bg-[#f2f2f2] rounded-tl-xl rounded-tr-xl">
        <div className="flex flex-col relative px-3 lg:px-0 mx-auto lg:flex-row justify-between lg:w-[1020px] max-w-[1580px] lg:h-[160px] lg:mx-auto">
          <div className="w-full mx-auto max-w-screen-sm lg:max-w-[1020px] mt-5 text-left lg:w-5/12">
            <Link
              to="/editCustomer"
              className="flex items-center
               pl-3 pr-3 mb-4 text-[23px] text-main-cust-hover font-bold"
            >
              <Gear size={20} weight="fill" className="mr-1" />
              <span>{loginStatus.name + "님"}</span>
              <span className="pl-1 text-[14px]">&gt;</span>
            </Link>
            <button
              onClick={activeCartListPopup}
              className="hidden lg:inline px-3 text-white lg:text-[#000] text-[14px] lg:text-[16px]"
            >
              장바구니에 담긴 메뉴 &gt;
            </button>
          </div>
          <div
            className="flex items-center w-full lg:w-7/12 mx-auto max-w-screen-sm lg:max-w-[1020px] bg-white text-center border border-[#ccc] lg:translate-y-0 leading-[40px] lg:leading-[67px]
          lg:shadow-[0_8px_15px_rgba(0,0,0,0.1)] font-bold rounded-xl overflow-hidden"
          >
            <p className="bg-white  w-1/2 h-[100px] lg:h-[160px] pt-[15px] lg:pt-[30px]">
              <span className="block text-base">총 주문건수</span>
              <span className="block text-[20px] lg:text-[45px] text-main-cust ">
                {getPurchaseCustCountData ? getPurchaseCustCountData : 0}
              </span>
            </p>
            <Link to="/mycoupons" className="w-1/2">
              <p className="bg-white h-[100px] lg:h-[160px] pt-[15px] lg:pt-[30px] before:absolute before:block before:h-[70px] lg:before:h-[100px] before:border-r-2 ">
                <span className="block text-base">쿠폰</span>
                <span className="block text-[20px] lg:text-[45px] text-main-cust ">
                  {couponIsslist.length}
                </span>
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MypageSummaryBox;
