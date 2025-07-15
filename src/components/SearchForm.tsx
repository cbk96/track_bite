import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useCustomerPublic } from "../context";
import {
  AddressInsertPopup,
  CartListPopup,
  PopupBackGround,
  PopupContainer,
  usePopup,
} from "./popup";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../store";
import { LoginCustomer } from "../type";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as MagnifierIcon } from "../svg/magnifier.svg";
import { ReactComponent as BikeIcon } from "../svg/bike.svg";
import { ReactComponent as CartIcon } from "../svg/cart.svg";
import * as CS from "../store/customer";
import * as T from "../type";
import * as U from "../utils";
import { FC } from "react";
import { Triangle } from "phosphor-react";

interface props {
  className?: string;
}

export const SearchForm: FC<props> = ({ className }) => {
  const ADDRESS_INSERT_POUP_ID = "addressInsertPop";
  const CART_LIST_POPUP_ID = "cartListDetail";
  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const { popupActive, setPopupActive } = usePopup();
  const [activeSearchMode, setActiveSearchMode] = useState<
    "address" | "search"
  >("address");
  const navigate = useNavigate();

  const activeSetAddress = () => {
    setPopupActive({ active: true, popupId: ADDRESS_INSERT_POUP_ID });
  };

  const onSetAddress = useCallback(
    (data: Omit<T.Address, "detailedAddress">) => {
      const guestAccount = U.createGuestAccountAndAddress(loginStatus, data);
      dispatch(CS.loginCustomer(guestAccount));

      setPopupActive({ popupId: "", active: false });
    },
    [loginStatus]
  );

  const { searchCategory } = useCustomerPublic();
  const [searchText, setSearchText] = useState<string>("");
  const onChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const path = `/store?storeName=${searchText}&category=${searchCategory}`;
    navigate(path);
  };

  useEffect(() => {
    setPopupActive({ active: false, popupId: "" });
  }, [location.pathname]);

  return (
    <>
      <PopupBackGround
        popupActive={popupActive}
        setPopupActive={setPopupActive}
      >
        <PopupContainer
          popupActive={popupActive}
          popupId={ADDRESS_INSERT_POUP_ID}
        >
          <AddressInsertPopup
            popupActive={popupActive}
            setPopupActive={setPopupActive}
            onComplete={onSetAddress}
          />
        </PopupContainer>
        <PopupContainer popupId={CART_LIST_POPUP_ID} popupActive={popupActive}>
          <CartListPopup setPopupActive={setPopupActive} />
        </PopupContainer>
      </PopupBackGround>
      <div className={className}>
        <section className="relative flex flex-col items-center justify-start lg:hidden ">
          <div className="relative flex justify-start w-[90%] lg:mr-5 rounded-full border-[#fff]">
            <div className="flex items-center w-[calc(100%-20px)] justify-start">
              <Triangle
                color="#fff"
                size={10}
                weight="fill"
                className="rotate-180"
              />
              <button
                type="button"
                onClick={activeSetAddress}
                className={`pl-2 pr-2 w-[80%] overflow-hidden text-left text-[#fff] font-bold text-ellipsis text-nowrap leading-[45px] duration-200`}
              >
                {loginStatus.address !== undefined &&
                loginStatus.address.zonecode !== "" &&
                loginStatus.address.zonecode !== undefined &&
                loginStatus.address.address !== "" &&
                loginStatus.address.address !== undefined
                  ? `(${loginStatus.address.zonecode}) ${loginStatus.address.address}`
                  : "집 주변 맛집 찾기"}
              </button>
            </div>
            <button
              type="button"
              onClick={() =>
                setPopupActive({ active: true, popupId: CART_LIST_POPUP_ID })
              }
              className="flex justify-end w-[20px]"
            >
              <CartIcon className="w-[20px] text-white" color="#ffffff" />
            </button>
          </div>

          <form
            onSubmit={onSubmit}
            className="flex w-[90%] h-[45px] duration-200 "
          >
            <div
              className={`p-2 w-full flex justify-between items-center lg:mr-1 overflow-hidden bg-white border-2 rounded-full border-main-cust`}
            >
              <input
                type="text"
                name="storeName"
                value={searchText}
                placeholder="가게 이름"
                onChange={onChangeText}
                className="w-full h-full pl-3 duration-200 focus:outline-none"
              />
              <input type="hidden" name="category" value={searchCategory} />
              <button className="flex justify-center w-[45px] leading-[41px]">
                <MagnifierIcon className="w-[25px]" color="#ccc" />
              </button>
            </div>
          </form>
        </section>

        <section className="hidden lg:flex h-[45px]  justify-center ">
          <div className="flex mr-5 rounded-full border-[#fff]">
            <button
              type="button"
              onClick={() => setActiveSearchMode("address")}
              className="flex items-center w-[45px] justify-center text-white"
            >
              <BikeIcon
                className="w-[30px] text-white"
                color="#fff"
                style={{ color: "#fff" }}
              />
            </button>
            <button
              type="button"
              onClick={activeSetAddress}
              className={`${
                activeSearchMode === "address"
                  ? "pl-2 pr-5 w-[200px]"
                  : "pl-0 pr-0 w-0"
              } overflow-hidden text-[#fff] font-bold text-ellipsis text-nowrap leading-[45px] duration-200`}
            >
              {loginStatus.address !== undefined &&
              loginStatus.address.zonecode !== "" &&
              loginStatus.address.zonecode !== undefined &&
              loginStatus.address.address !== "" &&
              loginStatus.address.address !== undefined
                ? `(${loginStatus.address.zonecode}) ${loginStatus.address.address}`
                : "집 주변 맛집 찾기"}
            </button>
          </div>

          <form onSubmit={onSubmit} className="flex h-[45px] duration-200 ">
            <div
              className={`${
                activeSearchMode === "search" ? "p-2 w-[200px]" : "p-2 w-[45px]"
              } flex justify-between items-center mr-1 overflow-hidden  bg-white border-2 rounded-full border-main-cust`}
            >
              {activeSearchMode === "search" ? (
                <>
                  <input
                    type="text"
                    name="storeName"
                    value={searchText}
                    placeholder="가게 이름"
                    onChange={onChangeText}
                    className="pl-3 w-[110px] h-full duration-200 focus:outline-none"
                  />
                  <input type="hidden" name="category" value={searchCategory} />
                  <button className="flex justify-center w-[45px] leading-[41px]">
                    <MagnifierIcon className="w-[25px]" color="#ccc" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveSearchMode("search")}
                  className="flex items-center w-[45px] justify-center "
                >
                  <MagnifierIcon className="w-[25px]" color="#ccc" />
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </>
  );
};
