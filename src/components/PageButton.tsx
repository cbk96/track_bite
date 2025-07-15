import { FC, useMemo } from "react";
import {
  CaretLeft,
  CaretRight,
  CaretDoubleLeft,
  CaretDoubleRight,
} from "phosphor-react";
import * as CT from "../constants";
/*
한페이지에 출력할 요소 개수 showItemPcs
한페이지에 출력할 페이지 버튼 개수 pageButtonPcs
검색된 요소 전체 개수 foundedItemAllPcs
선택한 페이지 버튼 selectedPageNum*/
interface PageButtonProps {
  selectedPageNum: number;
  showItemPcs: number;
  pageButtonPcs: number;
  foundedItemAllPcs: number;
  setSelectedPageNum: (selectedPageNum: number) => void;
}

export const PageButton: FC<PageButtonProps> = ({
  selectedPageNum = 0,
  showItemPcs,
  pageButtonPcs,
  foundedItemAllPcs,
  setSelectedPageNum,
}) => {
  const startPageNum =
    Math.ceil((selectedPageNum - pageButtonPcs) / pageButtonPcs) * 10 + 1;
  const lastNum = Math.floor((foundedItemAllPcs - 1) / showItemPcs) + 1;
  const currentLastNum = startPageNum + pageButtonPcs - 1;
  const endPageNum = lastNum > currentLastNum ? currentLastNum : lastNum;

  const clickPage = (pageNum: number) => {
    setSelectedPageNum(pageNum);
  };

  const pageButtons = useMemo(() => {
    const items = [];

    // "<<"  버튼 출력 여부
    startPageNum > pageButtonPcs
      ? items.push(
          <li
            key={"prevRange"}
            className="flex items-center ml-1 mr-1 h-[25px] text-[14px] text-center font-bold rounded-md leading-[25px] cursor-pointer"
            onClick={() => clickPage(selectedPageNum - pageButtonPcs)}
          >
            <CaretDoubleLeft weight="bold" />
          </li>
        )
      : items.push(
          <li
            key={"prevRange"}
            className="flex items-center ml-1 mr-1 w-[14px] h-[25px]"
          ></li>
        );

    // "<"  버튼 출력 여부
    selectedPageNum > 1
      ? items.push(
          <li
            key={"prev"}
            className="flex items-center ml-1 mr-1 h-[25px] text-[14px] text-center font-bold rounded-md leading-[25px] cursor-pointer"
            onClick={() => clickPage(selectedPageNum - 1)}
          >
            <CaretLeft weight="bold" />
          </li>
        )
      : items.push(
          <li
            key={"prev"}
            className="flex items-center ml-1 mr-1 w-[14px] h-[25px]"
          ></li>
        );

    for (let i = startPageNum; i <= endPageNum; i++) {
      items.push(
        <li
          key={i}
          className="ml-1 mr-1 w-[18px] lg:w-[25px] h-[25px] text-[14px] text-center font-bold rounded-md leading-[25px] cursor-pointer"
          style={{
            backgroundColor: selectedPageNum === i ? CT.MAIN_COLOR : "#ffffff",
            color: selectedPageNum === i ? "#ffffff" : "#666666",
          }}
          onClick={() => clickPage(i)}
        >
          {i}
        </li>
      );
    }

    // ">"  버튼 출력 여부
    selectedPageNum < lastNum
      ? items.push(
          <li
            key={"next"}
            className="flex items-center ml-1 mr-1 h-[25px] text-[14px] text-center font-bold rounded-md leading-[25px] cursor-pointer"
            onClick={() => clickPage(selectedPageNum + 1)}
          >
            <CaretRight weight="bold" />
          </li>
        )
      : items.push(
          <li
            key={"next"}
            className="flex items-center ml-1 mr-1 w-[14px] h-[25px]"
          ></li>
        );

    // ">>"  버튼 출력 여부
    lastNum > currentLastNum
      ? items.push(
          <li
            key={"nextRange"}
            className="flex items-center ml-1 mr-1 h-[25px] text-[14px] text-center font-bold rounded-md leading-[25px] cursor-pointer"
            onClick={() => clickPage(startPageNum + pageButtonPcs)}
          >
            <CaretDoubleRight weight="bold" />
          </li>
        )
      : items.push(
          <li
            key={"nextRange"}
            className="flex items-center ml-1 mr-1 w-[14px] h-[25px]"
          ></li>
        );

    return items;
  }, [selectedPageNum, foundedItemAllPcs, showItemPcs, pageButtonPcs]);
  return (
    <div className="flex justify-center">
      <ul className="flex">{pageButtons}</ul>
    </div>
  );
};
