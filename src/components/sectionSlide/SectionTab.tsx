import { FC } from "react";

interface SectionTabProps {
  selectTabNum: number;
  setSelectTabNum: (value: React.SetStateAction<number>) => void;
  tabNames: string[];
  borderDirection?:
    | "border"
    | "borderTop"
    | "borderBottom"
    | "borderLeft"
    | "borderRight";
  borderWeight?: number;
  borderColor: string;
  disableBorder?: boolean;
  textColor: string;
  containerClassName?: string;
  tabClassName?: string;
}

export const SectionTab: FC<SectionTabProps> = ({
  selectTabNum,
  setSelectTabNum,
  tabNames,
  borderDirection = "border",
  borderWeight = 1,
  borderColor,
  disableBorder = false,
  textColor,
  containerClassName,
  tabClassName,
}) => {
  return (
    <div
      className={
        "flex justify-center mt-7 lg:pl-[56px] lg:pr-[56px] font-bold " +
        containerClassName
      }
    >
      {tabNames.length > 0 &&
        tabNames.map((tabName, index) => (
          <button
            type="button"
            key={index}
            className={"box-content " + tabClassName}
            onClick={() => setSelectTabNum(index)}
            style={{
              [borderDirection]:
                selectTabNum === index
                  ? borderWeight + "px solid " + borderColor
                  : disableBorder
                  ? borderWeight + "px solid #cccccc"
                  : "none",
            }}
          >
            <span
              className="inline-block leading-[44px]"
              style={{ color: selectTabNum === index ? textColor : "#666" }}
            >
              {tabName}
            </span>
          </button>
        ))}
    </div>
  );
};
