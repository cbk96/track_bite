import { FC, useEffect, useState } from "react";
import { CartListView } from "./";
import { PopupButton } from "../popup";
import { useCartList } from "./";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { isStoreOpen } from "../../utils";
import * as T from "../../type";
import type { AppState } from "../../store";
import type { LoginCustomer, StorePublicInfo } from "../../type";
import { StoreApi } from "../../service";

interface CartListLayoutProps {
  storeInfo: StorePublicInfo;
}

export function CartListLayout({ storeInfo }: CartListLayoutProps) {
  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );

  const { purchseConfirm } = useCartList("ALL#STORE");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [operatingHours, setOperatingHours] = useState<T.OperatingHours[]>(
    T.initialOperatingHours
  );

  const { useGetOperatingHours } = StoreApi();
  useGetOperatingHours(storeInfo.storePublicId ?? "", setOperatingHours);

  return (
    <form onSubmit={handleSubmit(purchseConfirm)}>
      <div className="max-w-[330px] w-full bg-white border-2 rounded-xl overflow-hidden">
        <p className="h-[45px] leading-[45px] text-center font-bold text-white bg-sub-cust">
          장바구니
        </p>
        <div className="h-[500px]">
          <CartListView
            displayMode="panel"
            storePublicId={storeInfo.storePublicId}
            className="h-full"
          />
        </div>
      </div>
    </form>
  );
}

export default CartListLayout;
