import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as MG from "../store/menuGroup";
import * as M from "../store/menu";
import * as T from "../type";
import * as CT from "../constants";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useFetchQuery, post, put, del, queryFnGet } from "../server";
import { useCustomerPublic, useAdminContext } from "../context";
import type {
  MenuGroup,
  Menu,
  MenuPublicInfo,
  MenuGroupPublicInfo,
} from "../type";

type Callback = () => void;

export const MenuApi = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const dispatch = useDispatch();
  const { setAlertState: setADAlertState } = useAdminContext();
  const { setAlertState: setCUSAlertState } = useCustomerPublic();

  const queryClient = useQueryClient();

  //일반 사용자용
  const useGetMenuGroupPublicInfo = (
    storePublicId: string,
    callback?: Callback
  ) => {
    const { data, isLoading, isError, error, status, refetch } = useFetchQuery(
      ["MenuGroupPublicInfo", storePublicId],
      () =>
        queryFnGet<{
          ok: boolean;
          error?: string;
          menuGroupPublic?: MenuGroupPublicInfo[];
        }>(
          `/customer/menu/getMenuGroupPublicInfo?storePublicId=${storePublicId}`
        ),
      !!storePublicId
    );
    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setCUSAlertState(
          err?.message || "메뉴 그룹 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    return {
      menuGroupPublicData: data?.menuGroupPublic,
      isGetMenuGrPublicLoading: isLoading,
      isError,
      refetchMenuGP: refetch,
    };
  };

  const useGetMenuPublicInfo = (storePublicId: string, callback?: Callback) => {
    const { data, isLoading, isError, error, status, refetch } = useFetchQuery(
      ["MenuPublicInfos", storePublicId],
      () =>
        queryFnGet<{
          ok: boolean;
          error?: string;
          menuPublic?: MenuPublicInfo[];
        }>(`/customer/menu/getMenuPublicInfo?storePublicId=${storePublicId}`),
      !!storePublicId
    );
    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setCUSAlertState(
          err?.message || "메뉴 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    return {
      menuPublicData: data?.menuPublic,
      getmenuPublicLoading: isLoading,
      isError,
      refetchMenuP: refetch,
    };
  };

  //사업자 사용자용
  const useGetMenuGroups = (storeId: string, callback?: Callback) => {
    const { data, isLoading, isError, error, refetch, status } = useFetchQuery(
      ["MenuGroupResultInfo", storeId],
      () =>
        queryFnGet<{
          ok: boolean;
          error?: string;
          menuGroups?: MenuGroup[];
        }>(
          `/admin/menu/getMenuGroups?storeId=${storeId}`,
          CT.ADMIN_ACCESS_TOKEN
        ),
      !!storeId
    );
    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setADAlertState(
          err?.message || "메뉴 그룹 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        data.menuGroups && dispatch(MG.setMenuGroup(data.menuGroups));
      }
      console.log("mg get status : ", status);
    }, [status, data]);

    const isGetMenuGrLoading = isLoading;
    const refetchMenuGroups = refetch;

    return { isGetMenuGrLoading, isError, refetchMenuGroups };
  };

  const useAddMenuGroup = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: MenuGroup) =>
        post("/admin/menu/addMenuGroup", sendData, CT.ADMIN_ACCESS_TOKEN),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["MenuGroupResultInfo"] });
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "메뉴 그룹 정보를 저장하는 중 문제가 발생했습니다."
        );
      },
    });

    return { addMenuGroupMutate: mutate, isPending, isError };
  };

  const useUpdateMenuGroup = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: MenuGroup[]) =>
        put("/admin/menu/updateMenuGroup", sendData, CT.ADMIN_ACCESS_TOKEN),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["MenuGroupResultInfo"] });
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "메뉴 그룹 정보를 수정하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      updateMenuGroupMutate: mutate,
      isUpdateMenuGrPending: isPending,
      isError,
    };
  };

  const useDeleteMenuGroup = (callback?: Callback) => {
    const { mutate, isPending, isError, error } = useMutation({
      mutationFn: (sendData: { menuGroupId: string; storeId: string }) =>
        del(
          `/admin/menu/deleteMenuGroup?menuGroupId=${sendData.menuGroupId}&storeId=${sendData.storeId}`,
          CT.ADMIN_ACCESS_TOKEN
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["MenuGroupResultInfo"] });
        setADAlertState("선택한 메뉴 그룹과 포함 메뉴가 삭제되었습니다.");
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "메뉴 그룹 정보를 삭제하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      deleteMenuGroupMutate: mutate,
      isDeleteMenuGrPending: isPending,
      isError,
    };
  };

  const useGetMenus = (storeId: string, callback?: Callback) => {
    const { data, isLoading, isError, error, refetch, status } = useFetchQuery(
      ["MenuResultInfo"],
      () =>
        queryFnGet<{
          ok: boolean;
          error?: string;
          menus?: Menu[];
        }>(`/admin/menu/getMenus?storeId=${storeId}`, CT.ADMIN_ACCESS_TOKEN),

      !!storeId
    );
    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setADAlertState(
          err?.message || "메뉴 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        data.menus && dispatch(M.setMenu(data.menus));
        callback && callback();
      }
    }, [status, data]);

    const isgGetMenuLoading = isLoading;
    const refetchMenues = refetch;
    return { isgGetMenuLoading, isError, refetchMenues };
  };

  const useGetPopularMenus = (storePublicId: string, callback?: Callback) => {
    const { data, isLoading, isError, error, refetch, status } = useFetchQuery(
      ["MenuPopularInfo", storePublicId],
      () =>
        queryFnGet<{
          ok: boolean;
          error?: string;
          topMenus?: T.PopularMenu[];
        }>(
          `/admin/menu/popular?storePublicId=${storePublicId}`,
          CT.ADMIN_ACCESS_TOKEN
        ),
      !!storePublicId
    );
    useEffect(() => {
      if (status === "error") {
        const err = error as Error;
        setADAlertState(
          err?.message || "메뉴 정보를 불러오는 중 문제가 발생했습니다."
        );
      }
      if (status === "success") {
        callback && callback();
      }
    }, [status]);

    return {
      popularMenuData: data?.topMenus,
      isgGetPopularMenuLoading: isLoading,
      isError,
      refetchPopularMenues: refetch,
    };
  };

  const useAddMenu = (callback?: Callback) => {
    const { mutate, isPending, isError, error } = useMutation({
      mutationFn: (sendData: Menu) =>
        post("/admin/menu/addMenu", sendData, CT.ADMIN_ACCESS_TOKEN),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["MenuGroupResultInfo"] });
        queryClient.invalidateQueries({ queryKey: ["MenuResultInfo"] });
        setADAlertState("메뉴 등록이 완료되었습니다.");
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "메뉴 정보를 저장하는 중 문제가 발생했습니다."
        );
      },
    });

    return { addMenuMutate: mutate, isAddMenuPending: isPending, isError };
  };

  const useUpdateMenu = (callback?: Callback) => {
    const { mutate, isPending, isError, error, status } = useMutation({
      mutationFn: (sendData: Menu[]) =>
        put("/admin/menu/updateMenu", sendData, CT.ADMIN_ACCESS_TOKEN),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["MenuResultInfo"] });
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "메뉴 정보를 수정하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      updateMenuMutate: mutate,
      isUpdateMenuPending: isPending,
      isError,
    };
  };

  const useDeleteMenu = (callback?: Callback) => {
    const { mutate, isPending, isError, error } = useMutation({
      mutationFn: (sendData: { menuId: string; storeId: string }) =>
        del(
          `/admin/menu/deleteMenu?menuId=${sendData.menuId}&storeId=${sendData.storeId}`,
          CT.ADMIN_ACCESS_TOKEN
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["MenuResultInfo"] });
        queryClient.invalidateQueries({ queryKey: ["MenuGroupResultInfo"] });
        setADAlertState("선택한 메뉴가 삭제되었습니다.");
        callback && callback();
      },
      onError: (err) => {
        err = error as Error;
        setADAlertState(
          err?.message || "메뉴 정보를 삭제하는 중 문제가 발생했습니다."
        );
      },
    });

    return {
      deleteMenuMutate: mutate,
      isDeleteMenuPending: isPending,
      isError,
    };
  };

  return {
    useGetMenuGroupPublicInfo,
    useGetMenuPublicInfo,
    useGetMenuGroups,
    useAddMenuGroup,
    useUpdateMenuGroup,
    useDeleteMenuGroup,
    useAddMenu,
    useGetMenus,
    useGetPopularMenus,
    useUpdateMenu,
    useDeleteMenu,
  };
};
