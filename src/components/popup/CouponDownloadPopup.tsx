import { FC, PropsWithChildren, useState, useEffect } from "react";
import { PopupLayoutCust } from "./PopupLayoutCust";
import { useCustomerPublic } from "../../context";
import { useSelector } from "react-redux";
import { CouponApi } from "../../service";
import { PopupButton } from "./PopupButton";
import { useForm } from "react-hook-form";
import { CouponItem } from "../CouponItem";
import type { LoginCustomer } from "../../type";
import type { AppState } from "../../store";
import type { PopupStatus } from "./usePopup";
import type { Coupon, CouponIssue } from "../../type";
import { ArrowDown } from "phosphor-react";
import * as U from "../../utils";

interface CouponDownloadPopupProps {
  storePublicId: string;
  coupons: Coupon[];
  popupActive: PopupStatus;
  setPopupActive: (popupStatus: PopupStatus) => void;
}

export const CouponDownloadPopup: FC<
  PropsWithChildren<CouponDownloadPopupProps>
> = ({ storePublicId, coupons, popupActive, setPopupActive }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );
  const { setAlertState } = useCustomerPublic();
  const { useGetCouponIssues, useDownloadCouponIssues } = CouponApi();
  const { couponIssueGetData } = useGetCouponIssues(
    storePublicId,
    loginStatus.customerId,
    loginStatus.logined === "login"
  );
  const { downloadCouponIssuesMutate } = useDownloadCouponIssues();

  const [couponIssueIds, setCouponIssueIds] = useState<String[]>([]);

  useEffect(() => {
    if (
      couponIssueGetData &&
      Array.isArray(couponIssueGetData) &&
      couponIssueGetData.length > 0
    ) {
      const couponIssueIdArr = couponIssueGetData.map(
        (item: CouponIssue) => item.couponId
      );
      setCouponIssueIds(couponIssueIdArr);
    }
  }, [couponIssueGetData]);

  const downLoadCoupon = (selectCoupon: Coupon) => {
    setAlertState("선택한 쿠폰을 다운로드 합니다.");
    const createCouponIssueId = U.createId("COUPONISS", storePublicId);
    const downLoadCoupon: CouponIssue = {
      couponIssueId: createCouponIssueId,
      customerId: loginStatus.customerId,
      storePublicId,
      couponId: selectCoupon.couponId,
      couponName: selectCoupon.couponName,
      discountPrice: selectCoupon.discountPrice,
      minOrderAmount: selectCoupon.minOrderAmount,
      storeName: selectCoupon.storeName,
      used: false,
      validFrom: selectCoupon.validFrom,
      validUntil: selectCoupon.validUntil,
    };
    downloadCouponIssuesMutate(downLoadCoupon);
  };

  const cancelDowndload = () => {
    setPopupActive({ active: false, popupId: "" });
  };

  return (
    <form
      onSubmit={handleSubmit(cancelDowndload)}
      className="min-w-[320px] w-screen lg:w-full"
    >
      <PopupLayoutCust title="쿠폰 다운로드">
        <div className="p-[25px] pb-[75px] flex-grow overflow-y-scroll ">
          <ul className="flex flex-col items-center pt-2">
            {coupons &&
              coupons.map((coupon) => (
                <li key={coupon.couponId} className="w-full">
                  <CouponItem
                    coupon={coupon}
                    couponClick={() => downLoadCoupon(coupon)}
                    disabled={couponIssueIds.includes(coupon.couponId)}
                    type="download"
                    className={
                      couponIssueIds.includes(coupon.couponId)
                        ? "opacity-50 "
                        : "hover:bg-orange-shade active:translate-y-1"
                    }
                  >
                    <div>
                      <span className="inline-block p-1 rounded-full bg-orange ">
                        <ArrowDown weight="bold" color="#ffffff" size={30} />
                      </span>
                    </div>
                  </CouponItem>
                </li>
              ))}
          </ul>
        </div>
        <PopupButton handleCancel={cancelDowndload} cancelText="취소" />
      </PopupLayoutCust>
    </form>
  );
};
