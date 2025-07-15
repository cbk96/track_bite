import { useEffect } from "react";
import { get, getServerUrl, queryFnGet } from "../server";
import { useFetchQuery, queryFnPut } from "../server";
import { useCustomerPublic, useAdminContext } from "../context";
import {
  useQueryClient,
  useInfiniteQuery,
  useMutation,
} from "@tanstack/react-query";
import type { StorePublicInfo, OperatingHours, EventInfo } from "../type";
import * as T from "../type";
import * as CT from "../constants";

type Callback = () => void;

export const StoreApi = () => {
  const { setAlertState: setCUSAlertState } = useCustomerPublic();
  const { setAlertState: setADAlertState } = useAdminContext();

  const queryClient = useQueryClient();

  const fetchStoreList = async ({
    pageParam = 0,
    queryKey,
  }: {
    pageParam?: number;
    queryKey: any[];
  }): Promise<StorePublicInfo[]> => {
    const [, searchFilter] = queryKey as [string, T.StoreListSearchFilter];
    const { sigunguCode, storeName, category, limitItemNum } = searchFilter;
    const response = await get(
      `/store?sigunguCode=${sigunguCode}&storeName=${storeName}&category=${category}&skip=${pageParam}&limit=${limitItemNum}`
    );
    return response.json() as Promise<StorePublicInfo[]>;
  };

  const useGetStoreList = (
    searchFilter: T.StoreListSearchFilter,
    LIMIT_ITEM_NUM: number
  ) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
      useInfiniteQuery({
        queryKey: ["StoreList", searchFilter],
        queryFn: fetchStoreList,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
          const nextSkip = allPages.length * LIMIT_ITEM_NUM;
          return lastPage.length === LIMIT_ITEM_NUM ? nextSkip : undefined;
        },
      });

    return {
      storeListData: data,
      fetchNextPage,
      refetchGetStoreList: refetch,
      hasNextPage,
      isFetchingNextPage,
    };
  };

  const useGetStorePublicInfo = (
    storePublicId: string,
    isMissingStore: () => void,
    callback?: Callback
  ) => {
    const { data, isLoading, isError, error, status, refetch } = useFetchQuery(
      ["StorePublicInfo", storePublicId],
      () =>
        queryFnGet<{
          ok: boolean;
          errMsg?: string;
          storeInfo?: StorePublicInfo;
        }>(`/store/getStoreInfo?storePublicId=${storePublicId}`),
      !!storePublicId
    );

    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setCUSAlertState(err?.message || "존재하지 않는 스토어입니다.");
      }
      if (status === "success") {
        if (data.ok) {
          callback && callback();
        } else {
          isMissingStore();
        }
      }
    }, [status]);

    return {
      storeInfoData: data?.storeInfo,
      isStoreInfoLoading: isLoading,
      refetchGetStorePBInfo: refetch,
    };
  };

  const useGetPopularStore = (
    sigunguCode: string,
    prefer: string,
    callback?: Callback
  ) => {
    const { data, isLoading, isError, error, status, refetch } = useFetchQuery(
      ["StorePublicInfo", prefer],
      () =>
        queryFnGet<{
          errMsg?: string;
          topStores?: T.PopularStore[];
          preferStores?: T.PopularStore[];
        }>(`/store/popular?sigunguCode=${sigunguCode}&prefer=${prefer}`),
      !!prefer
    );

    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setCUSAlertState(
          err?.message || "스토어 정보 요청중 에러가 발생했습니다."
        );
        callback && callback();
      }
    }, [status]);

    return {
      popularStoreData: {
        topStores: data?.topStores ?? [],
        preferStores: data?.preferStores ?? [],
      },
      isPopularStoreLoading: isLoading,
      refetchPopularStore: refetch,
    };
  };

  const useGetOperatingHours = (
    storePublicId: string,
    finalise: (data: OperatingHours[]) => void,
    callback?: Callback
  ) => {
    const { data, isLoading, isError, error, status, refetch } = useFetchQuery(
      ["StoreOPHours", storePublicId],
      () =>
        queryFnGet<{
          ok: boolean;
          opHours: T.OperatingHours[];
        }>(`/store/getOpHours?storePublicId=${storePublicId}`),
      !!storePublicId
    );

    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setCUSAlertState(err?.message || "영업시간 정보를 가져올 수 없습니다.");
      }
      if (status === "success") {
        if (data.ok) {
          finalise(data.opHours);
          callback && callback();
        }
      }
    }, [status]);

    return {
      isStoreOPHoursLoading: isLoading,
      refetchGetStoreOPHours: refetch,
    };
  };

  const useUpdateOperatingHours = (callback?: Callback) => {
    const { mutate, isPending, error } = useMutation<
      { ok: boolean; errMsg?: string; operatingHours?: OperatingHours },
      Error,
      {
        operatingHours: OperatingHours[];
        storeId: string;
      }
    >({
      mutationFn: (sendData: {
        operatingHours: OperatingHours[];
        storeId: string;
      }) => {
        return queryFnPut(
          "/admin/updateOPHours",
          sendData,
          CT.ADMIN_ACCESS_TOKEN
        );
      },
      onSuccess: (data) => {
        if (data.ok && data.operatingHours) {
          setADAlertState("영업시간 수정이 완료되었습니다.");
          queryClient.invalidateQueries({ queryKey: ["StoreOPHours"] });
          callback && callback();
        } else {
          setADAlertState(
            data.errMsg ?? "영업시간 수정중 문제가 발생했습니다."
          );
        }
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(err?.message || "영업시간 수정중 문제가 발생했습니다.");
      },
    });
    return {
      mutateUpdateOPHours: mutate,
      isUpdateOPHoursPending: isPending,
    };
  };

  const useGetStoreEventInfo = (storePublicId: string, callback?: Callback) => {
    const { data, isLoading, isError, error, status, refetch } = useFetchQuery(
      ["StoreEventInfo", storePublicId],
      () =>
        queryFnGet<EventInfo[]>(
          `/store/getStoreEventInfo?storePublicId=${storePublicId}`
        ),
      !!storePublicId
    );

    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setCUSAlertState(err?.message || "이벤트 정보를 가져올 수 없습니다.");
      }
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    return {
      storeEventInfoData: data,
      isStoreEventInfoLoading: isLoading,
      refetchGetStoreEventInfo: refetch,
    };
  };

  return {
    useGetStoreList,
    useGetStorePublicInfo,
    useGetPopularStore,
    useGetOperatingHours,
    useGetStoreEventInfo,
    useUpdateOperatingHours,
  };
};
