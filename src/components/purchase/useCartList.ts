import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { CartApi } from "../../service";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner, useLoading } from "../../components/loading";
import { useCustomerPublic } from "../../context";
import { Bag } from "phosphor-react";
import * as CT from "../../constants";
import type { LoginCustomer } from "../../type";
import type { AppState } from "../../store";
import type { Cart } from "../../type";

export const useCartList = (storePublicId: "ALL#STORE" | string) => {
  const { setAlertState } = useCustomerPublic();

  const navigate = useNavigate();
  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );

  const { useGetCartList, useRemoveCartItem, useEditCartItemQuanti } =
    CartApi();
  const { removeCartMutate } = useRemoveCartItem();
  const { addCartItemMutate } = useEditCartItemQuanti();
  const { cartListData, isGetCartListLoading } = useGetCartList(
    loginStatus.customerId,
    "ALL#STORE"
  );
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [filteredCarts, setFilteredCarts] = useState<Cart[]>([]);
  const [inOtherStoreMenu, setInOtherStoreMenu] = useState(false);

  useEffect(() => {
    if (!cartListData || !Array.isArray(cartListData)) return;

    if (storePublicId !== "ALL#STORE") {
      const filtCart = cartListData.filter(
        (cart) => cart.storePublicId === storePublicId
      );
      setFilteredCarts(filtCart);
      setInOtherStoreMenu(cartListData.length > 0 && filtCart.length <= 0);
    } else {
      setFilteredCarts(cartListData);
      setInOtherStoreMenu(false);
    }
  }, [cartListData, storePublicId]);

  //총 주문금액 계산
  useEffect(() => {
    let cumulPrice: number = 0;
    for (let i = 0; i < filteredCarts.length; i++) {
      cumulPrice +=
        Number(filteredCarts[i].menu.price) * filteredCarts[i].quanti;

      for (let j = 0; j < filteredCarts[i].option.length; j++) {
        for (let k = 0; k < filteredCarts[i].option[j].options.length; k++) {
          cumulPrice +=
            Number(filteredCarts[i].option[j].options[k].price) *
            filteredCarts[i].quanti;
        }
      }
    }
    setTotalPrice(cumulPrice);
  }, [filteredCarts]);

  //장바구니 메뉴 한개 삭제
  const removeCartOne = (cartId: string) => {
    cartId && cartId !== "" && removeCartMutate({ cartId });
  };

  //주문 수량 수정
  const editQuanti = (cartId: string, quanti: number) => {
    cartId &&
      cartId !== "" &&
      quanti > 0 &&
      quanti <= 99 &&
      addCartItemMutate({ cartId, quanti });
  };

  //주문 페이지로 이동
  const purchseConfirm = () => {
    if (filteredCarts.length <= 0) {
      setAlertState("장바구니에 등록된 메뉴가 없습니다.");
    } else {
      navigate("/store/purchaseSheet/" + filteredCarts[0].storePublicId);
    }
  };

  return {
    filteredCarts,
    totalPrice,
    isGetCartListLoading,
    inOtherStoreMenu,
    editQuanti,
    purchseConfirm,
    removeCartOne,
  };
};
