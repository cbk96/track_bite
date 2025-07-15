import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { PopupLayoutAdmin } from "./PopupLayoutAdmin";
import { useAdminContext } from "../../context";
import { PurchaseApi } from "../../service";
import { Purchase } from "../../type";
import { PopupStatus } from "./usePopup";
import { MenuListDisplay } from "../menus";
import { PopupButton } from "./PopupButton";
import { useForm } from "react-hook-form";
import * as CT from "../../constants";
import * as U from "../../utils";

interface PurchaseDetailPopupProps {
  setPopupActive: (popupStatus: PopupStatus) => void;
  selectPurchase: Purchase[];
  searchByCondition: () => void;
}

export const PurchaseDetailPopup: FC<PurchaseDetailPopupProps> = ({
  setPopupActive,
  selectPurchase,
  searchByCondition,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { loginState } = useAdminContext();
  const { useUpdatePurchase } = PurchaseApi();
  const { updatePurchaseMutate } = useUpdatePurchase(searchByCondition);

  const [selectedPurStatus, setSelectedPurStatus] =
    useState<CT.PurchaseStatus>("Order_Placed");
  const [purchaseStep, setPurchseStep] = useState<number>(-1);

  useEffect(() => {
    if (!selectPurchase[0]) return;
    setSelectedPurStatus(selectPurchase[0].purStatus);

    const purStep = CT.purchaseStatusKeys.indexOf(selectPurchase[0].purStatus);
    setPurchseStep(purStep);
  }, [selectPurchase]);

  const selectPurStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPurStatus(e.target.value as CT.PurchaseStatus);
  };

  //선택한 주문 상태를 서버에 전송
  const changePurStatus = useCallback(() => {
    updatePurchaseMutate({
      storePublicId: loginState.storePublicId,
      purchasePackageId: selectPurchase[0].purchasePackageId,
      purStatus: selectedPurStatus,
    });
    setPopupActive({ active: false, popupId: "" });
  }, [selectedPurStatus]);

  const canclePurchView = () => {
    setPopupActive({ active: false, popupId: "" });
  };

  return (
    <form
      onSubmit={handleSubmit(changePurStatus)}
      className="min-w-[320px] w-screen lg:w-full"
    >
      <PopupLayoutAdmin title="주문관리">
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
                      <select
                        name={"purStatus"}
                        value={selectedPurStatus}
                        onChange={selectPurStatus}
                        className="bg-white"
                      >
                        {CT.purchaseStatusKeys.map(
                          (key, index) =>
                            index >= purchaseStep && (
                              <option key={key} value={key}>
                                {CT.purchaseStatus[key]}
                              </option>
                            )
                        )}
                      </select>
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
                    <li className="flex justify-between">
                      <label className="inline-block w-[30%] ">
                        배달수수료
                      </label>
                      <span className="inline-block w-[70%] pl-2 pr-2 text-[16px] font-bold">
                        {U.accounting(selectPurchase[0].deliveryFee ?? 0) +
                          "원"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <label className="inline-block w-[30%] ">
                        주문중개수수료
                      </label>
                      <span className="inline-block w-[70%] pl-2 pr-2 text-[16px] font-bold">
                        {U.accounting(
                          selectPurchase[0].totalPrice *
                            selectPurchase[0].businessFee
                        ) + "원"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <label className="inline-block w-[30%] ">
                        입금 예정금액
                      </label>
                      <span className="inline-block w-[70%] pl-2 pr-2 text-[16px] font-bold">
                        {U.accounting(
                          (selectPurchase[0].totalPrice +
                            selectPurchase[0].deliveryFee) *
                            (1 - selectPurchase[0].businessFee) -
                            selectPurchase[0].couponDiscountPrice
                        ) + "원"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
        <PopupButton
          type="admin"
          confirmText="주문상태변경"
          handleCancel={canclePurchView}
          cancelText="취소"
        />
      </PopupLayoutAdmin>
    </form>
  );
};
