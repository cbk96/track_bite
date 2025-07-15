import type { ChangeEvent } from "react";
import { useState, useCallback } from "react";
import { useCustomerPublic } from "../context";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FetchButton } from "../components";
import { CustomAlert } from "../components/alert";
import { useForm } from "react-hook-form";
import { AuthApi } from "../service";
import * as CT from "../constants";

type LoginInsert = {
  customerId: string;
  password: string;
};

export function Login() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { customerId: "", password: "" },
  });

  const navigate = useNavigate();
  const { alertState, setAlertState } = useCustomerPublic();
  const { useLogin } = AuthApi();
  const { mutateLogin, isLoginPending } = useLogin(() => navigate("/"));

  const loginConfirm = (data: LoginInsert) => {
    mutateLogin(data);
  };

  return (
    <section className="flex items-center justify-center h-screen">
      <div className="p-10 mx-5 w-[450px] border-2 rounded-xl text-center shadow-[0_5px_8px_rgba(0,0,0,0.1)]">
        <div>
          <p className="mr-3 text-[32px] text-main-cust font-josefin font-bold">
            Track Bite
          </p>
          <p className="mt-3 text-2xl font-bold">로그인</p>
        </div>
        <form onSubmit={handleSubmit(loginConfirm)}>
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
          <div className="flex justify-end p-3">
            <Link to="/signup" className="text-[#666]">
              회원가입
            </Link>
          </div>
          <FetchButton
            type="submit"
            isFetching={isLoginPending}
            className="w-full p-3 mt-5 text-lg font-bold text-white rounded-md bg-main-cust hover:bg-main-cust-hover"
          >
            로그인
          </FetchButton>
        </form>
      </div>
      <CustomAlert
        userRole="customer"
        alertState={alertState}
        setAlertState={setAlertState}
      />
    </section>
  );
}

export default Login;
