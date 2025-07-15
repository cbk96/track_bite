import type { Action } from "redux";
import type { LoginAdmin } from "../../type/adminInfoTypes";
import * as T from "../../type";
export * from "../../type";

export type State = T.Option[];

export type optionId = string;

export type deleteType = { condition: string; value: string };

export type addOptionACtion = Action<"@option/add"> & {
  payload: T.Option;
};

export type removeOptionACtion = Action<"@option/remove"> & {
  payload: string;
};

export type setOptionACtion = Action<"@option/set"> & {
  payload: State;
};

export type delteOptionAction = Action<"@option/delete"> & {
  payload: deleteType;
};

export type Actions =
  | addOptionACtion
  | removeOptionACtion
  | setOptionACtion
  | delteOptionAction;
