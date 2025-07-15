import type { Action } from "redux";
import type { LoginAdmin } from "../../type/adminInfoTypes";
import * as T from "../../type";
export * from "../../type";

export type State = T.MenuGroup[];

export type menuGroupId = string;

export type addMenuGroupACtion = Action<"@menuGroup/add"> & {
  payload: State;
};

export type removeMenuGroupACtion = Action<"@menuGroup/remove"> & {
  payload: string;
};

export type setMenuGroupACtion = Action<"@menuGroup/set"> & {
  payload: State;
};

export type deleteMenuGroupAction = Action<"@menuGroup/delete"> & {
  payload: string;
};

export type Actions =
  | addMenuGroupACtion
  | removeMenuGroupACtion
  | setMenuGroupACtion
  | deleteMenuGroupAction;
