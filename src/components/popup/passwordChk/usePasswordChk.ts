import { useState } from "react";

export const usePasswordChk = () => {
  const [passwordChk, setPasswordChk] = useState<boolean>(false);

  return { passwordChk, setPasswordChk };
};
