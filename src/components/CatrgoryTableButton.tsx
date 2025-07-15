import { FC, useState } from "react";
import * as CT from "../constants";
import { ForkKnife } from "phosphor-react";
import { FallbackImg } from "./FallbackImg";

interface props {
  onClick: (cate: CT.CategoryName) => void;
  mutedColor?: string;
  className?: string;
}

export const CategoryTableButton: FC<props> = ({
  onClick,
  mutedColor = "#aaaaaa",
  className,
}) => {
  const categoryBtn = [...CT.categoryNameKeys];

  return (
    <div
      className={
        " block w-full pt-16 pb-8 items-center overflow-hidden embla animate-flyIn " +
        className
      }
    >
      <div className="flex flex-wrap justify-start min-w-[312px] max-w-screen-sm mx-auto">
        {categoryBtn &&
          categoryBtn.map((category, index) => (
            <div
              key={category + index}
              className={`relative flex flex-col px-3 pb-7 w-1/4 duration-200 ease-linear origin-center-negative-20
                `}
            >
              <button
                onClick={() => onClick(category)}
                className="flex-grow flex-[0_0_auto] w-full bg-center bg-cover bg-white bg-no-repeat cursor-pointer rounded-xl border duration-200
                      origin-bottom z-[3] overflow-hidden"
              >
                {category === "empty" ? (
                  <>
                    <ForkKnife
                      color={CT.MAIN_CUST_COLOR}
                      className="text-[50px] mx-auto"
                    />
                  </>
                ) : (
                  <FallbackImg
                    src={CT.categorySquareImgName[category]}
                    alt="카테고리 이미지"
                    className="w-full"
                  />
                )}
              </button>
              <span
                className="block mt-3 font-bold text-center"
                style={{
                  color: mutedColor,
                }}
              >
                {CT.categoryName[category]}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};
