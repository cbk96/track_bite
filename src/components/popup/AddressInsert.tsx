import { FC } from "react";
import { PopupButton, PopupLayoutCust } from "../";
import * as T from "../../type";
import type { PopupStatus } from "../";
import DaumPostcode from "react-daum-postcode";

interface AddressInsertPopupProps {
  type?: "customer" | "admin";
  popupActive: PopupStatus;
  setPopupActive: (popupStatus: PopupStatus) => void;
  onComplete: (data: Omit<T.Address, "detailedAddress">) => void;
}

export const AddressInsertPopup: FC<AddressInsertPopupProps> = ({
  type = "customer",
  popupActive,
  setPopupActive,
  onComplete,
}) => {
  return popupActive.active ? (
    <section className="min-w-[320px] w-screen lg:w-full">
      <PopupLayoutCust title="주소 입력">
        <DaumPostcode style={{ height: "100%" }} onComplete={onComplete} />
        <PopupButton
          cancelText="취소"
          type={type}
          handleCancel={() => setPopupActive({ active: false, popupId: "" })}
        />
      </PopupLayoutCust>
    </section>
  ) : (
    <></>
  );
};
