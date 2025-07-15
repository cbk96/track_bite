import { FC } from "react";
import { PopupLayoutCust, CartListView } from "../";
import { PopupButton } from "./PopupButton";
import { useCartList } from "../";
import { useForm } from "react-hook-form";
import type { PopupStatus } from "../";

interface CartListPopupProps {
  setPopupActive: (popupStatus: PopupStatus) => void;
  storePublicId?: "ALL#STORE" | string;
  className?: string;
}

export const CartListPopup: FC<CartListPopupProps> = ({
  setPopupActive,
  storePublicId = "ALL#STORE",
  className,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onCancel = () => {
    setPopupActive({ popupId: "", active: false });
  };

  const { purchseConfirm } = useCartList("ALL#STORE");

  return (
    <form
      onSubmit={handleSubmit(purchseConfirm)}
      className={`min-w-[320px] w-screen lg:w-full ${className}`}
    >
      <PopupLayoutCust title="장바구니">
        <CartListView
          displayMode="popup"
          displayCancel={onCancel}
          storePublicId={storePublicId}
          className="h-[calc(100%-57px)]"
        />
      </PopupLayoutCust>
    </form>
  );
};
