import type { Action } from "redux";
import type { LoginAdmin } from "../../type/adminInfoTypes";
import type * as T from "../../type";
export * from "../../type";

export type State = T.Cart[];

export type deleteType = { condition: string; value: string };

export type addCartACtion = Action<"@cart/add"> & {
  payload: T.Cart;
};

export type setCartACtion = Action<"@cart/set"> & {
  payload: State;
};

export type Actions = addCartACtion | setCartACtion;
