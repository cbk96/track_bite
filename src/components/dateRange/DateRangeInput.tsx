import { FC, ChangeEvent } from "react";
import type { DateRange } from "./useDateRange";
import * as U from "../../utils";

interface DateRangeInputProps {
  dateRange: DateRange;
  changeDateRange: (
    key: keyof DateRange
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
}

export const DateRangeInput: FC<DateRangeInputProps> = ({
  dateRange,
  changeDateRange,
}) => {
  return (
    <div className="flex items-center justify-between lg:justify-start mt-[20px]">
      <p className="relative p-1">
        <legend className="absolute pl-[5px] pr-[5px] top-[-5px] lg:top-[-3px] left-[12px] text-[11px] bg-white">
          시작
        </legend>
        <input
          type="date"
          value={U.dateFormat(dateRange.startDay)}
          onChange={changeDateRange("startDay")}
          className="p-1 pl-3 bg-white border-2 rounded-md"
        />
      </p>
      <span className="hidden pl-5 pr-5 lg:inline">~</span>
      <p className="relative p-1">
        <legend className="absolute pl-[5px] pr-[5px] top-[-5px] lg:top-[-3px] left-[12px] text-[11px] bg-white">
          마지막
        </legend>
        <input
          type="date"
          value={U.dateFormat(dateRange.endDay)}
          onChange={changeDateRange("endDay")}
          className="p-1 pl-3 bg-white border-2 rounded-md"
        />
      </p>
    </div>
  );
};
