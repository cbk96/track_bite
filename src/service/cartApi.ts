import { useEffect } from "react";
import {
  del,
  post,
  put,
  queryFnGet,
  queryFnPut,
  useFetchQuery,
} from "../server";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomerPublic, useAdminContext } from "../context";
import * as CT from "../constants";
import type { Cart } from "../type";

type Callback = () => void;

export const CartApi = () => {
  const { setAlertState: setCUSAlertState } = useCustomerPublic();
  const { setAlertState: setADAlertState } = useAdminContext();
  const queryClient = useQueryClient();

  //일반 사용자용
  const useGetCartList = (
    customerId: string,
    storePublicId: string,
    callback?: Callback
  ) => {
    const { data, isLoading, isError, error, status } = useFetchQuery(
      ["CartAddInfos"],
      () =>
        queryFnGet<{
          ok: boolean;
          resultMsg?: string;
          carts: Cart[];
        }>(`/purchase/getCartList?customerId=${customerId}`),
      !!customerId && !!storePublicId
    );

    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setCUSAlertState(
          err?.message || "장바구니 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    return {
      cartListData: data?.carts,
      isGetCartListLoading: isLoading,
      isGetCartListError: isError,
    };
  };

  const useAddNewCart = (callback?: Callback) => {
    const { mutate, isPending, isError, error } = useMutation<
      {
        ok: boolean;
        resultMsg?: string;
      },
      Error,
      { cart: Cart }
    >({
      mutationFn: (sendData: { cart: Cart }) => {
        return queryFnPut("/purchase/addCart", sendData);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["CartAddInfos"] });
        if (data.ok === false) {
          setCUSAlertState(data.resultMsg ?? "dsfsdfsdfs");
        }
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setCUSAlertState(
          err?.message || "장바구니에 등록하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      addNewCartMutate: mutate,
      isAddNewCartPending: isPending,
      isError,
    };
  };

  const useRemoveCartItem = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: { cartId: string }) =>
        del(
          `/purchase/removeCartItem?cartId=${sendData.cartId}`,
          CT.CUSTOMER_ACCESS_TOKEN
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["CartAddInfos"] });
        setADAlertState("장바구니에 추가했습니다.");
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setCUSAlertState(
          err?.message || "장바구니 정보를 저장하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      removeCartMutate: mutate,
      isRemoveCartPending: isPending,
      isRemoveCartError: isError,
    };
  };

  const useRemoveCartItems = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: { cartIds: string[]; customerId: string }) =>
        post("/purchase/removeCartItems", sendData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["CartAddInfos"] });
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setCUSAlertState(
          err?.message || "장바구니 정보를 저장하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      removeCartsMutate: mutate,
      isRemoveCartsPending: isPending,
      isRemoveCartsError: isError,
    };
  };

  const useEditCartItemQuanti = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: { cartId: string; quanti: number }) =>
        put("/purchase/editCartItemQuanti", sendData, CT.CUSTOMER_ACCESS_TOKEN),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["CartAddInfos"] });
        callback && callback();
      },
      onError: (err) => {
        error as Error;
        setCUSAlertState(
          err?.message || "장바구니 정보를 저장하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      addCartItemMutate: mutate,
      isAddCartItmePending: isPending,
      isAddCartItemError: isError,
    };
  };

  return {
    useAddNewCart,
    useGetCartList,
    useRemoveCartItem,
    useRemoveCartItems,
    useEditCartItemQuanti,
  };
};
