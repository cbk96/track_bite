import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { useStore } from "./store";

interface Props {
  children: ReactNode;
}

export const CustomerStoreProvider: React.FC<Props> = ({ children }) => {
  const store = useStore();
  return <Provider store={store}>{children}</Provider>;
};
