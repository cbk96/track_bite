import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as OG from "../store/optionGroup";
import * as O from "../store/option";
import * as CT from "../constants";
import { useFetchQuery, post, put, del, queryFnGet } from "../server";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAdminContext } from "../context";
import type {
  OptionGroup,
  Option,
  OptionPublicInfo,
  OptionGroupPublicInfo,
} from "../type";

type Callback = () => void;

export const OptionApi = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { setAlertState: setADAlertState } = useAdminContext();
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  //일반 사용자용
  const useGetOptionGroupPublicInfo = (
    storePublicId: string,
    callback?: Callback
  ) => {
    const { data, isLoading, isError, error, status } = useFetchQuery(
      ["OptionGroupPublicResultInfo"],
      () =>
        queryFnGet<{
          ok: boolean;
          error?: string;
          optionGroupsPublic?: OptionGroupPublicInfo[];
        }>(
          `/customer/menu/getOptionGroupPublicInfo?storePublicId=${storePublicId}`
        ),
      !!storePublicId
    );
    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setADAlertState(
          err?.message || "옵션 그룹 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    const optionGrPublicData = data?.optionGroupsPublic;
    const isGetOptionGrPublicLoading = isLoading;

    return { optionGrPublicData, isGetOptionGrPublicLoading, isError };
  };

  const useGetOptionPublicInfo = (
    storePublicId: string,
    callback?: Callback
  ) => {
    const { data, isLoading, isError, error, status } = useFetchQuery(
      ["OptionPublicResultInfo"],
      () =>
        queryFnGet<{
          ok: boolean;
          error?: string;
          optionsPublic?: OptionPublicInfo[];
        }>(`/customer/menu/getOptionPublicInfo?storePublicId=${storePublicId}`),
      !!storePublicId
    );
    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setADAlertState(
          err?.message || "옵션 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    const optionPublicData = data?.optionsPublic;
    const isGetOptionPublicLoading = isLoading;

    return { optionPublicData, isGetOptionPublicLoading, isError };
  };

  //사업자 사용자용
  const useGetOptionGroups = (storeId: string, callback?: Callback) => {
    const { data, isLoading, isError, error, refetch, status } = useFetchQuery(
      ["OptionGroupResultInfo"],
      () =>
        queryFnGet<{
          ok: boolean;
          error?: string;
          optionGroups?: OptionGroup[];
        }>(
          `/admin/option/getOptionGroups?storeId=${storeId}`,
          CT.ADMIN_ACCESS_TOKEN
        ),
      !!storeId
    );
    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setADAlertState(
          err?.message || "옵션 그룹 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        data.optionGroups && dispatch(OG.setOptionGroup(data.optionGroups));
      }
    }, [status, data]);

    const isGetOptionGrLoading = isLoading;
    const refetchOptionGroups = refetch;

    return { isGetOptionGrLoading, isError, refetchOptionGroups };
  };

  const useAddOptionGroup = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: OptionGroup) =>
        post("/admin/option/addOptionGroup", sendData, CT.ADMIN_ACCESS_TOKEN),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["OptionGroupResultInfo"] });
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "옵션 정보를 저장하는 중 문제가 발생했습니다."
        );
      },
    });

    return { addOptionGroupMutate: mutate, isPending, isError };
  };

  const useUpdateOptionGroup = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: OptionGroup[]) =>
        put("/admin/option/updateOptionGroup", sendData, CT.ADMIN_ACCESS_TOKEN),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["OptionGroupResultInfo"] });
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "옵션 그룹 정보를 수정하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      updateOptionGroupMutate: mutate,
      isUpdateOptionGrPending: isPending,
      isError,
    };
  };

  const useDeleteOptionGroup = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: { optionGroupId: string; storeId: string }) =>
        del(
          `/admin/option/deleteOptionGroup?optionGroupId=${sendData.optionGroupId}&storeId=${sendData.storeId}`,
          CT.ADMIN_ACCESS_TOKEN
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["OptionGroupResultInfo"] });
        setADAlertState("선택한 옵션 그룹과 포함 옵션이 삭제되었습니다.");
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "옵션 정보를 삭제하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      deleteOptionGroupMutate: mutate,
      isDeleteOptionGrPending: isPending,
      isError,
    };
  };

  const useGetOptions = (storeId: string, callback?: Callback) => {
    const { data, isLoading, isError, error, status } = useFetchQuery(
      ["OptionResultInfo"],
      () =>
        queryFnGet<{
          ok: boolean;
          error?: string;
          options?: Option[];
        }>(
          `/admin/option/getOptions?storeId=${storeId}`,
          CT.ADMIN_ACCESS_TOKEN
        ),
      !!storeId
    );
    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setADAlertState(
          err?.message || "옵션 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        data.options && dispatch(O.setOption(data.options));
        callback && callback();
      }
    }, [status, data]);

    const isgGetOptionLoading = isLoading;
    return { isgGetOptionLoading, isError };
  };

  const useAddOption = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: Option) =>
        post("/admin/option/addOption", sendData, CT.ADMIN_ACCESS_TOKEN),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["OptionResultInfo"] });
        queryClient.invalidateQueries({ queryKey: ["OptionGroupResultInfo"] });
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "옵션 정보를 저장하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      addOptionMutate: mutate,
      isAddOptionPending: isPending,
      isError,
      status,
    };
  };

  const useUpdateOption = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: Option[]) =>
        put("/admin/option/updateOption", sendData, CT.ADMIN_ACCESS_TOKEN),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["OptionResultInfo"] });
        //setADAlertState("옵션 수정이 완료 되었습니다.");
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "옵션 정보를 수정하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      updateOptionMutate: mutate,
      isUpdateOptionPending: isPending,
      isError,
    };
  };

  const useDeleteOption = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: { optionId: string; storeId: string }) =>
        del(
          `/admin/option/deleteOption?optionId=${sendData.optionId}&storeId=${sendData.storeId}`,
          CT.ADMIN_ACCESS_TOKEN
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["OptionResultInfo"] });
        queryClient.invalidateQueries({ queryKey: ["OptionGroupResultInfo"] });
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "옵션 정보를 삭제하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      deleteOptionMutate: mutate,
      isDeleteOptionPending: isPending,
      isError,
    };
  };

  return {
    useGetOptionGroupPublicInfo,
    useGetOptionPublicInfo,
    useGetOptionGroups,
    useAddOptionGroup,
    useUpdateOptionGroup,
    useDeleteOptionGroup,
    useGetOptions,
    useAddOption,
    useUpdateOption,
    useDeleteOption,
  };
};
