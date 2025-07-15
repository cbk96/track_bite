import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCustomerPublic } from "../context";
import { CustomAlert, useAlert } from "../components/alert";

export function WrongPath() {
  const navigate = useNavigate();
  const { setAlertState, alertState } = useAlert();

  useEffect(() => {
    setAlertState("잘못된 접근입니다.");
    navigate("/");
  }, []);

  return (
    <>
      <div>잘못된 접근입니다.</div>
      <Link to="/">메인화면으로</Link>
      <CustomAlert
        userRole="customer"
        alertState={alertState}
        setAlertState={setAlertState}
      />
    </>
  );
}

export default WrongPath;
