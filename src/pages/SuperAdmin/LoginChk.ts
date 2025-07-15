import { useEffect } from "react";
import { useSuperAdminContext } from "../../context";
import { useNavigate } from "react-router-dom";

export const LoignChk = () => {
  const { loginState } = useSuperAdminContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loginState.logined) {
      alert("로그인 데이터가 없습니다.");
      navigate("/superadmin/login");
    }
  }, []);
};
