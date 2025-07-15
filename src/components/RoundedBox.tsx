import type { FC, PropsWithChildren } from "react";

import { Link } from "react-router-dom";
interface RoundedBoxProps {
  title?: string;
  underLine?: boolean;
  modifyText?: string;
  modifyLink?: string;
  modifyType?: "link" | "inline";
  modifyState?: boolean;
  modifySetState?: (active: boolean) => void;
  modifyConfirm?: () => {};
  className?: string;
}

export const RoundedBox: FC<PropsWithChildren<RoundedBoxProps>> = ({
  title,
  modifyText,
  underLine = true,
  modifyLink,
  modifyType = "link",
  modifyState,
  modifySetState,
  modifyConfirm,
  children,
  className,
  ...props
}) => {
  let modifyToLink = "";
  let basicClassName =
    "relative mx-3 lg:mx-auto mb-5 pt-3 px-[20px] lg:px-[57px] min-h-[150px] lg:min-h-[200px] bg-white rounded-lg border-2";

  const prevTitleUnderlineClassNames =
    "pr-5 py-3 font-bold flex justify-between ";

  let titleUnderlineClassNames = "";

  if (className !== "") {
    basicClassName += " " + className;
  }

  if (modifyLink !== undefined && modifyLink !== "") {
    modifyToLink = modifyLink;
  }

  if (underLine) {
    titleUnderlineClassNames = prevTitleUnderlineClassNames + " border-b-2";
  } else {
    titleUnderlineClassNames = prevTitleUnderlineClassNames;
  }

  return (
    <div {...props} className={basicClassName}>
      <p className={titleUnderlineClassNames}>
        {title !== undefined && title !== "" && (
          <span className="text-[16px]">{title}</span>
        )}
        <span className="text-main">
          {modifyType === "link" &&
            modifyToLink !== "" &&
            modifyLink !== undefined && (
              <Link to={modifyToLink}>{modifyText} &gt;</Link>
            )}
          {modifyType === "inline" &&
            modifyState !== undefined &&
            !modifyState &&
            modifySetState !== undefined && (
              <button onClick={() => modifySetState(!modifyState)}>
                {modifyText} &gt;
              </button>
            )}
        </span>
      </p>
      {children}
    </div>
  );
};
