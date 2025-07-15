import { useDispatch, useSelector } from "react-redux";
import type { AdminState } from "./AdminState";
import type { MenuGroup, Menu, OptionGroup, Option } from "../type";
import * as MG from "./menuGroup";
import * as M from "./menu";
import * as OG from "./optionGroup";
import * as O from "./option";
import { useSortableList } from "../hook";

export const useMenuList = () => {
  const menuGroupsState = useSelector<AdminState, MenuGroup[]>(
    ({ menuGroups }) => menuGroups
  );
  const menuState = useSelector<AdminState, Menu[]>(({ menu }) => menu);

  const optionGroupsState = useSelector<AdminState, OptionGroup[]>(
    ({ optionGroup }) => optionGroup
  );
  const optionState = useSelector<AdminState, Option[]>(({ option }) => option);

  const onDragEndMenuGroup = useSortableList(menuGroupsState, MG.setMenuGroup);
  const onDragEndMenu = useSortableList(menuState, M.setMenu);
  const onDragEndOptionGroup = useSortableList(
    optionGroupsState,
    OG.setOptionGroup
  );
  const onDragEndOption = useSortableList(optionState, O.setOption);

  return {
    onDragEndMenuGroup,
    onDragEndMenu,
    onDragEndOptionGroup,
    onDragEndOption,
  };
};
