import { FC, PropsWithChildren } from "react";
import type { Coupon, CouponIssue } from "../type";
import * as U from "../utils";

interface props {
  coupon: Coupon | CouponIssue;
  couponClick: (coupon: Coupon | CouponIssue) => void;
  type: "view" | "download";
  disabled?: boolean;
  className?: string;
}

export const CouponItem: FC<PropsWithChildren<props>> = ({
  coupon,
  couponClick,
  type,
  disabled,
  className,
  children,
}) => {
  return (
    <button
      onClick={() => couponClick(coupon)}
      disabled={disabled}
      className={`flex items-center justify-between w-full pt-2 pb-2 pl-5 pr-5 mt-1 mb-1
                text-left shadow-[0_0px_8px_rgba(0,0,0,0.1)] bg-white border-2 rounded-lg duration-150 cursor-pointer
                 ${className}`}
    >
      <div className="">
        <p className="font-bold text-orange">
          <span className="text-[30px] mr-1">
            {U.accounting(coupon.discountPrice) + "원"}
          </span>
          <span className="text-[18px]">할인</span>
        </p>
        <p className="font-bold text-inactive">
          <span className="mr-3">{coupon.couponName}</span>
          <span>{"(" + coupon.storeName + ")"}</span>
        </p>
        <p className="text-inactive">
          <span className="mr-5">
            {U.accounting(coupon.minOrderAmount) + "원 주문시 할인"}
          </span>
          <span>
            {U.showDate(coupon.validFrom) +
              " ~ " +
              U.showDate(coupon.validUntil)}{" "}
          </span>
        </p>
      </div>
      {children}
    </button>
  );
};
