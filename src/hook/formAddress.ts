import { useState } from "react";

import { Address, initialAddress } from "../type";

export const useFormAddress = () => {
  const [formAddress, setFormAddress] =
    useState<Omit<Address, "detailedAddress">>(initialAddress);

  const setInitialAddress = (data: Omit<Address, "detailedAddress">) => {
    setFormAddress(() => ({
      zonecode: data.zonecode,
      sigunguCode: data.sigunguCode,
      address: data.address,
    }));
  };
  return { formAddress, setInitialAddress };
};
