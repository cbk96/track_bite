import { current } from "@reduxjs/toolkit";
import { useState, useRef, useCallback, useEffect } from "react";
import { useAdjustHeight } from "../../hook";

export const useSlideSection = () => {
  const { sectionHeight, observerHeight, adjustHeight } = useAdjustHeight();
  const [selectTabNum, setSelectTabNum] = useState<number>(0);
  const [childWidth, setChildWidth] = useState<number>(0);
  const sectionParentsRef = useRef<HTMLDivElement | null>(null);
  const slideSectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const element = slideSectionsRef.current[selectTabNum];
    setChildWidth(element?.offsetWidth ?? 0);
    observerHeight(element);
  }, [selectTabNum]);

  //슬라이드 내 자식 섹션들의 높이 값 변경을 감지하여 부모(슬라이드)의 높이를 자식에 맞춰 변경
  const resetParentHeight = useCallback(() => {
    const parentEl = sectionParentsRef.current;
    const childEl = slideSectionsRef.current[selectTabNum];

    adjustHeight(parentEl, childEl);
  }, [selectTabNum]);

  return {
    sectionHeight,
    selectTabNum,
    childWidth,
    setSelectTabNum,
    sectionParentsRef,
    slideSectionsRef,
    resetParentHeight,
  };
};
