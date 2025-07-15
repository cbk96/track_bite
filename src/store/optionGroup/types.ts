import type { Action } from "redux";
import type { LoginAdmin } from "../../type/adminInfoTypes";
import * as T from "../../type";
export * from "../../type";

export type State = T.OptionGroup[];

export type optionGroupId = string;

export type addOptionGroupACtion = Action<"@optionGroup/add"> & {
  payload: State;
};

export type removeOptionGroupACtion = Action<"@optionGroup/remove"> & {
  payload: string;
};

export type setOptionGroupACtion = Action<"@optionGroup/set"> & {
  payload: State;
};

export type deleteOptionGroupAction = Action<"@optionGroup/delete"> & {
  payload: string;
};

export type Actions =
  | addOptionGroupACtion
  | removeOptionGroupACtion
  | setOptionGroupACtion
  | deleteOptionGroupAction;
