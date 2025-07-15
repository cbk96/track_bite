import type * as T from "./types";

export const addCart = (payload: T.Cart): T.addCartACtion => ({
  type: "@cart/add",
  payload,
});

export const setCart = (payload: T.State): T.setCartACtion => ({
  type: "@cart/set",
  payload,
});
