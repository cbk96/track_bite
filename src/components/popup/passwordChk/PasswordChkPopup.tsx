import { FC, useEffect, useState } from "react";
import { PopupLayoutAdmin, PopupButton } from "../";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAdminContext } from "../../../context";
import type { PopupStatus } from "../";
import * as CT from "../../../constants";
import { AuthApi } from "../../../service";
import { ReactComponent as KeySecurity } from "../../../svg/key.svg";

interface CartListPopupProps {
  setPopupActive: (popupStatus: PopupStatus) => void;
  setPasswordChk: (passwordChk: boolean) => void;
}

export const PasswordChkPopup: FC<CartListPopupProps> = ({
  setPopupActive,
  setPasswordChk,
}) => {
  const invisiblePopup = () => {
    setPopupActive({ active: false, popupId: "" });
  };

  const { loginState, setAlertState } = useAdminContext();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { storeId: "", password: "" } });
  const { useAdminPasswordChk } = AuthApi();
  const { passChkData, mutatePassChk } = useAdminPasswordChk(invisiblePopup);
  const navigate = useNavigate();

  const onCancel = () => {
    setPopupActive({ active: false, popupId: "" });
    navigate("/admin");
  };

  const passwordChkComfirm = (data: { storeId: string; password: string }) => {
    if (loginState.storeId === data.storeId) {
      mutatePassChk(data);
    } else {
      setAlertState("아이디가 일치하지 않습니다.");
    }
  };

  useEffect(() => {
    passChkData?.isAdmin
      ? setPasswordChk(passChkData?.isAdmin)
      : setPasswordChk(false);
  }, [passChkData]);

  return (
    <form
      onSubmit={handleSubmit(passwordChkComfirm)}
      className="w-screen lg:w-full"
    >
      <PopupLayoutAdmin title="비밀번호 확인">
        <div className="h-full p-10">
          <p>
            <KeySecurity className="mx-auto w-[200px]" />
          </p>
          <input
            {...register("storeId", {
              required: CT.adminSignUpRules["storeId"].requiredMsg,
              minLength: {
                value: CT.adminSignUpRules["storeId"].minLength,
                message: CT.adminSignUpRules["storeId"].minLengthMsg,
              },
              maxLength: {
                value: CT.adminSignUpRules["storeId"].maxLength,
                message: CT.adminSignUpRules["storeId"].maxLengthMsg,
              },
            })}
            className="block w-full p-3 mt-10 border-2 rounded-full focus:outline-none focus:border-sub"
            type="text"
            name="storeId"
            placeholder="아이디"
          />
          <p className="text-left text-red-500">{errors.storeId?.message}</p>
          <input
            {...register("password", {
              required: CT.adminSignUpRules["password"].requiredMsg,
              minLength: {
                value: CT.adminSignUpRules["password"].minLength,
                message: CT.adminSignUpRules["password"].minLengthMsg,
              },
              maxLength: {
                value: CT.adminSignUpRules["password"].maxLength,
                message: CT.adminSignUpRules["password"].maxLengthMsg,
              },
            })}
            className="block w-full p-3 mt-3 border-2 rounded-full focus:outline-none focus:border-sub"
            type="password"
            name="password"
            placeholder="비밀번호"
          />
          <p className="text-left text-red-500">{errors.password?.message}</p>
        </div>
        <PopupButton
          type="admin"
          confirmType="submit"
          cancelText="취소"
          handleCancel={onCancel}
          confirmText="비밀번호 확인"
        />
      </PopupLayoutAdmin>
    </form>
  );
};
