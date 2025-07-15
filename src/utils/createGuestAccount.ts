import { useDispatch, useSelector } from "react-redux";
import { LoginCustomer } from "../type";
import * as T from "../type";
import { AppState } from "../store";
import * as CS from "../store/customer";

export const createGuestAccount = () => {
  const timestamp = new Date().getTime();
  const randomSuffix = Math.floor(Math.random() * 1000);
  const createGuestId = `GUEST_ID-${timestamp}-${randomSuffix}`;

  const guestStatus: LoginCustomer = {
    logined: "guest",
    customerId: createGuestId,
    name: "guest",
    inactive: false,
    tel: "",
    address: T.initialAddress,
    prefer: "empty",
    email: "",
  };

  return guestStatus;
};

export const createGuestAccountAndAddress = (
  loginStatus: LoginCustomer,
  data: Omit<T.Address, "detailedAddress">
) => {
  let createdCustomer: T.LoginCustomer = T.initialLoginCustomer;

  if (
    !loginStatus ||
    loginStatus.customerId === "" ||
    loginStatus.customerId === undefined
  ) {
    const createGuestAcc = createGuestAccount();
    const guestAccount = {
      ...createGuestAcc,
      address: {
        zonecode: data.zonecode,
        sigunguCode: data.sigunguCode,
        address: data.address,
        detailedAddress: "",
      },
    };
    createdCustomer = guestAccount;
  } else {
    const updateLoginStatus: T.LoginCustomer = {
      ...loginStatus,
      address: {
        zonecode: data.zonecode,
        sigunguCode: data.sigunguCode,
        address: data.address,
        detailedAddress: "",
      },
    };
    createdCustomer = updateLoginStatus;
  }

  return createdCustomer;
};
