import { FC, useEffect, useState } from "react";
import { PopupLayoutCust } from "./";
import { PurchaseApi } from "../../service";
import { Purchase } from "../../type";
import { PopupStatus } from "./usePopup";
import { MenuListDisplay } from "../menus";
import { PopupButton } from "./PopupButton";
import { useForm } from "react-hook-form";
import * as CT from "../../constants";
import * as U from "../../utils";

interface PurchaseDetailCustPopupProps {
  setPopupActive: (popupStatus: PopupStatus) => void;
  selectPurchasePackId: string;
}

export const PurchaseDetailCustPopup: FC<PurchaseDetailCustPopupProps> = ({
  setPopupActive,
  selectPurchasePackId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { useGetAllPurchaseCustList } = PurchaseApi();
  const { allPurchaseCustData, refetchAllGetPurchaseCust } =
    useGetAllPurchaseCustList(selectPurchasePackId);

  const [selectPurchase, setSelectPurchase] = useState<Purchase[]>([]);

  const canclePurchView = () => {
    setPopupActive({ active: false, popupId: "" });
  };

  useEffect(() => {
    if (allPurchaseCustData && Array.isArray(allPurchaseCustData)) {
      setSelectPurchase(allPurchaseCustData);
    }
  }, [allPurchaseCustData]);

  //선택된 주문건이 변경될 시 주문 내역 재검색
  useEffect(() => {
    refetchAllGetPurchaseCust();
  }, [selectPurchasePackId]);

  return (
    <form
      onSubmit={handleSubmit(canclePurchView)}
      className="min-w-[320px] w-screen lg:w-full"
    >
      <PopupLayoutCust title="주문관리">
        <div className="p-[25px] pb-[75px] flex-grow overflow-y-scroll ">
          {selectPurchase.length > 0 && (
            <>
              <div className="flex flex-col justify-between pb-5 pl-5 pr-5 bg-white border-2 rounded-lg">
                <label className="inline-block w-full pt-3 pb-3 font-bold border-b-2">
                  주문자 정보
                </label>
                <ul className="pl-2 pr-2">
                  <li className="flex items-center pt-3 pb-3">
                    <label className="inline-block w-[30%] ">주문번호</label>
                    <span className="inline-block w-[70%] pl-2 pr-2 text-[16px]">
                      {selectPurchase[0].purchasePackageId}
                    </span>
                  </li>
                  <li className="flex items-center pt-3 pb-3 ">
                    <label className="inline-block w-[30%] ">주문자명</label>
                    <span className="inline-block w-[70%] pl-2 pr-2 text-[16px]">
                      {selectPurchase[0].name}
                    </span>
                  </li>
                  <li className="flex items-center pt-3 pb-3">
                    <label className="inline-block w-[30%] ">연락처</label>
                    <span className="inline-block w-[70%] pl-2 pr-2 text-[16px]">
                      {selectPurchase[0].tel}
                    </span>
                  </li>
                  <li className="flex items-center pt-3 pb-3">
                    <label className="inline-block w-[30%] ">주소</label>
                    <span className="flex flex-col w-[70%] pl-2 pr-2 text-[16px]">
                      <span>
                        {"(" +
                          selectPurchase[0].address.zonecode +
                          ") " +
                          selectPurchase[0].address.address}
                      </span>
                      <span>{selectPurchase[0].address.detailedAddress}</span>
                    </span>
                  </li>
                  <li className="flex items-center pt-3 pb-3">
                    <label className="inline-block w-[30%] ">결제수단</label>
                    <span className="inline-block w-[70%] pl-2 pr-2 text-[16px]">
                      <span>
                        {
                          CT.paymentMethod[
                            selectPurchase[0].paymentMethod as CT.PaymentMethod
                          ]
                        }
                      </span>
                      {selectPurchase[0].cardNumber !== undefined && (
                        <span>{" | " + selectPurchase[0].cardNumber}</span>
                      )}
                    </span>
                  </li>
                  <li className="flex items-center pt-3 pb-3">
                    <label className="inline-block w-[30%] ">결제일자</label>
                    <span className="inline-block w-[70%] pl-2 pr-2 text-[16px]">
                      {U.showDate(selectPurchase[0].date)}
                    </span>
                  </li>
                  <li className="flex items-center pt-3 pb-3">
                    <label className="inline-block w-[30%] ">요청사항</label>
                    <span className="inline-block w-[70%] pl-2 pr-2 text-[16px]">
                      {selectPurchase[0].deliRequest}
                    </span>
                  </li>
                  <li className="flex items-center pt-3 pb-3">
                    <label className="inline-block w-[30%] ">주문상태</label>
                    <span className="inline-block w-[70%] pl-2 pr-2 text-[16px]">
                      {CT.purchaseStatus[selectPurchase[0].purStatus]}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="pb-5 pl-5 pr-5 bg-white border-2 rounded-lg mt-7 ">
                <label className="inline-block w-full pt-3 pb-3 font-bold border-b-2">
                  주문내역
                </label>
                <div className="pl-2 pr-2">
                  <MenuListDisplay menuList={selectPurchase} />
                  <ul className="flex flex-col pt-3 border-t-2 leading-[40px]">
                    <li className="flex justify-between">
                      <label className="inline-block w-[30%] ">
                        총주문금액
                      </label>
                      <span className="inline-block w-[70%] pl-2 pr-2 text-[16px] font-bold">
                        {U.accounting(selectPurchase[0].totalPrice) + "원"}
                      </span>
                    </li>
                    {selectPurchase[0].couponDiscountPrice > 0 && (
                      <li className="flex justify-between">
                        <label className="inline-block w-[30%] ">
                          쿠폰할인액
                        </label>
                        <span className="inline-block w-[70%] pl-2 pr-2 text-[16px] font-bold">
                          {U.accounting(selectPurchase[0].couponDiscountPrice) +
                            "원"}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
        <PopupButton handleCancel={canclePurchView} cancelText="확인" />
      </PopupLayoutCust>
    </form>
  );
};
