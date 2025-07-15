import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { PopupLayoutAdmin } from "./PopupLayoutAdmin";
import { useAdminContext } from "../../context";
import { CouponApi } from "../../service";
import { CustomRadio } from "../choiceInput";
import { LoadingSpinner } from "../../components/loading";
import { format } from "date-fns";
import { PopupButton } from "./PopupButton";
import { useForm } from "react-hook-form";
import { DateRangeInput, useDateRange } from "../../components/dateRange";
import * as T from "../../type";
import * as U from "../../utils";
import type { Coupon } from "../../type";
import type { PopupStatus } from "./usePopup";

interface CouponInsertPopupProps {
  popupActive: PopupStatus;
  setPopupActive: React.Dispatch<React.SetStateAction<PopupStatus>>;
  type?: "write" | "update";
  selectedCoupon?: Coupon | undefined;
  callback?: () => void;
}

export const CouponInsertPopup: FC<CouponInsertPopupProps> = ({
  popupActive,
  setPopupActive,
  type = "write",
  selectedCoupon,
  callback,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: T.initialCoupon,
  });
  const { useAddCoupon, useUpdateCoupon, useDeleteCoupon } = CouponApi();
  const { addCouponMutate, isCouponAddPending } = useAddCoupon(callback);
  const { updateCouponMutate, isCouponUpdatePending } = useUpdateCoupon();
  const { deleteCouponMutate, isCouponDeletePending } = useDeleteCoupon();
  const { loginState, setAlertState } = useAdminContext();

  //사용자 입력값 외 쿠폰 기본 값 설정
  const inputInitialInfo = (storeId: string) => {
    const couponId = U.createId("COUPON", storeId);
    Object.entries(T.initialCoupon).forEach(([key, value]) => {
      setValue(key as any, value);
    });
    setValue("couponId", couponId);
    setValue("storeId", loginState.storeId);
    setValue("storeName", loginState.storeName);
    setValue("registDate", new Date());
    setValue("modifyDate", new Date());
  };

  const applyExistingInfo = () => {
    selectedCoupon &&
      Object.entries(selectedCoupon).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    setValue("modifyDate", new Date());
  };

  //전달된 쿠폰 정보가 있으면 해당 정보를, 없으면 기본값을 수정 데이터에 올린다.
  useEffect(() => {
    selectedCoupon ? applyExistingInfo() : inputInitialInfo(loginState.storeId);
  }, [popupActive, loginState, selectedCoupon, type]);

  //입력정보를 수정 데이터에 반영
  const inputCouponInfo =
    (key: Exclude<keyof Coupon, "validFrom" | "validUntil">) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      if (key === "discountPrice" && Number(value) <= 0) {
        return;
      }
      if (key === "minOrderAmount" && Number(value) < 0) {
        return;
      }
      const inputValue =
        value === "true" || value === "false" ? JSON.parse(value) : value;
      setValue(key, inputValue);
    };

  const inputCouponDateInfo =
    (key: keyof Pick<Coupon, "validFrom" | "validUntil">) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const today = new Date();
      const inputDate = e.target.value;

      if (
        key === "validFrom" &&
        (new Date(inputDate) > new Date(watch("validUntil")) ||
          new Date(inputDate) < today)
      ) {
        setAlertState(
          "시작일은 금일(" +
            U.showDate(today) +
            ") 이전 일자로 설정할 수 없으며 \n종료일 이후 일자로 설정할 수 없습니다."
        );
        return;
      }

      if (
        key === "validUntil" &&
        (new Date(inputDate) < new Date(watch("validUntil")) ||
          new Date(inputDate) < today)
      ) {
        setAlertState(
          "종료일은 금일(" +
            U.showDate(today) +
            ") 이전 일자로 설정할 수 없으며 \n시작일 이전 일자로 설정할 수 없습니다."
        );
        return;
      }

      setValue(key, new Date(inputDate));
    };

  //수정 데이터를 서버에 전송하여 쿠폰 등록
  const couponAddConfirm = useCallback(
    (data: Coupon) => {
      const hasEmpty = Object.values(data).some(
        (value) =>
          (typeof value === "string" && value.trim() === "") ||
          Number(value) < 0 ||
          value === null ||
          value === undefined
      );
      const isDiscountPriceZero = data.discountPrice <= 0;
      if (hasEmpty || isDiscountPriceZero) {
        setAlertState("입력되지 않은 값이 있습니다.");
        return;
      }
      type === "write"
        ? addCouponMutate({ storeId: loginState.storeId, coupon: data })
        : updateCouponMutate({ storeId: loginState.storeId, coupon: data });
      reset();
      setPopupActive({ active: false, popupId: "" });
    },
    [register, loginState, type]
  );

  //쿠폰 삭제
  const couponDelete = () => {
    if (type !== "update" || watch("couponId") === "") return;
    deleteCouponMutate({ couponId: watch("couponId") });
    reset();
    setPopupActive({ active: false, popupId: "" });
  };

  //쿠폰 등록 취소
  const cancelPopup = () => {
    reset();
    setPopupActive({ active: false, popupId: "" });
  };

  return (
    <form
      onSubmit={handleSubmit(couponAddConfirm)}
      className="min-w-[320px] w-screen lg:w-full"
    >
      <LoadingSpinner isLoading={isCouponAddPending || isCouponUpdatePending} />
      <PopupLayoutAdmin title={type === "write" ? "쿠폰등록" : "쿠폰관리"}>
        <div className="p-[25px] pb-[75px] flex-grow overflow-y-scroll ">
          <p
            className={`flex items-center pl-[10px] mt-[10px] bg-white rounded-lg border-2 ${
              type === "update" ? "text-inactive" : ""
            }`}
          >
            <label className="inline-block w-[30%] font-bold">쿠폰이름</label>
            {type === "write" ? (
              <span className="flex flex-col w-[70%]">
                <input
                  type="text"
                  {...register("couponName", {
                    required: "쿠폰 이름은 필수입니다.",
                    minLength: {
                      value: 2,
                      message: "최소 2글자 이상 입력해야 합니다.",
                    },
                    maxLength: {
                      value: 20,
                      message: "최대 20글자까지 입력가능 합니다.",
                    },
                  })}
                  placeholder="쿠폰이름"
                  className="inline-block p-1 pl-2 pr-2 h-[53px] text-[16px]"
                  maxLength={20}
                />
                {errors.couponName ? (
                  <span className="p-1 pl-2 pr-2 text-red-500">
                    {errors.couponName.message}
                  </span>
                ) : null}
              </span>
            ) : (
              <span className="inline-block leading-[53px] text-[16px] font-bold">
                {watch("couponName")}
              </span>
            )}
          </p>
          <p
            className={`flex items-center pl-[10px] mt-[10px] bg-white rounded-lg border-2 ${
              type === "update" ? "text-inactive" : ""
            }`}
          >
            <label className="inline-block w-[30%] font-bold">할인금액</label>
            {type === "write" ? (
              <span className="flex flex-col w-[70%]">
                <input
                  type="number"
                  {...register("discountPrice", {
                    valueAsNumber: true,
                    min: {
                      value: 100,
                      message: "할인금액은 최소 100원 이상 입력 가능합니다.",
                    },
                    max: {
                      value: 99999,
                      message:
                        "할인금액은 최대 999,999원 이상까지 입력 가능합니다.",
                    },
                  })}
                  className="inline-block p-1 pl-2 pr-2 h-[53px] text-[16px]"
                />
                {errors.discountPrice ? (
                  <span className="p-1 pl-2 pr-2 text-red-500">
                    {errors.discountPrice.message}
                  </span>
                ) : null}
              </span>
            ) : (
              <span className="inline-block leading-[53px] text-[16px] font-bold">
                {U.accounting(watch("discountPrice")) + "원"}
              </span>
            )}
          </p>
          <p
            className={`flex items-center pl-[10px] mt-[10px] bg-white rounded-lg border-2 ${
              type === "update" ? "text-inactive" : ""
            }`}
          >
            <label className="inline-block w-[30%] font-bold">
              조건주문금액
            </label>
            {type === "write" ? (
              <span className="flex flex-col w-[70%]">
                <input
                  type="number"
                  {...register("minOrderAmount", {
                    min: {
                      value: 0,
                      message: "조건주문금액은 최소 0원 이상 입력 가능합니다.",
                    },
                    max: {
                      value: 999999,
                      message:
                        "조건주문금액은 최대 999,999원 이상까지 입력 가능합니다.",
                    },
                  })}
                  className="inline-block p-1 pl-2 pr-2 h-[53px] text-[16px]"
                  maxLength={20}
                />
                {errors.minOrderAmount ? (
                  <span className="p-1 pl-2 pr-2 text-red-500">
                    {errors.minOrderAmount.message}
                  </span>
                ) : null}
              </span>
            ) : (
              <span className="inline-block leading-[53px] text-[16px] font-bold">
                {U.accounting(watch("minOrderAmount")) + "원"}
              </span>
            )}
          </p>
          <div className="flex items-center pl-[10px] mt-[10px] h-[53px] bg-white rounded-lg border-2 ">
            <label className="inline-block w-[30%] font-bold">
              사용 가능 여부
            </label>
            <div>
              <CustomRadio
                id={"useAbleTrue"}
                name="isUsable"
                value={true}
                selectedValue={watch("isUsable")}
                onChange={inputCouponInfo("isUsable")}
                className="mr-3"
                fieldName="사용가능"
              />
              <CustomRadio
                id={"useAbleFalse"}
                name="isUsable"
                value={false}
                selectedValue={watch("isUsable")}
                onChange={inputCouponInfo("isUsable")}
                fieldName="사용불가"
              />
            </div>
          </div>
          <div className="flex items-center pl-[10px] mt-[10px] h-[53px] bg-white rounded-lg border-2 ">
            <label className="inline-block w-[30%] font-bold">
              상점 노출 여부
            </label>
            <div>
              <CustomRadio
                id={"isVsibleTrue"}
                name="isVsible"
                value={true}
                selectedValue={watch("isVisible")}
                onChange={inputCouponInfo("isVisible")}
                className="mr-3"
                fieldName="노출"
              />
              <CustomRadio
                id={"isVsibleFalse"}
                name="isVsible"
                value={false}
                selectedValue={watch("isVisible")}
                onChange={inputCouponInfo("isVisible")}
                fieldName="숨김"
              />
            </div>
          </div>
          <div
            className={`flex items-center pl-[10px] mt-[10px] min-h-[53px] bg-white rounded-lg border-2 ${
              type === "update" ? "text-inactive" : ""
            }`}
          >
            <label className="inline-block w-[30%] font-bold">유효기간</label>
            <div className="flex flex-col">
              {type === "write" ? (
                <>
                  <p className="flex items-center">
                    <legend className="mr-2">시작일</legend>
                    <input
                      type="date"
                      name="validFrom"
                      value={format(watch("validFrom"), "yyyy-MM-dd")}
                      className="inline-block mr-4 p-1 pl-2 pr-2 text-[16px] bg-white"
                      onChange={inputCouponDateInfo("validFrom")}
                    />
                  </p>
                  <p className="flex items-center">
                    <legend className="mr-2">종료일</legend>
                    <input
                      type="date"
                      name="validUntil"
                      value={format(watch("validUntil"), "yyyy-MM-dd")}
                      className="inline-block p-1 pl-2 pr-2 text-[16px] bg-white"
                      onChange={inputCouponDateInfo("validUntil")}
                    />
                  </p>
                </>
              ) : (
                <>
                  <p className="flex items-center">
                    <legend className="mr-2">시작일</legend>
                    <span className="inline-block mr-4 leading-[53px] text-[16px] font-bold">
                      {U.showDate(watch("validFrom"))}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <legend className="mr-2">종료일</legend>
                    <span className="inline-block leading-[53px] text-[16px] font-bold">
                      {U.showDate(watch("validUntil"))}
                    </span>
                  </p>
                </>
              )}
            </div>
          </div>
          {type === "update" && (
            <div className="flex items-center pl-[10px] mt-[10px] min-h-[53px] text-inactive bg-white rounded-lg border-2">
              <p className="mr-3">
                <label className="mr-2 font-bold">등록일</label>
                <span className="inline-block mr-4 leading-[53px] text-[16px] font-bold">
                  {U.showDate(watch("registDate"))}
                </span>
              </p>
              <p>
                <label className="mr-2 font-bold">수정일</label>
                <span className="inline-block leading-[53px] text-[16px] font-bold">
                  {U.showDate(watch("modifyDate"))}
                </span>
              </p>
            </div>
          )}
          <div className="flex justify-end pl-[10px] mt-[10px] h-[53px]">
            {type === "update" && (
              <button
                type="button"
                onClick={couponDelete}
                className="p-3 bg-white border-2 rounded-md hover:bg-slate-400"
              >
                쿠폰삭제
              </button>
            )}
          </div>
        </div>
        <PopupButton
          type="admin"
          confirmText={type === "write" ? "쿠폰등록" : "쿠폰수정"}
          handleCancel={cancelPopup}
          cancelText="취소"
        />
      </PopupLayoutAdmin>
    </form>
  );
};
