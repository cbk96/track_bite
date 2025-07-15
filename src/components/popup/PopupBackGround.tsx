import { FC, PropsWithChildren, useRef, useEffect } from "react";
import type { PopupStatus } from "./usePopup";

type PopupBackGroundProps = {
  popupActive: PopupStatus;
  setPopupActive: (popupStatus: PopupStatus) => void;
};

export const PopupBackGround: FC<PropsWithChildren<PopupBackGroundProps>> = ({
  popupActive,
  setPopupActive,
  children,
}) => {
  const popUpBody = useRef<HTMLDivElement>(null);

  const popupClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setPopupActive({ active: false, popupId: "" });
    }
  };

  useEffect(() => {
    if (!popupActive.active) {
      popUpBody.current?.classList.add("hidden");
    } else {
      popUpBody.current?.classList.remove("hidden");
    }
  }, [popupActive, popUpBody]);

  return (
    <div
      ref={popUpBody}
      onClick={popupClose}
      className="flex items-end lg:items-center justify-center fixed top-0 left-0 min-w-[320px] w-screen h-screen bg-grayCustom z-[998] animate-fadeIn"
    >
      {children}
    </div>
  );
};

export default PopupBackGround;
