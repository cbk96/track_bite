import * as T from "./types";
import { initialAddress } from "../../type";

const initialState: T.State = {
  logined: false,
  storeId: "",
  storePublicId: "",
  storeName: "",
  name: "",
  address: initialAddress,
  tel: "",
  category: "empty",
  inactive: true,
  businessType: "",
  businessNumber: "",
  paymentMethod: [],
  minOrderAmount: 0,
  deliveryFee: 0,
};

export const reducer = (state: T.State = initialState, action: T.Actions) => {
  switch (action.type) {
    case "@admin/login":
      return state;
    case "@admin/logout":
      return initialState;
  }
  return state;
};
