import React, { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { useStore } from "./store";

interface Props {
  children: ReactNode;
}

export const AppProviders: React.FC<Props> = ({ children }) => {
  const store = useStore();
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
  //상태를 전역 관리하기 위해 리덕스 프로바이더의 store 속성에 store 객체를 설정
};
