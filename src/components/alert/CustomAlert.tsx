import { FC, useEffect } from "react";
import type { AlertState } from "./useAlert";

interface CustomAlertProps {
  alertState: AlertState;
  userRole: "customer" | "admin";
  setAlertState: React.Dispatch<React.SetStateAction<AlertState>>;
}

export const CustomAlert: FC<CustomAlertProps> = ({
  alertState,
  userRole,
  setAlertState,
}) => {
  return alertState !== undefined ? (
    <div className="flex items-center justify-center fixed top-0 left-0 w-screen h-screen bg-grayCustom z-[999] animate-fadeIn">
      <div
        className={`flex flex-col items-center justify-center p-3 pl-10 pr-10 w-[400px] min-h-[2px] rounded-xl bg-white ${
          alertState !== undefined ? "animate-fadeUp" : ""
        }`}
      >
        <span className="flex-grow inline-block pt-[80px] pb-[80px] font-bold text-center">
          {alertState !== undefined ? alertState : ""}
        </span>
        <button
          className={`w-[180px] ${
            userRole === "admin"
              ? "bg-main hover:bg-main-hover"
              : "bg-main-cust hover:bg-main-cust-hover"
          }  leading-[45px] text-white font-bold rounded-full`}
          onClick={() => setAlertState(undefined)}
        >
          확인
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
};
