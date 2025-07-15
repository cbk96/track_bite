import { useState } from "react";

export type PopupStatus = {
  active: boolean;
  popupId: string;
};

const initialPopupStatus: PopupStatus = {
  active: false,
  popupId: "",
};

export const usePopup = () => {
  const [popupActive, setPopupActive] =
    useState<PopupStatus>(initialPopupStatus);

  return { popupActive, setPopupActive };
};
