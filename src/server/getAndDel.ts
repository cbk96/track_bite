import { getServerUrl } from "./getServerUrl";
import * as CT from "../constants";
import * as U from "../utils";

const getAndDel = (
  methodName: string,
  path: string,
  jwt?: string | null | undefined
) => {
  let headers = { "Content-Type": "application/json" };
  let init: RequestInit = {
    method: methodName,
  };
  if (jwt) {
    init = {
      ...init,
      headers: { ...headers, Authorization: `Bearer ${jwt}` },
    };
  } else {
    init = { ...init, headers };
  }
  return fetch(getServerUrl(path), init);
};

const secureFetch =
  (methodName: string) =>
  async (path: string, jwtKey?: string | null | undefined) => {
    let accessToken = localStorage.getItem(jwtKey ?? "");
    let response = await getAndDel(methodName, path, accessToken);

    const refreshPath =
      jwtKey === CT.CUSTOMER_ACCESS_TOKEN
        ? "/refreshCustToken"
        : jwtKey === CT.ADMIN_ACCESS_TOKEN
        ? "/admin/refreshAdminToken"
        : "";

    const accessDeniedPath =
      jwtKey === CT.CUSTOMER_ACCESS_TOKEN
        ? "/login"
        : jwtKey === CT.ADMIN_ACCESS_TOKEN
        ? "/admin/login"
        : jwtKey === CT.ADMIN_ACCESS_TOKEN
        ? "superadmin/login"
        : "/";

    if (response.status === 401 && refreshPath !== "") {
      // access token 만료됨 → 재발급 시도
      const refreshRes = await fetch(getServerUrl(refreshPath), {
        method: "POST",
        credentials: "include", // refresh token 쿠키 전송용
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        accessToken = data.accessToken;
        if (accessToken && jwtKey) {
          U.writeStringP(jwtKey, accessToken);

          // 재발급 성공하면 원래 요청 재시도
          response = await getAndDel(methodName, path, accessToken);
        }
      } else {
        // 재발급 실패하면 로그인 페이지 이동 또는 에러 처리
        window.location.href = accessDeniedPath;
        throw new Error("Unauthorized - please login again.");
      }
    }

    return response;
  };

export const get = secureFetch("GET");
export const del = secureFetch("DELETE");
