import {
  FC,
  useEffect,
  useState,
  useRef,
  PropsWithChildren,
  useCallback,
} from "react";
import type { Option, OptionPublicInfo } from "../../type";
import { Circle } from "phosphor-react";

interface ToggleBoxProps {
  name: string;
  values: OptionPublicInfo[] | Option[];
  onChange: (selectedOptionId: string[], optionGroupId: string) => void;
  required: boolean;
  selectionType: "single" | "multi";
  className?: string;
}

export const ToggleBox: FC<PropsWithChildren<ToggleBoxProps>> = ({
  name,
  values,
  onChange,
  required,
  selectionType,
  className,
}) => {
  const [cumulaValue, setCumulaValue] = useState<string[]>([]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const buttonColor = required ? "border-[#ce1224]" : "border-[#ba8618]";
  const backgColor = required
    ? "peer-checked:bg-[#ce1224]"
    : "peer-checked:bg-[#ba8618]";

  const toggleClick = useCallback(
    (optionId: string) => {
      if (cumulaValue.includes(optionId)) {
        if (required) {
          if (cumulaValue.length >= 2) {
            const removedValue = cumulaValue.filter(
              (prevValue) => prevValue !== optionId
            );
            setCumulaValue(removedValue);
          }
        } else {
          const removedValue = cumulaValue.filter(
            (prevValue) => prevValue !== optionId
          );
          setCumulaValue(removedValue);
        }
      } else {
        if (selectionType === "single") {
          const newValue = new Array(optionId);
          setCumulaValue(newValue);
        } else {
          setCumulaValue((prevValue) => [...prevValue, optionId]);
        }
      }
    },
    [values, cumulaValue]
  );

  useEffect(() => {
    if (required) {
      const firstValue = new Array(values[0].optionId);
      setCumulaValue(firstValue);
    } else {
      setCumulaValue([]);
    }
  }, [values]);

  useEffect(() => {
    onChange(cumulaValue, values[values.length - 1].optionGroupId);
  }, [cumulaValue]);

  return (
    <>
      {values.map((value, index) => {
        return (
          <div key={value.optionId} className="flex justify-between mb-4">
            <p className="flex items-center">
              <label
                htmlFor={value.optionId}
                className={
                  `flex items-center justify-center mr-2 w-[20px] h-[20px] text-center bg-white border-2 
                   ${
                     selectionType === "single" ? "rounded-full" : "rounded-md"
                   } cursor-pointer ` + buttonColor
                }
              >
                <input
                  ref={(el) => {
                    refs.current[index] = el;
                  }}
                  type="checkbox"
                  name={name}
                  id={value.optionId}
                  onChange={() => toggleClick(value.optionId)}
                  value={value.optionId}
                  checked={cumulaValue.includes(value.optionId)}
                  className={`hidden peer ` + className}
                ></input>
                <span
                  className={
                    `inline-block w-[12px] h-[12px] ${
                      selectionType === "single" ? "rounded-full" : "rounded-sm"
                    } ` +
                    backgColor +
                    ` ` +
                    className
                  }
                ></span>
              </label>
              <span>{value.optionName}</span>
            </p>
            <span className="text-[14px]">
              {value.price == 0 ? "추가비용 없음" : "+" + value.price + "원"}
            </span>
          </div>
        );
      })}
    </>
  );
};

export default ToggleBox;
