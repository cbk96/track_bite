import { ChangeEvent, FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingSpinner } from "../../components/loading";
import { Bag } from "phosphor-react";
import { useCartList } from "./useCartList";
import * as CT from "../../constants";
import type { LoginCustomer } from "../../type";
import type { AppState } from "../../store";
import { PopupButton } from "../popup";
import { StoreApi } from "../../service";
import { isStoreOpen } from "../../utils";
import * as T from "../../type";

interface CartListViewProps {
  storePublicId: "ALL#STORE" | string; //서버에서 장바구니 정보는 전부 불러오되 storePublicId로 마운트시 출력값 필터링
  displayMode: "panel" | "popup";
  displayCancel?: () => void;
  className?: string;
}

export const CartListView: FC<CartListViewProps> = ({
  storePublicId,
  displayMode,
  displayCancel = () => {},
  className = "",
}) => {
  const [storeInfo, setStoreInfo] = useState<T.StorePublicInfo>(
    T.initialStorePublic
  );
  const [chkTime, setChkTime] = useState(false);
  const [chkLocaiton, setChkLocation] = useState(false);
  const [chkCartLength, setChkCartLength] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [operatingHours, setOperatingHours] = useState<T.OperatingHours[]>(
    T.initialOperatingHours
  );

  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );

  const {
    filteredCarts,
    totalPrice,
    isGetCartListLoading,
    inOtherStoreMenu,
    editQuanti,
    removeCartOne,
  } = useCartList(storePublicId);

  const { useGetStorePublicInfo } = StoreApi();
  const { storeInfoData, refetchGetStorePBInfo } = useGetStorePublicInfo(
    filteredCarts.length > 0 ? filteredCarts[0].storePublicId : "",
    () => {}
  );

  useEffect(() => {
    refetchGetStorePBInfo();
  }, [filteredCarts]);

  const { useGetOperatingHours } = StoreApi();
  useGetOperatingHours(storeInfo.storePublicId ?? "", setOperatingHours);

  useEffect(() => {
    if (storeInfoData !== undefined) {
      setStoreInfo(storeInfoData);
    }
  }, [storeInfoData]);

  useEffect(() => {
    const { isStoreOpenByLocation, isStoreOpenByTime } = isStoreOpen();
    const locationChk = isStoreOpenByLocation(
      storeInfo.address.sigunguCode,
      loginStatus.address.sigunguCode
    );
    const lengthChk = filteredCarts && filteredCarts.length > 0;
    const timeChk = isStoreOpenByTime(operatingHours);
    const chkMessage = !lengthChk
      ? "장바구니에 담긴 메뉴가 없습니다."
      : !locationChk
      ? "배달 가능한 주소가 아닙니다."
      : !timeChk
      ? "영업시간이 아닙니다."
      : "주문하기";

    setChkCartLength(lengthChk);
    setButtonText(chkMessage);
    setChkLocation(locationChk);
    setChkTime(timeChk);
  }, [storeInfo, operatingHours, filteredCarts, loginStatus]);

  return (
    <div className={`relative ${className}`}>
      <p className="flex items-center pl-5 h-[60px] border-b-2">
        {filteredCarts && filteredCarts.length > 0 && (
          <>
            <span className="mr-3 w-[40px] rounded-lg overflow-hidden shadow-[0_5px_8px_rgba(0,0,0,0.1)]">
              <img src={filteredCarts[0].logoPath} />
            </span>
            <span className="font-bold">{filteredCarts[0].storeName}</span>
          </>
        )}
      </p>
      <div
        className="flex-grow pl-2 pr-2 overflow-y-scroll "
        style={{ height: "calc(100% - 60px - 55px - 50px)" }}
      >
        <ul>
          {chkCartLength ? (
            filteredCarts.map((cart, index) => {
              return (
                <li key={cart.cartId + index} className="pb-5 border-b-2">
                  <p className="p-5 text-[18px] font-bold">
                    {cart.menu.menuName}
                  </p>
                  <div className="flex items-center justify-between pl-5 pr-5 text-[16px]">
                    <p className="flex items-center">
                      <button
                        type="button"
                        onClick={() => removeCartOne(cart.cartId)}
                        className="flex items-center justify-center w-[24px] h-[24px] text-center leading-[8px] text-[16px]  font-bold border-2 text-[#666666] border-[#666666] rounded-sm "
                      >
                        x
                      </button>
                      <span className="pl-3 text-[16px]">
                        {(cart.menu.price * cart.quanti).toLocaleString()}원
                      </span>
                    </p>
                    <p className="flex items-center">
                      <button
                        type="button"
                        onClick={() => editQuanti(cart.cartId, cart.quanti - 1)}
                        className="flex items-center justify-center w-[24px] h-[24px] font-bold border-2 text-sub-cust border-sub-cust rounded-sm "
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={cart.quanti}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          editQuanti(cart.cartId, parseInt(e.target.value))
                        }
                        className="inline-block ml-2 mr-2 pl-3 w-[50px] h-[24px] border-2 rounded-sm"
                      />
                      <button
                        type="button"
                        onClick={() => editQuanti(cart.cartId, cart.quanti + 1)}
                        className="flex items-center justify-center w-[24px] h-[24px] font-bold border-2 text-main-cust border-main-cust rounded-sm "
                      >
                        +
                      </button>
                    </p>
                  </div>
                  <div className="pt-3">
                    {cart.option.length > 0 &&
                      cart.option.map((optionGroup, index) => {
                        return (
                          optionGroup.options.length > 0 && (
                            <div
                              key={optionGroup.optionGroupId + index}
                              className="pl-6 pr-6"
                            >
                              {optionGroup.options.length > 0 &&
                                optionGroup.options.map((option, index) => {
                                  return (
                                    <div
                                      key={option.optionId + index}
                                      className="flex justify-between pt-2"
                                    >
                                      <span className="pr-5">
                                        └ {option.optionName}
                                      </span>
                                      <span>
                                        {(
                                          option.price * cart.quanti
                                        ).toLocaleString()}
                                        원
                                      </span>
                                    </div>
                                  );
                                })}
                            </div>
                          )
                        );
                      })}
                  </div>
                </li>
              );
            })
          ) : (
            <li className="p-10 pt-16 pb-16 text-[14px] text-center">
              <Bag size={150} color="#ccc" className="mx-auto" />
              <span className="text-[#aaa] font-bold">
                {inOtherStoreMenu
                  ? "다른 스토어의 메뉴가 장바구니에 있습니다."
                  : "장바구니에 담긴 메뉴가 없습니다."}
              </span>
            </li>
          )}
        </ul>
      </div>
      <div className="flex-col w-full bg-white border-t-2">
        <p className="pl-6 pr-6 h-[55px] leading-[55px] text-[20px] text-main-cust font-bold text-right">
          합계 : {totalPrice.toLocaleString()}원
        </p>
      </div>
      {displayMode === "panel" ? (
        <PopupButton
          confirmText={buttonText}
          confirmDisablde={!(chkCartLength && chkLocaiton && chkTime)}
        />
      ) : (
        <PopupButton
          cancelText="취소"
          handleCancel={displayCancel}
          confirmDisablde={!(chkCartLength && chkLocaiton && chkTime)}
          confirmText={buttonText}
        />
      )}

      <LoadingSpinner isLoading={isGetCartListLoading} />
    </div>
  );
};

export default CartListView;
