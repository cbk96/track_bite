import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { useAdminStore } from "./store";

interface Props {
  children: ReactNode;
}

export const SuperProvider: React.FC<Props> = ({ children }) => {
  const store = useAdminStore();
  return <Provider store={store}>{children}</Provider>;
};
