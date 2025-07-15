import { useMemo, useState, useCallback, useEffect } from "react";
import {
  RoundedBox,
  TabMenuBar,
  CardDroppable,
  ListAddButton,
} from "../../components";
import {
  usePopup,
  PopupContainer,
  PopupBackGround,
  MenuInsertPopup,
} from "../../components/popup";
import { MenuCell, MenuGroupManager } from "../../components/menus";
import { AdminMain } from "./AdminMain";
import { DragDropContext } from "@hello-pangea/dnd";
import { useSelector } from "react-redux";
import { useAdminContext } from "../../context/AdminContext";
import { MenuApi } from "../../service";
import { useBlocker } from "react-router-dom";
import { useMenuList } from "../../store/useMenuList";
import { MenuGroupCard } from "../../components/GroupCard";
import { Plus } from "phosphor-react";
import { useForm } from "react-hook-form";
import { LoadingSpinner } from "../../components/loading";
import type { AdminState } from "../../store/AdminState";
import type { MenuGroup, Menu } from "../../type";

export function MenuManage() {
  const tabNames = ["메뉴관리", "옵션관리"];
  const tabLinks = ["/admin/menumanage", "/admin/optionmanage"];
  const currentTab = "메뉴관리";

  const [selectedMenuGroup, setSelectedGroup] = useState<MenuGroup>();
  const [selectedMenu, setSelectedMenu] = useState<Menu>();

  const [groupModifyActive, setGroupModifyActive] = useState<boolean>(false);
  const { popupActive, setPopupActive } = usePopup();
  const popupId = "menuInsert";

  const { loginState, setAlertState: setADAlertState } = useAdminContext();
  const {
    useGetMenuGroups,
    useUpdateMenuGroup,
    useDeleteMenuGroup,
    useGetMenus,
    useUpdateMenu,
  } = MenuApi();

  const menuGroupsState = useSelector<AdminState, MenuGroup[]>(
    ({ menuGroups }) => menuGroups
  );
  const { isgGetMenuLoading } = useGetMenus(loginState.storeId);
  const { updateMenuMutate } = useUpdateMenu();
  const { updateMenuGroupMutate } = useUpdateMenuGroup();
  const { deleteMenuGroupMutate } = useDeleteMenuGroup();
  const { isGetMenuGrLoading, refetchMenuGroups } = useGetMenuGroups(
    loginState.storeId
  );
  const { onDragEndMenuGroup, onDragEndMenu } = useMenuList();
  const menuState = useSelector<AdminState, Menu[]>(({ menu }) => menu);

  //페이지 이탈시 메뉴그룹들과 메뉴의 순서 변경 값을 저장
  useBlocker(({ currentLocation, nextLocation }) => {
    if (currentLocation.pathname !== nextLocation.pathname) {
      menuGroupsState.length > 0 && updateMenuGroupMutate(menuGroupsState);
      menuState.length > 0 && updateMenuMutate(menuState);
    }
    return false;
  });

  //페이지 초기 마운트시 메뉴 그룹중 첫번째 그룹을 기본 선택 그룹으로 지정함
  useEffect(() => {
    if (!selectedMenuGroup && menuGroupsState.length > 0) {
      setSelectedGroup(menuGroupsState[0]);
    }
  }, [menuGroupsState]);

  const openInFull = (menuGroupId: string) => {
    const selectedMenuGroup = menuGroupsState.find((group) => {
      return group.menuGroupId === menuGroupId;
    });
    setSelectedGroup(selectedMenuGroup);
  };

  const {
    formState: { errors },
  } = useForm({
    defaultValues: {
      menuGroupName: "",
    },
  });

  const groupModify = (data: { menuGroupName: string }) => {
    if (selectedMenuGroup) {
      const modifyGroup = {
        ...selectedMenuGroup,
        menuGroupName: data.menuGroupName,
      };
      const modifyGroupAppend: MenuGroup[] = new Array(modifyGroup);
      updateMenuGroupMutate(modifyGroupAppend);
      setGroupModifyActive(false);
    }
  };

  const addMenuActive = useCallback(
    (active: boolean, popupId: string, menuId?: string) => {
      if (menuId) {
        const selectedMenu = menuState.find((menu) => menu.menuId === menuId);
        setSelectedMenu((prev) =>
          selectedMenu ? { ...selectedMenu } : undefined
        );
      }
      setPopupActive({ active, popupId });
    },
    [menuState, selectedMenuGroup]
  );

  const menuGroupDelete = (menuGroupId: string | undefined) => {
    // eslint-disable-next-line no-restricted-globals
    const delConfirm = confirm(
      "메뉴그룹과 포함된 모든 메뉴가 삭제됩니다. 삭제하시겠습니까?"
    );

    if (!delConfirm || menuGroupId === undefined) return;
    deleteMenuGroupMutate({ menuGroupId, storeId: loginState.storeId });

    setSelectedGroup(menuGroupsState[0]);
  };

  const menuGroups = useMemo(() => {
    return (
      <>
        {menuGroupsState.map((menuGroup, index) => {
          const menuGroupId = menuGroup?.menuGroupId ?? "temp-" + index;
          return (
            <MenuGroupCard
              key={menuGroupId}
              index={menuGroup.order}
              menuGroupId={menuGroupId}
              menuGroupName={menuGroup.menuGroupName}
              menuCount={menuGroup.menuCount ? menuGroup.menuCount : 0}
              selectedMenuGroupId={selectedMenuGroup?.menuGroupId}
              openInFull={openInFull}
            ></MenuGroupCard>
          );
        })}
      </>
    );
  }, [menuGroupsState, selectedMenuGroup]);

  const menusContainer = useMemo(() => {
    const relationMenu = menuState.filter(
      (menu) => menu.menuGroupId === selectedMenuGroup?.menuGroupId
    );
    return (
      <>
        <MenuGroupManager
          groupModify={groupModify}
          groupModifyActive={groupModifyActive}
          menuGroupDelete={menuGroupDelete}
          selectedMenuGroup={selectedMenuGroup}
          setGroupModifyActive={setGroupModifyActive}
        />

        {relationMenu.length > 0 ? (
          relationMenu.map((menu) => {
            return (
              <MenuCell
                key={menu.menuId}
                menu={menu}
                popupId={popupId}
                addMenuActive={addMenuActive}
              />
            );
          })
        ) : (
          <div className="pt-6 text-center">
            <p className="material-icons text-[150px] text-[#ccc]">
              restaurant
            </p>
            <p className="text-[#aaa] font-bold">등록된 메뉴가 없습니다.</p>
          </div>
        )}
      </>
    );
  }, [groupModifyActive, selectedMenuGroup, menuState, menuGroupsState]);

  return (
    <>
      <LoadingSpinner isLoading={isgGetMenuLoading} />
      <PopupBackGround
        popupActive={popupActive}
        setPopupActive={setPopupActive}
      >
        {popupActive.popupId === popupId && popupActive.active ? (
          <PopupContainer popupId={popupId} popupActive={popupActive}>
            <MenuInsertPopup
              popUpActive={addMenuActive}
              selectedGroup={selectedMenuGroup}
              setSelectedGroup={setSelectedGroup}
              usuallyMenu={selectedMenu}
              setUsuallyMenu={setSelectedMenu}
            />
          </PopupContainer>
        ) : null}
      </PopupBackGround>
      <AdminMain>
        <TabMenuBar
          tabNames={tabNames}
          tabLinks={tabLinks}
          currentTab={currentTab}
        />
        <RoundedBox underLine={false}>
          <div className="flex flex-col mt-5 mb-20">
            <div className="relative flex flex-col lg:flex-row">
              <ListAddButton groupType="menuGroup" className="mb-5 lg:mb-0" />
              {menuGroupsState.length > 0 ? (
                <div
                  style={{ WebkitOverflowScrolling: "touch" }}
                  className="max-w-[690px] h-[160px] overflow-x-scroll lg:overflow-hidden lg:hover:overflow-x-scroll shadow-[inset_0_0_100px_#fff]"
                >
                  <DragDropContext onDragEnd={onDragEndMenuGroup}>
                    <CardDroppable
                      droppableId="menuGroupDropZone"
                      direction="horizontal"
                      className="w-fit"
                    >
                      {menuGroups}
                    </CardDroppable>
                  </DragDropContext>
                </div>
              ) : null}
            </div>
            <div className="relative flex flex-grow flex-col lg:p-10 p-5 mt-7 min-h-[500px] border box-border rounded-xl bg-[#f2f2f2] transition-all duration-300 origin-center ">
              {menuGroupsState !== undefined &&
              menuGroupsState[0] !== undefined ? (
                <div className="relative flex flex-col h-full">
                  <div className="relative w-full pb-[90px]">
                    <DragDropContext onDragEnd={onDragEndMenu}>
                      <CardDroppable
                        droppableId="menuDropZone"
                        direction="vertical"
                        className="max-w-[820px]"
                      >
                        {menusContainer}
                      </CardDroppable>
                    </DragDropContext>
                  </div>
                  {selectedMenuGroup ? (
                    <div className="absolute bottom-0 left-0 flex justify-center w-full bg-[#f2f2f2] font-bold border-t-2">
                      <button
                        className="flex leading-[70px] items-center"
                        onClick={() => addMenuActive(true, popupId)}
                      >
                        <Plus
                          color="#000"
                          weight="bold"
                          strokeWidth={3}
                          className="mr-1"
                        />
                        <span className="inline-block">메뉴 추가하기</span>
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <div className="py-[100px] flex flex-col text-center text-[#ccc]">
                  <p className="material-icons text-[150px] ">category</p>
                  <p className="font-bold text-[#aaa]">
                    등록된 메뉴그룹이 없습니다
                  </p>
                </div>
              )}
            </div>
          </div>
        </RoundedBox>
      </AdminMain>
    </>
  );
}

export default MenuManage;
