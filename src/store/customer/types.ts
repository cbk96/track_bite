import type { Action } from "redux";
import type { LoginCustomer } from "../../type/customerInfoTypes";
export * from "../../type/customerInfoTypes";

export type State = LoginCustomer;

export type loginCustomerAction = Action<"@customer/login"> & {
  payload: State;
};

export type logoutCustomerAction = Action<"@customer/logout">;

export type Actions = loginCustomerAction | logoutCustomerAction;
