import type { Action } from "redux";
import type { LoginAdmin } from "../../type/adminInfoTypes";
import * as T from "../../type";
export * from "../../type";

export type State = T.Menu[];

export type menuId = string;

export type deleteType = { condition: string; value: string };

export type addMenuACtion = Action<"@menu/add"> & {
  payload: T.Menu;
};

export type setMenuACtion = Action<"@menu/set"> & {
  payload: State;
};

export type delteMenuAction = Action<"@menu/delete"> & {
  payload: deleteType;
};

export type Actions = addMenuACtion | setMenuACtion | delteMenuAction;
