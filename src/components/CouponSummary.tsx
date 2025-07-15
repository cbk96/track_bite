import { FC, useState } from "react";
import { useSelector } from "react-redux";
import type { AppState } from "../store";
import type { CouponIssue, LoginCustomer } from "../type";
import { useEffect } from "react";
import PatternZigzagBG from "./PatternZigzagBG";

interface props {
  couponIssues: CouponIssue[];
}

export const CouponSummaryBox: FC<props> = ({ couponIssues }) => {
  const [unusedCoupons, setUnusedCoupons] = useState<CouponIssue[]>([]);
  const [usedCoupons, setUsedCoupons] = useState<CouponIssue[]>([]);

  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );

  useEffect(() => {
    const unusedCouponList = couponIssues.filter((coupon) => !coupon.used);
    const usedCouponList = couponIssues.filter((coupon) => coupon.used);
    setUnusedCoupons(unusedCouponList);
    setUsedCoupons(usedCouponList);
  }, [couponIssues]);

  return (
    <section className="relative w-full bg-main-cust">
      <div className="relative w-full lg:h-[170px] bg-main-cust-hover rounded-xl">
        <PatternZigzagBG className="absolute top-[150px] lg:top-[160px] left-0" />
        <div className="relative mx-auto lg:pt-7 lg:mb-7 lg:h-[150px] ">
          <div className="flex flex-col lg:flex-row justify-between mx-auto px-3 lg:px-0  w-full min-w-[320px] max-w-screen-sm lg:w-[1020px] lg:max-w-[1020px] lg:h-[160px] ">
            <div className="mt-5 pt-5 lg:w-[250px] text-left">
              <p className="flex flex-col pl-3 pr-3 mb-4 text-white">
                <span className="text-[18px]">{loginStatus.name}님의</span>
                <span className="font-bold text-[#ffff5f] text-[23px]">
                  보유 쿠폰 목록
                </span>
              </p>
            </div>
            <div className="flex items-center bg-white w-full lg:w-7/12 text-center shadow-[0_8px_15px_rgba(0,0,0,0.1)] leading-[40px] lg:leading-[67px] font-bold rounded-lg overflow-hidden">
              <p className="bg-white w-1/2 h-[100px] lg:h-[160px] pt-[15px] lg:pt-[30px]">
                <span className="block text-base">미사용 쿠폰</span>
                <span className="block text-[20px] lg:text-[45px] text-main-cust ">
                  {unusedCoupons.length}
                </span>
              </p>
              <p className="bg-white w-1/2 h-[100px] lg:h-[160px] pt-[15px] lg:pt-[30px] before:absolute before:block before:h-[70px] lg:before:h-[100px] before:border-r-2">
                <span className="block text-base">사용한 쿠폰</span>
                <span className="block text-[20px] lg:text-[45px] text-main-cust ">
                  {usedCoupons.length}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CouponSummaryBox;
