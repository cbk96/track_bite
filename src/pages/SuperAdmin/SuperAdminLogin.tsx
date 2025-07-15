import type { ChangeEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FetchButton } from "../../components";
import { SuperAdminApi } from "../../service";

type LoginInsert = {
  sAdminId: string;
  password: string;
};

export function SuperAdminLogin() {
  const [inputLoginInfo, setInputLoginInfo] = useState<{
    sAdminId: string;
    password: string;
  }>({ sAdminId: "", password: "" });

  const changeInfo =
    (key: "sAdminId" | "password") => (e: ChangeEvent<HTMLInputElement>) => {
      setInputLoginInfo((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const navigate = useNavigate();
  const { useSuperAdminLogin } = SuperAdminApi();
  const { mutateSLogin, isSLoginPending } = useSuperAdminLogin(() =>
    navigate("/superadmin")
  );

  const loginConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutateSLogin(inputLoginInfo);
  };

  return (
    <section className="flex items-center justify-center h-screen">
      <div className="p-10 mx-5 w-[450px] border-2 rounded-xl text-center shadow-[0_5px_8px_rgba(0,0,0,0.1)]">
        <div>
          <p className="mr-3 text-[32px] text-main font-josefin font-bold">
            Track Bite
          </p>
          <p className="mt-3 text-2xl font-bold">앱 관리자 로그인</p>
        </div>
        <form onSubmit={loginConfirm}>
          <input
            value={inputLoginInfo.sAdminId}
            onChange={changeInfo("sAdminId")}
            className="block w-full p-3 mt-10 border-2 rounded-full focus:outline-none focus:border-sub"
            type="text"
            name="sAdminId"
            placeholder="아이디"
          />
          <input
            value={inputLoginInfo.password}
            onChange={changeInfo("password")}
            className="block w-full p-3 mt-3 border-2 rounded-full focus:outline-none focus:border-sub"
            type="password"
            name="password"
            placeholder="비밀번호"
          />

          <FetchButton
            type="submit"
            isFetching={isSLoginPending}
            className="w-full p-3 mt-5 text-lg font-bold text-white rounded-md bg-main hover:bg-main-hover"
          >
            앱 관리자 로그인
          </FetchButton>
        </form>
      </div>
    </section>
  );
}

export default SuperAdminLogin;
