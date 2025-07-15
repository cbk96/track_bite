import { useEffect } from "react";
import { queryFnGet, queryFnPost, useFetchQuery } from "../server";
import { Customer, Purchase, Store } from "../type";
import { useMutation } from "@tanstack/react-query";
import { useSuperAdminContext } from "../context";
import * as U from "../utils";
import * as CT from "../constants";

type SearchKey = {
  selectedPageNum: number;
  limitItemNum: number;
};

export const SuperAdminApi = () => {
  const { setLoginState } = useSuperAdminContext();

  const useSuperAdminLogin = (callback?: () => void) => {
    const { mutate, isPending, error } = useMutation<
      {
        ok: boolean;
        errMsg?: string;
        toLoginInfo?: { sAdminId: string };
        accessToken?: string;
      },
      Error,
      {
        sAdminId: string;
        password: string;
      }
    >({
      mutationFn: (sendData: { sAdminId: string; password: string }) => {
        return queryFnPost("/superadmin/login", sendData);
      },
      onSuccess: (data) => {
        if (data.ok && data.toLoginInfo && data.accessToken) {
          const superAdmin = { ...data.toLoginInfo, logined: true };
          setLoginState(superAdmin);
          U.writeStringP(CT.SUPER_ADMIN_ACCESS_TOKEN, data.accessToken);
          callback && callback();
        } else {
          alert("잘못된 값입니다.");
        }
      },
      onError: (err) => {
        err = error as Error;
        alert(err?.message || "로그인중 문제가 발생했습니다.");
      },
    });
    return {
      mutateSLogin: mutate,
      isSLoginPending: isPending,
    };
  };

  const useSuperGetPurchaseList = (searchKey: SearchKey) => {
    const startItemNum =
      searchKey.selectedPageNum * searchKey.limitItemNum -
      searchKey.limitItemNum;

    const { data, isLoading, isError, error, status, refetch } = useFetchQuery(
      ["SuperSearchPurchase"],
      () =>
        queryFnGet<{
          searchingList: Purchase[];
          allSearchinhgLength: number;
        }>(
          `/superadmin/getPurchaseList?limitItemNum=${searchKey.limitItemNum}&startItemNum=${startItemNum}`,
          CT.SUPER_ADMIN_ACCESS_TOKEN
        ),
      !!searchKey
    );

    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        alert(err?.message || "주문 목록을 불러오는 중 문제가 발생했습니다.");
      }
      if (status === "success") {
      }
    }, [status]);

    return {
      superPurchaseData: data,
      isGetSPurchaseLoading: isLoading,
      isGetSPurchaseError: isError,
      refetchSGetPurchase: refetch,
    };
  };

  const useSuperGetStoreList = (searchKey: SearchKey) => {
    const startItemNum =
      searchKey.selectedPageNum * searchKey.limitItemNum -
      searchKey.limitItemNum;

    const { data, isLoading, isError, error, status, refetch } = useFetchQuery(
      ["SuperSearchStore"],
      () =>
        queryFnGet<{
          searchingList: Store[];
          allSearchinhgLength: number;
        }>(
          `/superadmin/getStoreList?limitItemNum=${searchKey.limitItemNum}&startItemNum=${startItemNum}`,
          CT.SUPER_ADMIN_ACCESS_TOKEN
        ),
      !!searchKey
    );

    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        alert(err?.message || "가맹점 목록을 불러오는 중 문제가 발생했습니다.");
      }
      if (status === "success") {
      }
    }, [status]);

    return {
      superStoreData: data,
      isGetSStoreLoading: isLoading,
      isGetSStoreError: isError,
      refetchSGetStore: refetch,
    };
  };

  const useSuperGetCustomerList = (searchKey: SearchKey) => {
    const startItemNum =
      searchKey.selectedPageNum * searchKey.limitItemNum -
      searchKey.limitItemNum;

    const { data, isLoading, isError, error, status, refetch } = useFetchQuery(
      ["SuperSearchCustomer"],
      () =>
        queryFnGet<{
          searchingList: Customer[];
          allSearchinhgLength: number;
        }>(
          `/superadmin/getCustomerList?limitItemNum=${searchKey.limitItemNum}&startItemNum=${startItemNum}`,
          CT.SUPER_ADMIN_ACCESS_TOKEN
        ),
      !!searchKey
    );

    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        alert(err?.message || "고객 목록을 불러오는 중 문제가 발생했습니다.");
      }
      if (status === "success") {
      }
    }, [status]);

    return {
      superCustomerData: data,
      isGetSCustomerLoading: isLoading,
      isGetScustomerError: isError,
      refetchSGetCustomer: refetch,
    };
  };

  return {
    useSuperAdminLogin,
    useSuperGetPurchaseList,
    useSuperGetStoreList,
    useSuperGetCustomerList,
  };
};
