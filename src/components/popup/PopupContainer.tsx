import { Children, FC, PropsWithChildren } from "react";
import type { PopupStatus } from "./usePopup";

interface PopupContainerProp {
  popupId: string;
  popupActive: PopupStatus;
}

export const PopupContainer: FC<PropsWithChildren<PopupContainerProp>> = ({
  popupId,
  popupActive,
  children,
}) => {
  return (
    <div
      className={` ${
        popupActive.active && popupId === popupActive.popupId
          ? "block"
          : "hidden"
      } ${popupActive.active ? "animate-fadeUp" : ""}`}
    >
      {children}
    </div>
  );
};
