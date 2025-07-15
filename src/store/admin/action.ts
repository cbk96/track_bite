import type * as T from "./types";

export const loginAdmin = (payload: T.State): T.loginAdminAction => ({
  type: "@admin/login",
  payload,
});

export const logoutAdmin = (payload: T.LoginId): T.logoutAdminAction => ({
  type: "@admin/logout",
  payload,
});
