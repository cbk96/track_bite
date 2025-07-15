import {
  FC,
  PropsWithChildren,
  useState,
  useMemo,
  useCallback,
  useEffect,
  ChangeEvent,
} from "react";
import { PopupLayoutCust } from "./PopupLayoutCust";
import { useSelector } from "react-redux";
import { optionSort } from "../../utils";
import { OptionApi, CartApi } from "../../service";
import { ToggleBox } from "../../components/toggleBox";
import { initialCart } from "../../type";
import * as U from "../../utils";
import * as CT from "../../constants";
import { useCustomerPublic } from "../../context";
import { PopupButton } from "./PopupButton";
import { useForm } from "react-hook-form";
import type { MenuPublicInfo, SortedOptions, Cart } from "../../type";
import type { LoginCustomer } from "../../type";
import type { AppState } from "../../store";
import type { PopupStatus } from "./usePopup";
import { FallbackImg } from "../FallbackImg";

interface MenuInsertPopupProps {
  storePublicId: string;
  storeName: string;
  logoPath?: string;
  selectMenu: MenuPublicInfo;
  popupId: string;
  popupActive: PopupStatus;
  setPopupActive: (popupStatus: PopupStatus) => void;
}

export const MenuPurchasePopup: FC<PropsWithChildren<MenuInsertPopupProps>> = ({
  storePublicId,
  storeName,
  logoPath,
  selectMenu,
  popupId,
  popupActive,
  setPopupActive,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );
  const { useAddNewCart } = CartApi();
  const { addNewCartMutate } = useAddNewCart();
  const { useGetOptionGroupPublicInfo, useGetOptionPublicInfo } = OptionApi();
  const { optionGrPublicData } = useGetOptionGroupPublicInfo(storePublicId);
  const { optionPublicData } = useGetOptionPublicInfo(storePublicId);

  const [sortedOption, setSortedOption] = useState<SortedOptions[]>();
  const [addCart, setAddCart] = useState<Cart>(initialCart);

  useEffect(() => {
    const timestamp = new Date().getTime();
    const randomSuffix = Math.floor(Math.random() * 1000);
    const createCartId = `CART-${timestamp}-${randomSuffix}`;
    const { optionGroupId, ...editState } = selectMenu;
    const addCart: Cart = {
      cartId: createCartId,
      storeName: storeName,
      logoPath: logoPath,
      storePublicId: storePublicId,
      customerId: loginStatus.customerId,
      date: new Date(),
      quanti: 1,
      sumPrice: 0,
      menu: editState,
      option: [],
    };
    setAddCart(addCart);
  }, [
    selectMenu,
    storePublicId,
    storeName,
    logoPath,
    popupActive,
    loginStatus,
  ]);

  //출력용 : 메뉴에 포함된 옵션 그룹 아이디 기준으로 옵션 항목 리스트 생성
  useEffect(() => {
    if (
      optionGrPublicData !== undefined &&
      Array.isArray(optionGrPublicData) &&
      optionPublicData !== undefined &&
      Array.isArray(optionPublicData)
    ) {
      const sortedOptions = optionSort(optionGrPublicData, optionPublicData);
      const relationOptions = sortedOptions?.filter((options) =>
        selectMenu.optionGroupId.includes(options.optionGroupId)
      );
      setSortedOption(relationOptions);
    }
  }, [selectMenu, optionGrPublicData, optionPublicData]);

  //전송용 : 입력된 옵션 아이디를 통해 실제 옵션 값을 생성해 장바구니 전송 데이터에 저장
  const selectobleDataAppend = useCallback(
    (selectedOptionId: string[], optionGroupId: string) => {
      if (!sortedOption || sortedOption.length === 0) return;

      const filteredOption = sortedOption.find(
        (sortOption) => sortOption.optionGroupId === optionGroupId
      );

      if (!filteredOption) return;

      const appendOption = {
        ...filteredOption,
        options: filteredOption.options.filter((filteredOP) =>
          selectedOptionId.includes(filteredOP.optionId)
        ),
      };

      if (appendOption) {
        setAddCart((prevCart) => ({
          ...prevCart,
          option: [
            ...prevCart.option.filter(
              (prevOption) => prevOption.optionGroupId !== optionGroupId
            ),
            appendOption,
          ],
        }));
      }
    },
    [sortedOption, addCart]
  );

  const editQuanti = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target) return;
      const inputQuanti = e.target.value;
      const editQuanti =
        inputQuanti === ""
          ? 1
          : parseInt(inputQuanti) > 99
          ? 99
          : parseInt(inputQuanti) < 1
          ? 1
          : parseInt(inputQuanti);
      setAddCart((prevState) => ({ ...prevState, quanti: editQuanti }));
    },
    [addCart]
  );

  const addCartConfirm = useCallback(() => {
    let sumPrice = 0;
    const menuPrice = addCart.menu.price;
    let optionPrices = 0;
    for (let i = 0; i < addCart.option.length; i++) {
      for (let k = 0; k < addCart.option[i].options.length; k++) {
        optionPrices += Number(addCart.option[i].options[k].price);
      }
    }
    sumPrice = Number(menuPrice) + Number(optionPrices);
    const confirmCart = { ...addCart, sumPrice: sumPrice };

    addNewCartMutate({ cart: confirmCart });
    setPopupActive({ active: false, popupId: "" });
  }, [addCart]);

  const addCartCancel = () => {
    setPopupActive({ active: false, popupId: "" });
  };

  const addSelectOption = useMemo(() => {
    return (
      <>
        {selectMenu.optionGroupId.length > 0 && sortedOption
          ? sortedOption.map((optionGroups, index) => {
              return (
                optionGroups.options.length > 0 && (
                  <div key={index} className="pb-5 bg-white">
                    <div className="ml-5 mr-5 ">
                      <p className="flex leading-[52px]">
                        <span className="pl-[20px] mr-2 font-bold">
                          {optionGroups.groupName}
                        </span>
                        <span className="text-[13px]">
                          {"("}
                          {optionGroups.required ? "필수 " : "부가 "} /
                          {optionGroups.selectionType === "single"
                            ? " 단일"
                            : " 복수"}
                          {") 선택"}
                        </span>
                      </p>
                      <div className="pt-5 pb-5 pl-10 pr-10 bg-[#f2f2f2] rounded-md">
                        <ToggleBox
                          name={optionGroups.groupName}
                          onChange={selectobleDataAppend}
                          values={optionGroups.options}
                          required={optionGroups.required}
                          selectionType={optionGroups.selectionType}
                        />
                      </div>
                    </div>
                  </div>
                )
              );
            })
          : null}
      </>
    );
  }, [sortedOption, selectMenu]);

  return (
    <form
      onSubmit={handleSubmit(addCartConfirm)}
      className="min-w-[320px] w-screen lg:w-full"
    >
      <PopupLayoutCust title="메뉴 주문">
        <div className=" lg:p-[25px] lg:pb-[75px] flex-grow overflow-y-scroll ">
          <div className="flex items-center justify-center mb-3 bg-white">
            <FallbackImg
              alt="메뉴 이미지"
              fallback="defaultMenu.jpg"
              src={selectMenu.imagePath}
              className="h-[300px]"
            />
          </div>
          <div className="mb-3 p-[28px] text-center bg-white">
            <p className="text-[18px] font-bold">{selectMenu.menuName}</p>
            <p className="text-[16px]">{selectMenu.menuDescrip}</p>
          </div>
          <div className="mb-3 flex justify-between p-[16px] pl-[40px] pr-[40px] bg-white text-[18px]">
            <label className="inline-block font-bold">가격</label>
            <p className="inline-block ">{U.accounting(selectMenu.price)}원</p>
          </div>
          <div className="mb-3 flex justify-between items-center p-[16px] pl-[40px] pr-[40px] bg-white text-[18px]">
            <label className="font-bold ">수량</label>
            <span>
              <input
                type="number"
                value={addCart.quanti}
                onChange={editQuanti}
                minLength={1}
                maxLength={99}
                className="inline-block w-[70px] mr-5 p-1 text-right border-2 rounded-md"
              />
              개
            </span>
          </div>
          <div className="relative">{addSelectOption}</div>
        </div>
        <PopupButton
          confirmText="장바구니 추가"
          handleCancel={addCartCancel}
          cancelText="취소"
        />
      </PopupLayoutCust>
    </form>
  );
};
