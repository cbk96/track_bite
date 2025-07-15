import * as T from "./types";
import * as IT from "../../type";

const initialState: T.State = {
  logined: "guest",
  customerId: "",
  name: "",
  prefer: "empty",
  tel: "",
  inactive: false,
  address: IT.initialAddress,
  email: "",
};

export const reducer = (state: T.State = initialState, action: T.Actions) => {
  switch (action.type) {
    case "@customer/login":
      return action.payload;
    case "@customer/logout":
      return initialState;
  }
  return state;
};
