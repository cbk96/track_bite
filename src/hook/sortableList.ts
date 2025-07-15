import { useCallback } from "react";
import { useDispatch } from "react-redux";
import type { DropResult as BeautifulResult } from "@hello-pangea/dnd";
import * as U from "../utils";

type ItemWithOrder = { order: number };

export const useSortableList = <T extends ItemWithOrder>(
  list: T[],
  setListAction: (updateList: T[]) => any
) => {
  const dispatch = useDispatch();

  const onDragEndGroup = useCallback(
    (result: BeautifulResult) => {
      const destinationCardId = result.destination?.droppableId; //드래그 종료 지점의 droppableId ("mainDropZone")
      const destinationCardIndex = result.destination?.index; //드래그 종료 지점의 순번
      // console.log("드래그 종료 지점 ID : ", destinationCardId);
      // console.log("드래그 종료 위치 : ", destinationCardIndex);

      if (
        destinationCardId === undefined ||
        destinationCardIndex === undefined
      ) {
        return;
      }

      const sourceCardId = result.source.droppableId; //드래그 시작 지점의 droppableId ("mainDropZone")
      const sourceCardIndex = result.source.index;
      let dragIndex = list.findIndex((item) => item.order === sourceCardIndex);
      let dropIndex = list.findIndex(
        (item) => item.order === destinationCardIndex
      );

      const swapList = U.swapItemsInArray(list, dragIndex, dropIndex);
      const resultList = swapList.map((item, index) => {
        return { ...item, order: index };
      });
      dispatch(setListAction(resultList));
    },
    [list, dispatch]
  );
  return onDragEndGroup;
};
