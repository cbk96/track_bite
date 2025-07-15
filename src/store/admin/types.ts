import type { Action } from "redux";
import type { LoginAdmin } from "../../type/adminInfoTypes";
export * from "../../type/customerInfoTypes";

export type State = LoginAdmin;

export type loginAdminAction = Action<"@admin/login"> & {
  payload: State;
};

export type logoutAdminAction = Action<"@admin/logout"> & {
  payload: string;
};

export type Actions = loginAdminAction | logoutAdminAction;
