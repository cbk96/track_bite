import { getServerUrl, queryFnPost } from "../server";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useCustomerPublic, useAdminContext } from "../context";
import * as U from "../utils";
import * as CUST from "../store/customer";
import * as CT from "../constants";
import * as T from "../type";
import type { Customer, LoginCustomer, Store, LoginAdmin } from "../type";

type Callback = () => void;

export const AuthApi = () => {
  const { setAlertState: setCUSAlertState } = useCustomerPublic();
  const { setAlertState: setADAlertState, setLoginState } = useAdminContext();
  const dispatch = useDispatch();

  //일반 사용자용
  const useCheckIdAvailability = () => {
    let idAvailable = false;
    const { data, mutate, isPending, error } = useMutation<
      { ok: boolean },
      Error,
      { customerId: string }
    >({
      mutationFn: (sendData: { customerId: string }) => {
        return queryFnPost("/isIdAvailable", sendData);
      },
      onError: (err) => {
        setCUSAlertState(
          err?.message || "아이디 중복 체크중 문제가 발생했습니다."
        );
      },
    });
    return {
      idAvailData: data ? data.ok : false,
      mutateChkIdAvail: mutate,
      isChkIdAvailPending: isPending,
    };
  };

  const useSignUp = (callback?: Callback) => {
    const { mutate, isPending, error } = useMutation<
      { ok: boolean; errMsg?: string; registeredId?: string },
      Error,
      Customer
    >({
      mutationFn: (sendData: Customer) => {
        return queryFnPost("/signup", sendData);
      },
      onSuccess: (data) => {
        setCUSAlertState(data.registeredId + "님의 가입을 환영합니다.");
        callback && callback();
      },
      onError: (err) => {
        setCUSAlertState(err?.message || "회원가입중 문제가 발생했습니다.");
      },
    });
    return {
      mutateSignUp: mutate,
      isSignUpPending: isPending,
    };
  };

  const useLogin = (callback?: Callback) => {
    const { mutate, isPending, error } = useMutation<
      {
        ok: boolean;
        errMsg?: string;
        toLoginInfo?: Customer;
        accessToken?: string;
      },
      Error,
      {
        customerId: string;
        password: string;
      }
    >({
      mutationFn: async (sendData: {
        customerId: string;
        password: string;
      }) => {
        const res = await fetch(getServerUrl("/login"), {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify(sendData),
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to login");
        return res.json();
      },
      onSuccess: (data) => {
        if (data.ok && data.toLoginInfo && data.accessToken) {
          const { password, joinDate, ...rest } = data.toLoginInfo;
          const loggedInfo: LoginCustomer = { logined: "login", ...rest };

          dispatch(CUST.loginCustomer(loggedInfo));
          U.writeStringP(CT.CUSTOMER_ACCESS_TOKEN, data.accessToken);
          setCUSAlertState(loggedInfo.name + "님 환영합니다.");
          callback && callback();
        } else {
          setCUSAlertState(data.errMsg ?? "고객님의 정보를 찾을 수 없습니다.");
        }
      },
      onError: (err) => {
        setCUSAlertState(err?.message || "로그인중 문제가 발생했습니다.");
      },
    });
    return {
      mutateLogin: mutate,
      isLoginPending: isPending,
    };
  };

  const useRefreshCustomerLoginToken = (onError?: Callback) => {
    const { mutate, isPending } = useMutation<
      {
        ok: boolean;
        errMsg?: string;
        toLoginInfo?: Customer;
        accessToken?: string;
      },
      Error
    >({
      mutationFn: async () => {
        const res = await fetch(getServerUrl("/refreshCustToken"), {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to refresh token");
        return res.json();
      },
      onSuccess: (data) => {
        if (data.ok && data.toLoginInfo && data.accessToken) {
          const { password, joinDate, ...rest } = data.toLoginInfo;
          const loggedInfo: LoginCustomer = { logined: "login", ...rest };

          dispatch(CUST.loginCustomer(loggedInfo));
          U.writeStringP(CT.CUSTOMER_ACCESS_TOKEN, data.accessToken);
        }

        if (!data.ok) {
          onError && onError();
        }
      },
      onError: () => {
        onError && onError();
      },
    });
    return {
      mutateLoginExtend: mutate,
      isLoginExtendPending: isPending,
    };
  };

  const useCustomerLogout = (callback?: Callback) => {
    const { mutate, isPending, error } = useMutation<
      {
        ok: boolean;
        errMsg?: string;
      },
      Error
    >({
      mutationFn: async () => {
        let sendAccessToken = localStorage.getItem(CT.CUSTOMER_ACCESS_TOKEN);
        const res = await fetch(getServerUrl("/logout"), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sendAccessToken}`,
          },
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to login");
        return res.json();
      },
      onSuccess: (data) => {
        if (data.ok) {
          const guestAccount = U.createGuestAccount();
          dispatch(CUST.loginCustomer(guestAccount));
          U.removeItemToStorage(CT.CUSTOMER_ACCESS_TOKEN);

          setCUSAlertState("로그아웃 되었습니다.");
          callback && callback();
        } else {
          setCUSAlertState(data.errMsg ?? "로그아웃중 문제가 발생했습니다.");
        }
      },
      onError: (err) => {
        setCUSAlertState(err?.message || "로그아웃중 문제가 발생했습니다.");
      },
    });
    return {
      mutateLogout: mutate,
      isLogoutPending: isPending,
    };
  };

  const usePasswordChk = (callback?: Callback) => {
    const { data, mutate, isPending, error } = useMutation<
      { errMsg?: string; isCustomer?: boolean },
      Error,
      {
        customerId: string;
        password: string;
      }
    >({
      mutationFn: (sendData: { customerId: string; password: string }) => {
        return queryFnPost("/passchk", sendData);
      },
      onSuccess: (data) => {
        if (data.isCustomer) {
          setCUSAlertState("회원 정보가 조회되었습니다.");
          callback && callback();
        } else {
          setCUSAlertState(data.errMsg ?? "회원 정보를 찾을 수 없습니다.");
        }
      },
      onError: (err) => {
        setCUSAlertState(err?.message || "회원 정보를 찾을 수 없습니다.");
      },
    });
    return {
      passChkData: data,
      mutatePassChk: mutate,
      isPassChkPending: isPending,
    };
  };

  const useCustomerUpdate = (jwtKey: string, callback?: Callback) => {
    const { mutate, isPending } = useMutation<
      {
        ok: boolean;
        errMsg?: string;
        toUpdateInfo?: T.EditCustomer;
        accessToken?: string;
      },
      Error,
      T.EditCustomer
    >({
      mutationFn: async (sendData: T.EditCustomer) => {
        let sendAccessToken = localStorage.getItem(jwtKey ?? "");
        const res = await fetch(getServerUrl("/updateCustomer"), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sendAccessToken}`,
          },
          method: "PUT",
          body: JSON.stringify(sendData),
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to user update");
        return res.json();
      },
      onSuccess: (data) => {
        if (data.ok && data.toUpdateInfo && data.accessToken) {
          const updatedInfo: LoginCustomer = {
            logined: "login",
            ...data.toUpdateInfo,
          };
          dispatch(CUST.loginCustomer(updatedInfo));
          U.writeStringP(CT.CUSTOMER_ACCESS_TOKEN, data.accessToken);
          setCUSAlertState(
            updatedInfo.customerId + "님의 회원정보 수정이 완료되었습니다."
          );
          callback && callback();
        } else {
          setCUSAlertState(data.errMsg ?? "회원 정보를 찾을 수 없습니다.");
        }
      },
      onError: (err) => {
        setADAlertState(
          err?.message || "회원 정보 수정중 문제가 발생했습니다."
        );
      },
    });
    return {
      mutateUpdateCustomer: mutate,
      isUpdatecustomerPending: isPending,
    };
  };

  //사업자 사용자용
  const useCheckAdminIdAvailability = () => {
    const { data, mutate, isPending, error } = useMutation<
      { isIdAvailable: boolean },
      Error,
      { adminId: string; key: "storeId" | "storePublicId" }
    >({
      mutationFn: (sendData: {
        adminId: string;
        key: "storeId" | "storePublicId";
      }) => {
        return queryFnPost("/admin/isIdAvailable", sendData);
      },
      onError: (err) => {
        setADAlertState(
          err?.message || "아이디 중복 체크중 문제가 발생했습니다."
        );
      },
    });
    return {
      idAvailData: data,
      mutateChkIdAvail: mutate,
      isChkIdAvailPending: isPending,
    };
  };

  const useAdminSignUp = (callback?: Callback) => {
    const { mutate, isPending, error } = useMutation<
      { ok: boolean; errMsg?: string; registeredStoreName?: string },
      Error,
      Store
    >({
      mutationFn: (sendData: Store) => {
        return queryFnPost("/admin/signup", sendData);
      },
      onSuccess: (data) => {
        setADAlertState(
          data.registeredStoreName + "의 가맹점 등록이 완료되었습니다."
        );
        callback && callback();
      },
      onError: (err) => {
        setADAlertState(err?.message || "가맹점 등록중 문제가 발생했습니다.");
      },
    });
    return {
      mutateSignUp: mutate,
      isSignUpPending: isPending,
    };
  };

  const useAdminLogin = (callback?: Callback) => {
    const { mutate, isPending, error } = useMutation<
      {
        ok: boolean;
        errMsg?: string;
        toLoginInfo?: Store;
        accessToken?: string;
      },
      Error,
      {
        storeId: string;
        password: string;
      }
    >({
      mutationFn: async (sendData: { storeId: string; password: string }) => {
        const res = await fetch(getServerUrl("/admin/login"), {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify(sendData),
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to login");
        return res.json();
      },
      onSuccess: (data) => {
        if (data.ok && data.toLoginInfo && data.accessToken) {
          const { password, joinDate, notification, ...rest } =
            data.toLoginInfo;
          const loggedInfo: LoginAdmin = { logined: true, ...rest };

          setLoginState(loggedInfo);
          U.writeStringP(CT.ADMIN_ACCESS_TOKEN, data.accessToken);
          setADAlertState(loggedInfo.name + "님 환영합니다.");
          callback && callback();
        } else {
          setADAlertState(data.errMsg ?? "스토어 정보를 찾을 수 없습니다.");
        }
      },
      onError: (err) => {
        setADAlertState(err?.message || "로그인중 문제가 발생했습니다.");
      },
    });
    return {
      mutateLogin: mutate,
      isLoginPending: isPending,
    };
  };

  const useRefreshAdminLoginToken = (onError?: Callback) => {
    const { mutate, isPending } = useMutation<
      {
        ok: boolean;
        errMsg?: string;
        toLoginInfo?: Store;
        accessToken?: string;
      },
      Error
    >({
      mutationFn: async () => {
        const res = await fetch(getServerUrl("/admin/refreshAdminToken"), {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to refresh token");
        return res.json();
      },
      onSuccess: (data) => {
        if (data.ok && data.toLoginInfo && data.accessToken) {
          console.log("result : success");
          const { password, joinDate, notification, ...rest } =
            data.toLoginInfo;
          const loggedInfo: LoginAdmin = { logined: true, ...rest };

          setLoginState(loggedInfo);
          U.writeStringP(CT.CUSTOMER_ACCESS_TOKEN, data.accessToken);
        }

        if (!data.ok) {
          console.log("result : ok is false");
          onError && onError();
        }
      },
      onError: () => {
        console.log("result : error");
        onError && onError();
      },
    });
    return {
      mutateADLoginExtend: mutate,
      isADLoginExtendPending: isPending,
    };
  };

  const useAdminLogout = (callback?: Callback) => {
    const { mutate, isPending, error } = useMutation<
      {
        ok: boolean;
        errMsg?: string;
      },
      Error
    >({
      mutationFn: async () => {
        let sendAccessToken = localStorage.getItem(CT.ADMIN_ACCESS_TOKEN);
        const res = await fetch(getServerUrl("/admin/logout"), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sendAccessToken}`,
          },
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to login");
        return res.json();
      },
      onSuccess: (data) => {
        if (data.ok) {
          setLoginState(T.initialLoginAdmin);
          U.removeItemToStorage(CT.ADMIN_ACCESS_TOKEN);
          setADAlertState("로그아웃 되었습니다.");
          callback && callback();
        } else {
          setADAlertState(data.errMsg ?? "로그아웃중 문제가 발생했습니다.");
        }
      },
      onError: (err) => {
        setADAlertState(err?.message || "로그아웃중 문제가 발생했습니다.");
      },
    });
    return {
      mutateAdminLogout: mutate,
      isAdminLogoutPending: isPending,
    };
  };

  const useAdminPasswordChk = (callback?: Callback) => {
    const { data, mutate, isPending } = useMutation<
      { errMsg?: string; isAdmin?: boolean },
      Error,
      {
        storeId: string;
        password: string;
      }
    >({
      mutationFn: (sendData: { storeId: string; password: string }) => {
        return queryFnPost("/admin/passchk", sendData);
      },
      onSuccess: (data) => {
        if (data.isAdmin) {
          setADAlertState("스토어 관리자 정보가 확인되었습니다.");
          callback && callback();
        } else {
          setADAlertState(
            data.errMsg ?? "스토어 관리자 정보를 찾을 수 없습니다."
          );
        }
      },
      onError: (err) => {
        setADAlertState(
          err?.message || "스토어 관리자 정보를 찾을 수 없습니다."
        );
      },
    });
    return {
      passChkData: data,
      mutatePassChk: mutate,
      isPassChkPending: isPending,
    };
  };

  const useAdminUpdate = (jwtKey: string, callback?: Callback) => {
    let sendAccessToken = localStorage.getItem(jwtKey ?? "");
    const { mutate, isPending, error } = useMutation<
      {
        ok: boolean;
        errMsg?: string;
        toUpdateInfo?: T.EditStore;
        accessToken?: string;
      },
      Error,
      T.EditStore
    >({
      mutationFn: async (sendData: T.EditStore) => {
        const res = await fetch(getServerUrl("/admin/updateAdmin"), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sendAccessToken}`,
          },
          method: "PUT",
          body: JSON.stringify(sendData),
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to admin update");
        return res.json();
      },
      onSuccess: (data) => {
        if (data.ok && data.toUpdateInfo && data.accessToken) {
          const updatedInfo: LoginAdmin = {
            logined: true,
            ...data.toUpdateInfo,
          };

          setLoginState(updatedInfo);
          U.writeStringP(CT.CUSTOMER_ACCESS_TOKEN, data.accessToken);
          setADAlertState(
            updatedInfo.storeName + " 스토어의 정보 수정이 완료되었습니다."
          );
          callback && callback();
        } else {
          setADAlertState(data.errMsg ?? "스토어 정보를 찾을 수 없습니다.");
        }
      },
      onError: (err) => {
        setADAlertState(
          err?.message || "스토어 정보 수정중 문제가 발생했습니다."
        );
      },
    });
    return {
      mutateUpdateAdmin: mutate,
      isUpdateAdminPending: isPending,
    };
  };

  return {
    useCheckIdAvailability,
    useSignUp,
    useLogin,
    useRefreshCustomerLoginToken,
    useCustomerLogout,
    usePasswordChk,
    useCustomerUpdate,
    useCheckAdminIdAvailability,
    useAdminSignUp,
    useAdminLogin,
    useRefreshAdminLoginToken,
    useAdminLogout,
    useAdminPasswordChk,
    useAdminUpdate,
  };
};
