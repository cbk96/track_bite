import { FC, ChangeEvent } from "react";

interface CustomRadioProps {
  id: string;
  name: string;
  value: string | number | boolean;
  selectedValue: string | number | boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  fieldName?: string;
  fontWeight?:
    | ""
    | "font-thin"
    | "font-extralight"
    | "font-light"
    | "font-normal"
    | "font-medium"
    | "font-semibold"
    | "font-bold"
    | "font-extrabold"
    | "font-black";
  className?: string;
}

export const CustomRadio: FC<CustomRadioProps> = ({
  id,
  name,
  value,
  selectedValue,
  onChange,
  fieldName,
  fontWeight,
  className,
}) => {
  const classNames = className + " inline-block h-[34px] ";
  return (
    <span className={classNames}>
      <label htmlFor={id} className="inline-block  h-[30px]  cursor-pointer">
        <span className="inline-block align-middle w-[30px] h-[30px] border-[2px] bg-white border-sub rounded-full">
          <input
            type="radio"
            id={id}
            name={name}
            value={String(value)}
            checked={selectedValue === value}
            onChange={onChange}
            className="hidden peer"
          />
          <span className="inline-block m-[3px] w-[20px] h-[20px] rounded-full bg-white peer-checked:bg-sub"></span>
        </span>
        <span className={`ml-2 align-middle ${fontWeight}`}>{fieldName}</span>
      </label>
    </span>
  );
};
