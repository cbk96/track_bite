import { useEffect } from "react";
import {
  get,
  post,
  del,
  put,
  queryFnPut,
  useFetchQuery,
  queryFnPost,
  queryFnGet,
} from "../server";
import {
  useQueryClient,
  useMutation,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useCustomerPublic, useAdminContext } from "../context";
import type { Coupon, CouponIssue, SearchingCoupon } from "../type";
import * as U from "../utils";
import * as CT from "../constants";

type Callback = () => void;

export const CouponApi = () => {
  const { setAlertState: setCUSAlertState } = useCustomerPublic();
  const { setAlertState: setADAlertState } = useAdminContext();

  type CouponSearchKey = {
    storeId: string;
    usableSelect: string[];
    visibleSelect: string[];
    selectedPageNum: number;
    limitItemNum: number;
    startRangeDate: Date;
    endRangeDate: Date;
  };

  type CouponIssueSearchFilter = {
    customerId: string;
    startItemNum: number;
    limitItemNum: number;
  };

  const queryClient = useQueryClient();

  const fetchCouponList = async ({
    pageParam = 0,
    queryKey,
  }: {
    pageParam?: number;
    queryKey: any[];
  }): Promise<CouponIssue[]> => {
    const [, searchFilter] = queryKey as [string, CouponIssueSearchFilter];
    const { customerId, limitItemNum } = searchFilter;
    const res = await get(
      `/coupon/getAllCouponIssues?customerId=${customerId}&skip=${pageParam}&limit=${limitItemNum}`,
      CT.CUSTOMER_ACCESS_TOKEN
    );
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.error || "서버 통신 중 문제가 발생했습니다.");
    }

    return json as Promise<CouponIssue[]>;
  };

  //일반 사용자용
  const useGetAllCouponIssues = (
    searchFilter: CouponIssueSearchFilter,
    LIMIT_ITEM_NUM: number
  ) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
      useInfiniteQuery({
        queryKey: ["CouponIssues", searchFilter],
        queryFn: fetchCouponList,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
          const nextSkip = allPages ? allPages.length * LIMIT_ITEM_NUM : 1;
          return lastPage && lastPage.length === LIMIT_ITEM_NUM
            ? nextSkip
            : undefined;
        },
      });

    return {
      couponIssuesData: data,
      fetchNextPage,
      refetchGetCoupons: refetch,
      hasNextPage,
      isFetchingNextPage,
    };
  };

  const useGetCouponsPublic = (
    couponSearchKey: Pick<Coupon, "isUsable" | "isVisible"> & {
      storePublicId: string;
      today: Date;
    },
    callback?: Callback
  ) => {
    const { data, isLoading, isError, error, status, refetch } = useFetchQuery(
      ["SearchingCouponPublic", couponSearchKey.storePublicId],
      () =>
        queryFnGet<Coupon[]>(
          `/coupon/getCoupons?isUsable=${couponSearchKey.isUsable}&isVisible=${couponSearchKey.isVisible}&storePublicId=${couponSearchKey.storePublicId}&today=${couponSearchKey.today}`
        ),
      !!couponSearchKey && !!couponSearchKey.storePublicId
    );
    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setCUSAlertState(
          err?.message || "쿠폰 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    return {
      getSearchingCouponPBData: data,
      isCouponPBLoading: isLoading,
      getSearChingCouponPBRefetch: refetch,
      isCouponPBError: isError,
    };
  };

  const useGetCouponIssues = (
    storePublicId: string,
    customerId: string,
    isLogin: boolean,
    callback?: Callback
  ) => {
    const isEnabled = !!customerId && isLogin;

    const { data, isLoading, isError, error, status, refetch } = useFetchQuery<
      CouponIssue[]
    >(
      ["CouponIssues"],
      () =>
        queryFnGet<CouponIssue[]>(
          `/coupon/getCouponIssues?storePublicId=${storePublicId}&customerId=${customerId}`,
          CT.CUSTOMER_ACCESS_TOKEN
        ),
      isEnabled
    );
    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setCUSAlertState(
          err?.message || "쿠폰 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    return {
      couponIssueGetData: data,
      isCouponIssueGetLoading: isLoading,
      isisCouponIssueGetErrorError: isError,
      refetchCouponIssueGetError: refetch,
    };
  };

  const useDownloadCouponIssues = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: CouponIssue) =>
        post(
          "/coupon/downloadCouponIssues",
          sendData,
          CT.CUSTOMER_ACCESS_TOKEN
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["CouponIssuesDownload"] });
        queryClient.invalidateQueries({ queryKey: ["CouponIssues"] });
        setCUSAlertState("쿠폰을 다운로드 했습니다.");
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setCUSAlertState(
          err?.message || "쿠폰 다운로드 하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      downloadCouponIssuesMutate: mutate,
      isDownloadCouponIssuesPending: isPending,
      isDownloadCouponIssuesError: isError,
    };
  };

  const useUpdateCouponIssues = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: CouponIssue[]) =>
        put("/coupon/updateCouponIssues", sendData, CT.CUSTOMER_ACCESS_TOKEN),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["CouponIssues"] });
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setCUSAlertState(
          err?.message || "쿠폰 정보를 수정하는 중 문제가 발생했습니다."
        );
      },
    });
    return {
      updateCouponIssuesMutate: mutate,
      isUpdateCouponIssuesPending: isPending,
      isError,
    };
  };

  //사업자 사용자용
  const useGetCoupons = (
    couponSearchKey: CouponSearchKey,
    callback?: Callback
  ) => {
    const startItemNum =
      couponSearchKey.selectedPageNum * couponSearchKey.limitItemNum -
      couponSearchKey.limitItemNum;
    const usableSelecteds = couponSearchKey.usableSelect
      .map((val) => `usableSelect=${val}`)
      .join("&");
    const visibleSelecteds = couponSearchKey.visibleSelect
      .map((val) => `visibleSelect=${val}`)
      .join("&");

    const { data, isLoading, isError, error, status, refetch } = useFetchQuery(
      ["SearchingCoupon", couponSearchKey.storeId],
      () =>
        queryFnGet<SearchingCoupon>(
          `/admin/coupon/getCoupons?storeId=${couponSearchKey.storeId}&${usableSelecteds}&${visibleSelecteds}&startItemNum=${startItemNum}&limitItemNum=${couponSearchKey.limitItemNum}&startRangeDate=${couponSearchKey.startRangeDate}&endRangeDate=${couponSearchKey.endRangeDate}`,
          CT.ADMIN_ACCESS_TOKEN
        ),
      !!couponSearchKey
    );
    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setADAlertState(
          err?.message || "쿠폰 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    return {
      getSearchingCouponData: data,
      isCouponLoading: isLoading,
      getSearChingCouponRefetch: refetch,
      isError,
    };
  };

  const useGetCouponIssuesAdmin = (purchaseId: string, callback?: Callback) => {
    const { data, isLoading, isError, error, status, refetch } = useFetchQuery(
      ["CouponIssuesAdmin"],
      () =>
        queryFnGet<CouponIssue[]>(
          `/admin/coupon/getCouponIssues$purchaseId=${purchaseId}`,
          CT.ADMIN_ACCESS_TOKEN
        ),
      !!purchaseId,
      6
    );
    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setCUSAlertState(
          err?.message || "쿠폰 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    const resetCouponIssue = () => {
      queryClient.invalidateQueries({ queryKey: ["CouponIssuesAdmin"] });
      refetch();
    };

    return {
      couponIssueAdminGetData: data,
      isCouponIssAdGetLoading: isLoading,
      isCouponIssAdGetError: isError,
      resetCouponIssue,
    };
  };

  const useAddCoupon = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation<
      {
        ok: boolean;
        error?: string;
      },
      Error,
      { storeId: string; coupon: Coupon }
    >({
      mutationFn: (sendData: { storeId: string; coupon: Coupon }) => {
        return queryFnPost(
          "/admin/coupon/addCoupon",
          sendData,
          CT.ADMIN_ACCESS_TOKEN
        );
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["SearchingCoupon"] });
        if (data?.ok) {
          setADAlertState("쿠폰이 등록되었습니다.");
        } else {
          setADAlertState(String(data?.error));
        }
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "쿠폰 정보를 저장하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      addCouponMutate: mutate,
      isCouponAddPending: isPending,
      isAddCopunError: isError,
    };
  };

  const useUpdateCoupon = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation<
      { ok: boolean; error?: string },
      Error,
      { storeId: string; coupon: Coupon }
    >({
      mutationFn: (sendData: { storeId: string; coupon: Coupon }) => {
        return queryFnPut(
          "/admin/coupon/updateCoupon",
          sendData,
          CT.ADMIN_ACCESS_TOKEN
        );
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["SearchingCoupon"] });
        if (data.ok) {
          console.log("data : ", data);
          setADAlertState("쿠폰 정보가 수정되었습니다.");
        } else {
          setADAlertState(String(data.error));
        }

        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "쿠폰 정보를 수정하는 중 오류가 발생했습니다."
        );
      },
    });

    return {
      updateCouponMutate: mutate,
      isCouponUpdatePending: isPending,
      isCouponUpdateError: isError,
    };
  };

  const useDeleteCoupon = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: { couponId: string }) =>
        del(
          `/admin/coupon/deleteCoupon?couponId=${sendData.couponId}`,
          CT.ADMIN_ACCESS_TOKEN
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["SearchingCoupon"] });
        setADAlertState("쿠폰이 삭제되었습니다.");
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "쿠폰 정보를 삭제하는 중 오류가 발생했습니다."
        );
      },
    });

    return {
      deleteCouponMutate: mutate,
      isCouponDeletePending: isPending,
      isCouponDeleteError: isError,
    };
  };

  return {
    useGetCouponsPublic,
    useGetCouponIssues,
    useGetAllCouponIssues,
    useDownloadCouponIssues,
    useUpdateCouponIssues,
    useGetCoupons,
    useGetCouponIssuesAdmin,
    useAddCoupon,
    useUpdateCoupon,
    useDeleteCoupon,
  };
};
