import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AdminState } from "./AdminState";
import type { MenuGroup, Menu } from "../type";
import type { DropResult as BeautifulResult } from "@hello-pangea/dnd";
//import { DropResult as SmoothResult } from "react-smooth-dnd";
import * as U from "../utils";
import * as MG from "./menuGroup";
import * as M from "./menu";
import { MenuApi } from "../service";

export const useMenuGroup = () => {
  const dispatch = useDispatch();

  const menuGroupsState = useSelector<AdminState, MenuGroup[]>(
    ({ menuGroups }) => menuGroups
  );

  const menuState = useSelector<AdminState, Menu[]>(({ menu }) => menu);

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
      let dragIndex = menuGroupsState.findIndex(
        (group) => group.order === sourceCardIndex
      );
      let dropIndex = menuGroupsState.findIndex(
        (group) => group.order === destinationCardIndex
      );

      const swapOrders = U.swapItemsInArray(
        menuGroupsState,
        dragIndex,
        dropIndex
      );
      const resultOrders = swapOrders.map((group, index) => {
        return { ...group, order: index };
      });
      // swapGroupOrders으로 변경된 index를 order에 저장해야함
      dispatch(MG.setMenuGroup(resultOrders));
      //updateMenuGroup(resultGroupOrders);
    },
    [menuGroupsState, dispatch]
  );

  const onDragEndMenu = useCallback(
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
      let dragIndex = menuState.findIndex(
        (group) => group.order === sourceCardIndex
      );
      let dropIndex = menuState.findIndex(
        (group) => group.order === destinationCardIndex
      );

      const swapOrders = U.swapItemsInArray(menuState, dragIndex, dropIndex);
      const resultOrders = swapOrders.map((group, index) => {
        return { ...group, order: index };
      });
      dispatch(M.setMenu(resultOrders));
    },
    [menuState, dispatch]
  );

  return { onDragEndGroup, onDragEndMenu };
};
