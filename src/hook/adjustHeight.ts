import { useState } from "react";

export const useAdjustHeight = () => {
  const [sectionHeight, setSectionHeight] = useState<number>(0);

  const observerHeight = (
    element: HTMLElement | HTMLDivElement | HTMLFormElement | null
  ) => {
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect) {
        setSectionHeight(entry.contentRect.height);
      }
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  };

  //자식 요소의 높이 값을 부모 요소의 높이값에 적용
  const adjustHeight = (
    prentRefCurrent: HTMLElement | HTMLDivElement | HTMLFormElement | null,
    childRefCurrent: HTMLElement | HTMLDivElement | HTMLFormElement | null
  ) => {
    const parentEl = prentRefCurrent;
    const childEl = childRefCurrent;
    if (parentEl !== null && childEl !== null) {
      const style = window.getComputedStyle(childEl);
      const marginTop = parseFloat(style.marginTop) || 0;
      const marginBottom = parseFloat(style.marginBottom) || 0;

      parentEl.style.height =
        childEl.offsetHeight + marginTop + marginBottom + "px";
    }
  };
  return { sectionHeight, observerHeight, adjustHeight };
};
