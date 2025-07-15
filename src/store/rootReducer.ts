import { combineReducers } from "redux";
import * as AD from "./admin";
import * as CS from "./customer";
import * as CT from "./cart";

export const rootReducer = combineReducers({
  loginAdmin: AD.reducer,
  loginCustomer: CS.reducer,
  cart: CT.reducer,
});
