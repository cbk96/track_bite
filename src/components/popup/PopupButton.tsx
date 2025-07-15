import { FC } from "react";

interface props {
  type?: "admin" | "customer";
  confirmType?: "submit" | "button";
  confirmText?: string;
  cancelText?: string;
  confirmDisablde?: boolean;
  handleCancel?: () => void;
}

export const PopupButton: FC<props> = ({
  type = "customer",
  confirmType = "submit",
  confirmText,
  confirmDisablde = false,
  cancelText,
  handleCancel,
}) => {
  return (
    <p className="flex w-full font-bold text-center text-white leading-[50px]">
      {handleCancel && cancelText && (
        <button
          type="button"
          className={`flex-1 ${
            type === "admin"
              ? "bg-sub hover:bg-sub-hover"
              : "bg-sub-cust hover:bg-sub-cust-hover"
          }`}
          onClick={handleCancel}
        >
          {cancelText}
        </button>
      )}
      {confirmText && (
        <button
          disabled={confirmDisablde}
          className={`flex-1 text-wrap ${
            confirmDisablde
              ? "bg-gray-100 text-grayCustom text-[10px]"
              : type === "admin"
              ? "bg-main hover:bg-main-hover"
              : "bg-main-cust hover:bg-main-cust-hover"
          } `}
          type={confirmType}
        >
          {confirmText}
        </button>
      )}
    </p>
  );
};
