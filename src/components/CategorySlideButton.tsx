import { FC, useState } from "react";
import * as CT from "../constants";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ForkKnife } from "phosphor-react";

interface props {
  selectedCategory: CT.CategoryName;
  onClick: (cate: CT.CategoryName) => void;
  autoPlay?: boolean;
  highlightColor?: string;
  mutedColor?: string;
  className?: string;
}

export const CategorySlideButton: FC<props> = ({
  selectedCategory,
  onClick,
  autoPlay = false,
  highlightColor = CT.MAIN_CUST_COLOR,
  mutedColor = "#aaaaaa",
  className,
}) => {
  const BANNER_WIDTH = 200;
  const [clientX, setClientX] = useState<number>(0);
  const [moveDirection, setMoveDirection] = useState<
    "left" | "pause" | "right"
  >("pause");
  const categoryBtn = [...CT.categoryNameKeys, ...CT.categoryNameKeys];
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
    },
    autoPlay ? [Autoplay({ delay: 3000, stopOnInteraction: false })] : []
  );

  const clotheslineMove = () => {
    const mouseMove = (mouseEvent: MouseEvent) => {
      const drag = mouseEvent.clientX;
      setClientX((prev) => {
        if (prev > drag) {
          setMoveDirection("left");
        } else if (prev < drag) {
          setMoveDirection("right");
        } else {
          setMoveDirection("pause");
        }
        return drag;
      });
    };

    const mouseUp = () => {
      setMoveDirection("pause");
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    };

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
  };

  return (
    <div
      ref={emblaRef}
      className={
        " block w-full pt-8 lg:pt-16 pb-8 overflow-hidden embla animate-flyIn " +
        className
      }
    >
      <div onMouseDown={clotheslineMove} className="flex ">
        {categoryBtn &&
          categoryBtn.map((category, index) => (
            <div key={category + index}>
              <div
                className={`relative flex flex-col mx-3 lg:mx-5 duration-200 ease-linear origin-center-negative-20
                ${
                  moveDirection === "left"
                    ? "-rotate-3"
                    : moveDirection === "right"
                    ? "rotate-3"
                    : ""
                }`}
              >
                <p
                  className={`absolute w-full h-[150px] lg:h-[250px] top-0 left-0 rounded-xl z-[5] duration-200 ${
                    selectedCategory === category
                      ? "top-3 left-3 lg:left-5"
                      : ""
                  }`}
                  style={{ backgroundColor: highlightColor }}
                ></p>
                <button
                  onClick={() => onClick(category)}
                  className={`flex-[0_0_auto] w-[100px] lg:w-[220px] h-[150px] lg:h-[250px] bg-center bg-cover bg-white bg-no-repeat cursor-pointer rounded-xl shadow-[0_5px_10px_rgba(0,0,0,0.7)] duration-200
                      origin-bottom hover:scale-110 z-[6] ${
                        selectedCategory === category ? "scale-110" : ""
                      }`}
                  style={{
                    //width: `${BANNER_WIDTH}px`,
                    backgroundImage:
                      category !== "empty"
                        ? `url(${CT.categoryImgName[category]})`
                        : undefined,
                  }}
                >
                  {category === "empty" ? (
                    <>
                      <ForkKnife
                        color={CT.MAIN_CUST_COLOR}
                        className="text-[70px] lg:text-[100px] mx-auto mb-3"
                      />
                      <p className="text-[16px] lg:text-[20px] text-main-cust font-bold">
                        전체
                      </p>
                    </>
                  ) : null}
                </button>
                {/* <ClipIcon
                    className={`absolute left-2 w-10 z-30 text-[#ccc] duration-200 filter drop-shadow-[3px_5px_1px_rgba(222,170,8,0.5)]
                ${
                  selectedCategory === category
                    ? "top-[-50px] opacity-100"
                    : "top-[-60px] opacity-0"
                }`}
                  /> */}
                <span
                  className="block mt-5 text-[18px]  text-center font-bold"
                  style={{
                    color:
                      selectedCategory === category
                        ? highlightColor
                        : mutedColor,
                  }}
                >
                  {CT.categoryName[category]}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
