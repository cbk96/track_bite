import type { FC, PropsWithChildren } from "react";
import * as PR from "phosphor-react";

import { Link } from "react-router-dom";
export type RoundedPublicBoxProps = {
  title?: string;
  className?: string;
  phosphor?: keyof typeof PR;
  titleBgColor?: string;
  titleColor?: string;
  titleUnderLine?: boolean;
};

export const RoundedPublicBox: FC<PropsWithChildren<RoundedPublicBoxProps>> = ({
  title,
  className,
  children,
  phosphor,
  titleBgColor,
  titleColor,
  titleUnderLine = true,
  ...props
}) => {
  let basicClassName =
    "mx-3 lg:mx-0 rounded-2xl shadow-[0_5px_8px_rgba(0,0,0,0.1)] overflow-hidden";

  let Iconcomponent: any;

  if (className !== "") {
    basicClassName += " " + className;
  }

  if (phosphor !== undefined) {
    Iconcomponent = PR[phosphor];
  }

  return (
    <div {...props} className={basicClassName}>
      {title !== undefined && title !== "" && (
        <div
          className="flex px-8 py-3 items-center font-bold text-[16px]"
          style={{
            backgroundColor: titleBgColor,
            borderBottom: titleUnderLine ? "2px solid #e5e7eb" : "none",
          }}
        >
          {Iconcomponent && (
            <Iconcomponent className="mr-2" size={20} weight="bold" />
          )}

          <p style={{ color: titleColor }}>{title}</p>
        </div>
      )}
      {children}
    </div>
  );
};

export default RoundedPublicBox;
