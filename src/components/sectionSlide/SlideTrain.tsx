import { FC, PropsWithChildren, useRef, useEffect, useState } from "react";
import { useSlideSection } from "./useSlideSection";

interface SlideTrainProps {
  selectTabNum: number;
  childWidth: number;
  sectionParentsRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export const SlideTrain: FC<PropsWithChildren<SlideTrainProps>> = ({
  selectTabNum,
  childWidth = 0,
  sectionParentsRef,
  children,
  className,
}) => {
  const maxW = () => {
    return window.innerWidth > 1020 ? 1020 : window.innerWidth;
  };
  const [width, setWidth] = useState<number>(maxW);

  useEffect(() => {
    const windowW = maxW;
    const handleResize = () => setWidth(windowW);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="relative mb-5 transition-all duration-500"
      ref={sectionParentsRef}
    >
      <div
        className={`flex items-start  relative w-[300%] transition-all duration-500 ${className}`}
        style={{ left: `${-selectTabNum * childWidth}px` }}
      >
        {children}
      </div>
    </div>
  );
};
