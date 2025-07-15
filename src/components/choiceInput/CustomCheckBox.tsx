import { FC, ChangeEvent } from "react";

interface CustomCheckBoxProps {
  id: string;
  name: string;
  value: string | number;
  selectedValues: (string | number)[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
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

export const CustomCheckBox: FC<CustomCheckBoxProps> = ({
  id,
  name,
  value,
  selectedValues,
  onChange,
  fieldName,
  fontWeight,
  className,
  ...rest
}) => {
  const classNames = className + " inline-block h-[34px] ";
  return (
    <span className={classNames}>
      <label htmlFor={id} className="flex cursor-pointer itmes-center">
        <span className="flex items-center align-middle my-auto w-[30px] h-[30px] border-[2px] bg-white border-sub rounded-full">
          <input
            {...rest}
            type="checkbox"
            id={id}
            name={name}
            value={value}
            checked={selectedValues.includes(value)}
            onChange={onChange}
            className="hidden peer"
          />
          <span className="inline-block m-[3px] w-[20px] h-[20px] rounded-full bg-white peer-checked:bg-sub"></span>
        </span>
        <span className={`inline-block ml-2 align-middle ${fontWeight}`}>
          {fieldName}
        </span>
      </label>
    </span>
  );
};
