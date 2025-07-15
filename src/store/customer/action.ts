import type * as T from "./types";

export const loginCustomer = (payload: T.State): T.loginCustomerAction => ({
  type: "@customer/login",
  payload,
});

export const logoutCustomer = (): T.logoutCustomerAction => ({
  type: "@customer/logout",
});
