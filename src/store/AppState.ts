import * as AD from "./admin";
import * as CS from "./customer";
import * as CT from "./cart";

export type AppState = {
  loginAdmin: AD.State;
  loginCustomer: CS.State;
  cart: CT.State;
};
