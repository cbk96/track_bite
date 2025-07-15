import { FC, useEffect } from "react";
import { PopupLayoutCust, PopupButton } from "../";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { PopupStatus } from "../";
import * as CT from "../../../constants";
import { AuthApi } from "../../../service";
import { ReactComponent as KeySecurity } from "../../../svg/key.svg";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";
import { LoginCustomer } from "../../../type";
import { useCustomerPublic } from "../../../context";

interface CartListPopupProps {
  setPopupActive: (popupStatus: PopupStatus) => void;
  setPasswordChk: (passwordChk: boolean) => void;
}

export const PasswordChkCustPopup: FC<CartListPopupProps> = ({
  setPopupActive,
  setPasswordChk,
}) => {
  const invisiblePopup = () => {
    setPopupActive({ active: false, popupId: "" });
  };

  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );

  const { setAlertState } = useCustomerPublic();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { customerId: "", password: "" } });

  const { usePasswordChk } = AuthApi();
  const { passChkData, mutatePassChk, isPassChkPending } =
    usePasswordChk(invisiblePopup);
  const navigate = useNavigate();

  const onCancel = () => {
    setPopupActive({ active: false, popupId: "" });
    navigate("/mypage");
  };

  const passwordChkComfirm = (data: {
    customerId: string;
    password: string;
  }) => {
    if (loginStatus.customerId === data.customerId) {
      mutatePassChk(data);
    } else {
      setAlertState("아이디가 일치하지 않습니다.");
    }
  };

  useEffect(() => {
    passChkData?.isCustomer
      ? setPasswordChk(passChkData?.isCustomer)
      : setPasswordChk(false);
  }, [passChkData]);

  return (
    <form
      onSubmit={handleSubmit(passwordChkComfirm)}
      className="w-screen lg:w-full"
    >
      <PopupLayoutCust title="비밀번호 확인">
        <div className="h-full p-10">
          <p>
            <KeySecurity className="mx-auto w-[200px]" />
          </p>
          <input
            {...register("customerId", {
              required: CT.custSignUpRules["customerId"].requiredMsg,
              minLength: {
                value: CT.custSignUpRules["customerId"].minLength,
                message: CT.custSignUpRules["customerId"].minLengthMsg,
              },
              maxLength: {
                value: CT.custSignUpRules["customerId"].maxLength,
                message: CT.custSignUpRules["customerId"].maxLengthMsg,
              },
            })}
            className="block w-full p-3 mt-10 border-2 rounded-full focus:outline-none focus:border-sub-cust"
            type="text"
            name="customerId"
            placeholder="아이디"
          />
          <p className="text-left text-red-500">{errors.customerId?.message}</p>
          <input
            {...register("password", {
              required: CT.custSignUpRules["password"].requiredMsg,
              minLength: {
                value: CT.custSignUpRules["password"].minLength,
                message: CT.custSignUpRules["password"].minLengthMsg,
              },
              maxLength: {
                value: CT.custSignUpRules["password"].maxLength,
                message: CT.custSignUpRules["password"].maxLengthMsg,
              },
            })}
            className="block w-full p-3 mt-3 border-2 rounded-full focus:outline-none focus:border-sub-cust"
            type="password"
            name="password"
            placeholder="비밀번호"
          />
          <p className="text-left text-red-500">{errors.password?.message}</p>
        </div>
        <PopupButton
          type="customer"
          confirmType="submit"
          cancelText="취소"
          handleCancel={onCancel}
          confirmText="비밀번호 확인"
        />
      </PopupLayoutCust>
    </form>
  );
};
