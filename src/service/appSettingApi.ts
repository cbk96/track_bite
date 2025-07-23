import { useState, useCallback } from "react";
import { get } from "../server";
import type { AppSettings } from "../type";
import { useMutation } from "@tanstack/react-query";

type Callback = () => void;

export const AppSettingApi = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [appInfo, setAppInfo] = useState<AppSettings>();

  const getAppSetting = useCallback((callback?: Callback) => {
    get("/appSetting/getAppSetting")
      .then((res) => res.json())
      .then(
        (result: { ok: boolean; appInfo: AppSettings; errorMsg: string }) => {
          if (result.ok && result.appInfo !== undefined) {
            setAppInfo(result.appInfo);
            callback && callback();
          } else {
            console.log(result.errorMsg);
          }
        }
      )
      .catch((e: Error) => setErrorMessage(e.message ?? ""));
  }, []);

  const useKeepWork = () => {
    const { mutate } = useMutation({
      mutationFn: () => get("/appSetting/keep"),
    });
    return { keepMutate: mutate };
  };

  return { getAppSetting, useKeepWork, appInfo };
};
