import { useState, useCallback, useEffect } from "react";
import { get, put, queryFnGet } from "../server";
import { post, useFetchQuery } from "../server";
import { useCustomerPublic, useAdminContext } from "../context";
import {
  useQueryClient,
  useQuery,
  useMutation,
  useInfiniteQuery,
} from "@tanstack/react-query";
import type {
  Purchase,
  SearchingPurchList,
  SearchingPurchaseCust,
  Review,
} from "../type";
import * as IT from "../type";
import * as CT from "../constants";

type Callback = () => void;

type SearchPurchaseFilter = {
  customerId: string;
  limitItemNum: number;
  startRangeDate: Date;
  endRangeDate: Date;
  startItemNum: number;
};

type SearchPurchase = {
  SearchingResult: Purchase[];
  SearchingMenus: IT.CompactPurchase[];
  reviews: Review[];
};

type PurchaseSearchKey = {
  storePublicId: string;
  paymentSelect: string[];
  purStatusSelect: string[];
  selectedPageNum: number;
  limitItemNum: number;
  startRangeDate: Date;
  endRangeDate: Date;
};

export const PurchaseApi = () => {
  const { setAlertState: setADAlertState } = useAdminContext();
  const { setAlertState: setCUSAlertState } = useCustomerPublic();
  const queryClient = useQueryClient();

  const fetchPurchaseList = async ({
    pageParam = 0,
    queryKey,
  }: {
    pageParam?: number;
    queryKey: any[];
  }): Promise<SearchPurchase> => {
    const [, searchFilter] = queryKey as [string, SearchPurchaseFilter];
    const { customerId, endRangeDate, limitItemNum, startRangeDate } =
      searchFilter;
    const res = await get(
      `/purchase/getPurchaseList?customerId=${customerId}&endRangeDate=${endRangeDate}&startRangeDate=${startRangeDate}&skip=${pageParam}&limit=${limitItemNum}`,
      CT.CUSTOMER_ACCESS_TOKEN
    );
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.error || "서버 통신 중 문제가 발생했습니다.");
    }
    return json as Promise<SearchPurchase>;
  };

  //일반 사용자용
  const useGetPurchaseCustList = (
    searchFilter: SearchPurchaseFilter,
    LIMIT_ITEM_NUM: number
  ) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
      useInfiniteQuery({
        queryKey: ["SearchPurchaseCustList", searchFilter],
        queryFn: fetchPurchaseList,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
          const nextSkip = allPages ? allPages.length * LIMIT_ITEM_NUM : 1;
          return lastPage.SearchingResult &&
            lastPage.SearchingResult.length === LIMIT_ITEM_NUM
            ? nextSkip
            : undefined;
        },
      });

    return {
      searchPurchaseData: data,
      fetchNextPage,
      refetchGetPurchaseList: refetch,
      hasNextPage,
      isFetchingNextPage,
    };
  };

  const useGetAllPurchaseCustList = (
    purchasePackageId: string,
    callback?: Callback
  ) => {
    const { data, isLoading, isError, error, status, refetch } =
      useFetchQuery<SearchingPurchaseCust>(
        ["SearchAllPurchaseCustList"],
        () =>
          queryFnGet<SearchingPurchaseCust>(
            `/purchase/getAllPurchaseList?purchasePackageId=${purchasePackageId}`,
            CT.CUSTOMER_ACCESS_TOKEN
          ),
        !!purchasePackageId
      );
    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setCUSAlertState(
          err?.message || "주문 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    return {
      allPurchaseCustData: data,
      isGetAllPurchaseCustLoading: isLoading,
      isGetAllPurchaseCustError: isError,
      refetchAllGetPurchaseCust: refetch,
    };
  };

  const useGetPurchaseCustCount = (customerId: string, callback?: Callback) => {
    const { data, isLoading, isError, error, status, refetch } =
      useFetchQuery<number>(
        ["SearchPurchaseCustCount"],
        () =>
          queryFnGet<number>(
            `/purchase/getPurchaseCount?customerId=${customerId}`,
            CT.CUSTOMER_ACCESS_TOKEN
          ),
        !!customerId
      );
    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setCUSAlertState(
          err?.message || "주문 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    return {
      getPurchaseCustCountData: Number.isInteger(data) ? data : 0,
      isGetPurchaseCustCountLoading: isLoading,
      isGetPurchaseCustCountError: isError,
      refetchGetPurchaseCountCust: refetch,
    };
  };

  const useAddPurchase = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (data: { purchases: Purchase[] }) =>
        post("/purchase/addPurchase", data),
      onSuccess: () => {
        setCUSAlertState("주문이 완료 되었습니다.");
        //PurchasesPublic
        queryClient.invalidateQueries({ queryKey: ["PurchasesPublic"] });
        callback && callback();
      },
      onError: (err) => {
        error as Error;
        setCUSAlertState(err?.message || "주문 등록 중 문제가 발생했습니다.");
      },
    });

    return {
      addPurchaseMutate: mutate,
      isAddPurchasePending: isPending,
      isAddPurchaseError: isError,
    };
  };

  //사업자 사용자용
  const useGetPurchaseList = (
    searchType: "homeSearch" | "detailSearch",
    purchaseSearchKey: PurchaseSearchKey,
    callback?: Callback
  ) => {
    const paymentSelect = purchaseSearchKey.paymentSelect
      .map((purch) => `paymentSelect=${purch}`)
      .join("&");

    const purStatusSelect = purchaseSearchKey.purStatusSelect
      .map((purSta) => `purStatusSelect=${purSta}`)
      .join("&");

    const startItemNum =
      purchaseSearchKey.selectedPageNum * purchaseSearchKey.limitItemNum -
      purchaseSearchKey.limitItemNum;

    const { data, isLoading, isError, error, status, refetch } =
      useFetchQuery<SearchingPurchList>(
        ["SearchPurchase", purchaseSearchKey.storePublicId + searchType],
        () =>
          queryFnGet<SearchingPurchList>(
            `/admin/purchase/getPurchaseList?storePublicId=${purchaseSearchKey.storePublicId}&${paymentSelect}&${purStatusSelect}&limitItemNum=${purchaseSearchKey.limitItemNum}&startRangeDate=${purchaseSearchKey.startRangeDate}&endRangeDate=${purchaseSearchKey.endRangeDate}&startItemNum=${startItemNum}`,
            CT.ADMIN_ACCESS_TOKEN
          ),
        !!purchaseSearchKey
      );

    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setADAlertState(
          err?.message || "주문 목록을 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    return {
      getPurchaseData: data,
      isGetPurchaseLoading: isLoading,
      isGetPurchaseError: isError,
      refetchGetPurchase: refetch,
    };
  };

  const useUpdatePurchase = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (data: {
        storePublicId: string;
        purchasePackageId: string;
        purStatus: string;
      }) => put("/admin/purchase/updatePurchase", data, CT.ADMIN_ACCESS_TOKEN),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["SearchPurchase"] });
        setADAlertState("주문 상태가 변경 되었습니다.");
        callback && callback();
      },
      onError: (err) => {
        error as Error;
        setCUSAlertState(
          err?.message || "주문 상태를 변경하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      updatePurchaseMutate: mutate,
      isUdatePurchasePending: isPending,
      isUdatePurchaseError: isError,
    };
  };

  return {
    useGetPurchaseCustList,
    useGetAllPurchaseCustList,
    useGetPurchaseCustCount,
    useAddPurchase,
    useGetPurchaseList,
    useUpdatePurchase,
  };
};
