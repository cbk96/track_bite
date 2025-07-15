import type { ChangeEvent } from "react";
import { useState, useCallback } from "react";
import { useAdminContext } from "../../context";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FetchButton } from "../../components";
import { CustomAlert } from "../../components/alert";
import { useForm } from "react-hook-form";
import { AuthApi } from "../../service";
import * as CT from "../../constants";

type LoginInsert = {
  storeId: string;
  password: string;
};

export function AdminLogin() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { storeId: "", password: "" },
  });

  const navigate = useNavigate();
  const { alertState, setAlertState } = useAdminContext();
  const { useAdminLogin } = AuthApi();
  const { mutateLogin, isLoginPending } = useAdminLogin(() =>
    navigate("/admin")
  );

  const loginConfirm = (data: LoginInsert) => {
    mutateLogin(data);
  };

  return (
    <section className="flex items-center justify-center h-screen">
      <div className="p-10 mx-5 w-[450px] border-2 rounded-xl text-center shadow-[0_5px_8px_rgba(0,0,0,0.1)]">
        <div>
          <p className="mr-3 text-[32px] text-main font-josefin font-bold">
            Track Bite
          </p>
          <p className="mt-3 text-2xl font-bold">가맹점 로그인</p>
        </div>
        <form onSubmit={handleSubmit(loginConfirm)}>
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
          <div className="flex justify-end p-3">
            <Link to="/admin/signup" className="text-[#666]">
              가맹점 등록 신청
            </Link>
          </div>
          <FetchButton
            type="submit"
            isFetching={isLoginPending}
            className="w-full p-3 mt-5 text-lg font-bold text-white rounded-md bg-main hover:bg-main-hover"
          >
            가맹점 로그인
          </FetchButton>
        </form>
      </div>
      <CustomAlert
        userRole="admin"
        alertState={alertState}
        setAlertState={setAlertState}
      />
    </section>
  );
}

export default AdminLogin;
