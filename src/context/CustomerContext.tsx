import type { FC, PropsWithChildren } from "react";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import * as U from "../utils";
import * as CT from "../constants";
import { useAlert } from "../components/alert";
import type { LoginCustomer } from "../type";
import type { AlertState } from "../components/alert/useAlert";

export type LoggedUser = { cid: string; password: string };
type Callback = () => void;

type ContextType = {
  // jwt?: string;
  // errorMessage?: string;
  searchCategory: string;
  loggedCustomer?: LoginCustomer;
  alertState: AlertState;
  setSearchCategory: (cate: CT.CategoryName) => void;
  setAlertState: React.Dispatch<React.SetStateAction<AlertState>>;
  setLoggedCustomer: (loginCustomer: LoginCustomer) => void;
};

export const CustomerContext = createContext<ContextType>({
  searchCategory: "empty",
  loggedCustomer: undefined,
  alertState: undefined,
  setSearchCategory: () => {},
  setAlertState: () => {},
  setLoggedCustomer: () => {},
});

type CustomerProviderProps = {};

export const CustomerProvider: FC<PropsWithChildren<CustomerProviderProps>> = ({
  children,
}) => {
  const [loggedCustomer, setLoggedCustomer] = useState<
    LoginCustomer | undefined
  >(undefined);
  const [searchCategory, setSearchCategory] =
    useState<CT.CategoryName>("empty");
  const [jwt, setJwt] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const { alertState, setAlertState } = useAlert();

  useEffect(() => {
    U.readStringP("jwt")
      .then((jwt) => setJwt(jwt ?? ""))
      .catch();
  }, []);

  const value = {
    jwt,
    searchCategory,
    loggedCustomer,
    alertState,
    setSearchCategory,
    setAlertState,
    setLoggedCustomer,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerPublic = () => {
  return useContext(CustomerContext);
};
