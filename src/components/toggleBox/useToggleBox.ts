import { useState } from "react";

export const useToggleBox = (
  selectedValue: string,
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>
) => {
  const [radioValue, setRadioValue] = useState<string>("");

  const toggleClick = (
    e: React.MouseEvent<HTMLElement>,
    thisValue: string | number | readonly string[] | undefined
  ) => {
    if (thisValue !== selectedValue) {
      setSelectedValue(String(thisValue));
    } else {
      setSelectedValue("");
    }
  };

  const radioClick = (
    e: React.MouseEvent<HTMLElement>,
    thisValue: string | number | readonly string[] | undefined
  ) => {
    setSelectedValue(String(thisValue));
  };

  return { toggleClick, radioClick };
};
