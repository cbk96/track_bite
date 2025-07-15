import { FC, useMemo } from "react";
import { HalfStar } from "./HalfStar";
import * as CT from "../../constants";

interface ScoreStar {
  type?: "view" | "input";
  size?: number;
  color?: string;
  score: number;
  setScore?: (score: number) => void;
}

export const ScoreStar: FC<ScoreStar> = ({
  type = "view",
  size = 30,
  color = CT.SUB_COLOR,
  score = 0,
  setScore,
}) => {
  const socreStar = useMemo(() => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <button
          key={i}
          onClick={setScore ? () => setScore(i / 2) : undefined}
          disabled={type === "view"}
          className={`${type === "input" ? "cursor-pointer" : ""}`}
          style={{ display: "inline-block", height: size + "px" }}
        >
          <HalfStar
            size={size}
            color={color}
            direction={i % 2 === 0 ? "right" : "left"}
            visible={score >= i / 2}
          />
        </button>
      );
    }
    return stars;
  }, [size, color, score, setScore]);

  return (
    <span className="flex items-center" style={{ height: size + "px" }}>
      {socreStar}
    </span>
  );
};
