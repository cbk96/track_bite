import { FC } from "react";

interface props {
  className?: string;
}

export const PatternZigzagBG: FC<props> = ({ className }) => {
  return (
    <div
      className={"absolute left-0 top-14 my-pattern-bg " + className}
      style={{
        width: "100%",
        height: "172px",
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 172px",
        backgroundImage: `url(${
          require("../svg/borderDecoration.svg").default
        })`,
      }}
    />
  );
};

export default PatternZigzagBG;
