import { get, getServerUrl, queryFnGet } from "../server";
import { useEffect } from "react";
import { post, useFetchQuery } from "../server";
import {
  useQueryClient,
  useMutation,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useCustomerPublic, useAdminContext } from "../context";
import type { Review, SearchingReview } from "../type";
import * as CT from "../constants";

type Callback = () => void;

type SearchingReviewParam = {
  storePublicId: string;
  selectedPageNum: number;
  limitItemNum: number;
  startRangeDate: Date;
  endRangeDate: Date;
};

type ReviewLoadFilter = {
  storePublicId: string;
  startItemNum: number;
  limitItemNum: number;
};

type ReviewInfo = {
  customerReviw: Review[];
  adminReview: Review[];
  totalScroe: number;
  allReviewLength: number;
};

export const ReviewApi = () => {
  const { setAlertState: setADAlertState } = useAdminContext();
  const { setAlertState: setCUSAlertState } = useCustomerPublic();

  const fetchReviewList = async ({
    pageParam = 0,
    queryKey,
  }: {
    pageParam?: number;
    queryKey: any[];
  }): Promise<ReviewInfo> => {
    const [, searchFilter] = queryKey as [string, ReviewLoadFilter];
    const { storePublicId, limitItemNum } = searchFilter;
    const response = await get(
      `/review/getReviewList?storePublicId=${storePublicId}&skip=${pageParam}&limit=${limitItemNum}`
    );
    return response.json() as Promise<ReviewInfo>;
  };

  //일반 사용자용
  const useGetReviewListPublic = (
    searchFilter: ReviewLoadFilter,
    LIMIT_ITEM_NUM: number
  ) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
      useInfiniteQuery({
        queryKey: ["Reviews", searchFilter],
        queryFn: fetchReviewList,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
          const nextSkip = allPages ? allPages.length * LIMIT_ITEM_NUM : 1;
          return lastPage.customerReviw &&
            lastPage.customerReviw.length === LIMIT_ITEM_NUM
            ? nextSkip
            : undefined;
        },
      });

    return {
      reviewsData: data,
      fetchNextPage,
      refetchGetReviews: refetch,
      hasNextPage,
      isFetchingNextPage,
    };
  };

  const useRegistReview = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (data: { registReview: Review }) =>
        post("/review/registReview", data, CT.CUSTOMER_ACCESS_TOKEN),
      onSuccess: () => {
        setCUSAlertState("리뷰를 등록 했습니다.");
        callback && callback();
      },
      onError: (err) => {
        error as Error;
        setCUSAlertState(
          err?.message || "리뷰를 등록하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      registReviewMutate: mutate,
      isRegistReviewPending: isPending,
      isRegistReviewError: isError,
    };
  };

  //사업자 사용자용
  const useGetReviewList = (
    searchType: "homeSearch" | "detailSearch",
    searchingParam: SearchingReviewParam,
    callback?: Callback
  ) => {
    const startItemNum =
      searchingParam.selectedPageNum * searchingParam.limitItemNum -
      searchingParam.limitItemNum;
    const { data, isLoading, isError, error, status, refetch } =
      useFetchQuery<SearchingReview>(
        ["ReviewsNesting", searchingParam.storePublicId + searchType],
        () =>
          queryFnGet<SearchingReview>(
            `/admin/review/getReviewList?storePublicId=${searchingParam.storePublicId}&limitItemNum=${searchingParam.limitItemNum}&startRangeDate=${searchingParam.startRangeDate}&endRangeDate=${searchingParam.endRangeDate}&startItemNum=${startItemNum}`,
            CT.ADMIN_ACCESS_TOKEN
          ),
        !!searchingParam
      );
    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setADAlertState(
          err?.message || "리뷰 목록을 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    return {
      getReviewListata: data,
      isGetReviewListLoading: isLoading,
      isGetReviewListError: isError,
      refetchGetReviewList: refetch,
    };
  };

  const useRegistReviewAns = (callback?: Callback) => {
    const queryClient = useQueryClient();

    const { mutate, isPending, isError } = useMutation({
      mutationFn: (data: { registReview: Review }) =>
        post("/admin/review/registReviewAns", data, CT.ADMIN_ACCESS_TOKEN),
      onSuccess: () => {
        setADAlertState("리뷰 답글이 등록되었습니다.");
        queryClient.invalidateQueries({ queryKey: ["ReviewsNesting"] });
        callback && callback();
      },
      onError: () => {
        setADAlertState("리뷰 답글을 등록하는 중 문제가 발생했습니다.");
      },
    });

    return {
      registReviewAnsMutate: mutate,
      isRegistReviewAnsPending: isPending,
      isRegistReviewAnsError: isError,
    };
  };

  return {
    useGetReviewListPublic,
    useRegistReview,
    useGetReviewList,
    useRegistReviewAns,
  };
};
