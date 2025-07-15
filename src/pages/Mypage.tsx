import { CustomerMain } from "./CustomerMain";
import { Link, useNavigate } from "react-router-dom";
import {
  RoundedPublicBox,
  MypageSummaryBox,
  PurchaseCustomerList,
} from "../components";
import { Key, User } from "phosphor-react";
import { useState } from "react";
import {
  CartListPopup,
  PopupBackGround,
  PopupContainer,
  PurchaseDetailCustPopup,
  usePopup,
} from "../components/popup";
import { ReactComponent as UnUsedCouponIcon } from "../svg/coupon_unused.svg";
import { AuthApi } from "../service";
import { useSelector } from "react-redux";
import { AppState } from "../store";
import { useCustomerPublic } from "../context";
import { LoginCustomer } from "../type";
import * as CT from "../constants";

export function Mypage() {
  const CART_LIST_POPUP_ID = "cartListDetail";
  const purchasePopupId = "purchaseCustDetail";

  const { setAlertState } = useCustomerPublic();
  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );
  const { popupActive, setPopupActive } = usePopup();
  const navigate = useNavigate();
  const [selectPurchaseId, setSelectPurchaseId] = useState<string>("");

  const { useCustomerLogout } = AuthApi();
  const { mutateLogout } = useCustomerLogout();

  const logout = () => {
    // eslint-disable-next-line no-restricted-globals
    const logoutConfirm = confirm("로그아웃 하시겠습니까?");
    if (logoutConfirm && loginStatus.logined === "login") {
      mutateLogout();
      navigate("/");
    }
  };

  //장바구니 팝업 출력
  const activeCartListPopup = () => {
    setPopupActive({ popupId: CART_LIST_POPUP_ID, active: true });
  };

  return (
    <>
      <PopupBackGround
        popupActive={popupActive}
        setPopupActive={setPopupActive}
      >
        <PopupContainer popupId={CART_LIST_POPUP_ID} popupActive={popupActive}>
          <CartListPopup setPopupActive={setPopupActive} />
        </PopupContainer>
        <PopupContainer popupId={purchasePopupId} popupActive={popupActive}>
          <PurchaseDetailCustPopup
            setPopupActive={setPopupActive}
            selectPurchasePackId={selectPurchaseId}
          />
        </PopupContainer>
      </PopupBackGround>
      <MypageSummaryBox activeCartListPopup={activeCartListPopup} />
      <CustomerMain>
        <RoundedPublicBox className="mt-6 mb-6 px-[20px] lg:px-[40px] bg-white ">
          <ul className="text-[14px] lg:text-[18px] font-bold">
            <li className="border-b lg:border-b-2">
              <Link
                to="/mycoupons"
                className="flex items-center h-[56px] lg:h-[80px] hover:text-main-cust-hover active:translate-y-1 duration-150"
              >
                <UnUsedCouponIcon className="block mr-3 h-[15px]" />
                <span>쿠폰 조회</span>
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center h-[56px] lg:h-[80px]  hover:text-main-cust-hover active:translate-y-1 duration-150"
              >
                <Key size={25} className="block mr-3 h-[20px] " />
                <span>로그아웃</span>
              </button>
            </li>
          </ul>
        </RoundedPublicBox>
        <RoundedPublicBox className="pb-10 mb-6 pl-[20px] pr-[20px] bg-white ">
          <PurchaseCustomerList
            popupId={purchasePopupId}
            setPopupActive={setPopupActive}
            setSelectPurchaseId={setSelectPurchaseId}
          />
        </RoundedPublicBox>
      </CustomerMain>
    </>
  );
}

export default Mypage;
