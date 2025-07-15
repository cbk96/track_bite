import { FC } from "react";
import { Star } from "phosphor-react";

interface HalfStarProps {
  direction: "left" | "right";
  size?: number;
  color: string;
  visible?: boolean;
}

export const HalfStar: FC<HalfStarProps> = ({
  direction,
  size = 30,
  color,
  visible = true,
}) => {
  return (
    <span
      className={"relative inline-block overflow-hidden "}
      style={{ width: size / 2 + "px", height: size + "px" }}
    >
      <Star
        weight="fill"
        color={visible ? color : "#ccc"}
        size={size}
        className={`absolute `}
        style={{ left: direction === "right" ? "-" + size / 2 + "px" : "0" }}
      />
    </span>
  );
};
