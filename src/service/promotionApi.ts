import { useEffect } from "react";
import {
  del,
  post,
  put,
  queryFnGet,
  queryFnPut,
  useFetchQuery,
} from "../server";
import type { EventInfo } from "../type";
import { useAdminContext } from "../context";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import * as CT from "../constants";

type Callback = () => void;
type ModifyNotification = { storeId: string; notification: string };

export const PromotionApi = () => {
  const { setAlertState: setADAlertState } = useAdminContext();
  const queryClient = useQueryClient();

  const useGetStoreNotification = (storeId: string, callback?: Callback) => {
    const { data, isLoading, isError, error, status, refetch } = useFetchQuery(
      ["notification", storeId],
      () =>
        queryFnGet<{
          ok: boolean;
          notification?: string;
          errMsg?: string;
        }>(
          `/admin/promotion/notification?storeId=${storeId}`,
          CT.ADMIN_ACCESS_TOKEN
        ),
      !!storeId
    );

    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setADAlertState(
          err?.message || "스토어 공지 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    return {
      getStoreNotiData: data?.notification ?? "",
      isGetStoreNotiLoading: isLoading,
      isGetStoreNotiError: isError,
      refetchGetStoreNoti: refetch,
    };
  };

  const useUpdateNotification = (callback?: Callback) => {
    const { mutate, isPending, error } = useMutation<
      { ok: boolean; errMsg?: string; updatedNoti?: string },
      Error,
      ModifyNotification
    >({
      mutationFn: (sendData: { storeId: string; notification: string }) => {
        return queryFnPut(
          "/admin/promotion/updateNotification",
          sendData,
          CT.ADMIN_ACCESS_TOKEN
        );
      },
      onSuccess: (data) => {
        if (data.ok && data.updatedNoti) {
          queryClient.invalidateQueries({
            queryKey: ["notification"],
          });
          callback && callback();
        } else {
          setADAlertState(
            data.errMsg ?? "공지사항 수정중 문제가 발생했습니다."
          );
        }
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(err?.message || "공지사항 수정중 문제가 발생했습니다.");
      },
    });
    return {
      mutateUpdateNoti: mutate,
      isUpdateNotiPending: isPending,
    };
  };

  const useGetStoreEventInfo = (storeId: string, callback?: Callback) => {
    const { data, isLoading, isError, error, status, refetch } = useFetchQuery(
      ["EventInfo"],
      () =>
        queryFnGet<EventInfo[]>(
          `/admin/promotion/getStoreEventInfo?storeId=${storeId}`,
          CT.ADMIN_ACCESS_TOKEN
        ),
      !!storeId
    );
    useEffect(() => {
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    return {
      getStoreEventData: data,
      isGetStoreEventeLoading: isLoading,
      isGetStoreEventError: isError,
      refetchGetStoreEvent: refetch,
    };
  };

  const useAddEvent = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: { eventInfo: EventInfo }) =>
        post("/admin/promotion/addEvent", sendData, CT.ADMIN_ACCESS_TOKEN),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["EventInfo"] });
        setADAlertState("이벤트 정보가 등록되었습니다.");
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "이벤트 정보를 등록하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      addEventMutate: mutate,
      isAddEventPending: isPending,
      isAddEventError: isError,
    };
  };

  const useUpdateEvent = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: { eventInfo: EventInfo }) =>
        put("/admin/promotion/updateEvent", sendData, CT.ADMIN_ACCESS_TOKEN),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["EventInfo"] });
        setADAlertState("이벤트 정보가 수정되었습니다.");
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "이벤트 정보를 수정하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      updateEventMutate: mutate,
      isUpdateEventPending: isPending,
      isUpdateEventError: isError,
    };
  };

  const useDeleteEvent = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: { storeId: string; eventId: string }) =>
        del(
          `/admin/promotion/deleteEvent?storeId=${sendData.storeId}&eventId=${sendData.eventId}`,
          CT.ADMIN_ACCESS_TOKEN
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["EventInfo"] });
        setADAlertState("이벤트 정보가 삭제되었습니다.");
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "이벤트 정보를 삭제하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      deleteEventMutate: mutate,
      isDeleteEventPending: isPending,
      isDeleteEventError: isError,
    };
  };

  return {
    useGetStoreNotification,
    useUpdateNotification,
    useGetStoreEventInfo,
    useAddEvent,
    useUpdateEvent,
    useDeleteEvent,
  };
};
