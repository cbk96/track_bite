import type { Address } from "../type/commonTypes";

export const addressEmptyChk = (inputAddress: Address | undefined) => {
  const chk =
    inputAddress === undefined
      ? false
      : inputAddress.zonecode.trim() !== "" &&
        inputAddress.sigunguCode.trim() !== "" &&
        inputAddress.address.trim() !== "" &&
        inputAddress.detailedAddress.trim() !== "";
  return chk;
};
