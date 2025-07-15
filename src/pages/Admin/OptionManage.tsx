import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import {
  RoundedBox,
  SideBar,
  TabMenuBar,
  CardDroppable,
  ListAddButton,
} from "../../components";
import {
  OptoinsCell,
  OptionInsertCell,
  OptionGroupManager,
} from "../../components/menus";
import { AdminMain } from "./AdminMain";
import { DragDropContext } from "@hello-pangea/dnd";
import { useSelector, useDispatch } from "react-redux";
import { useAdminContext } from "../../context/AdminContext";
import { OptionApi } from "../../service";
import { useBlocker } from "react-router-dom";
import type { AdminState } from "../../store/AdminState";
import type { OptionGroup, Option } from "../../type";
import { useMenuList } from "../../store/useMenuList";
import { LoadingSpinner, useLoading } from "../../components/loading";
import { OptionGroupCard } from "../../components/GroupCard";
import { useForm } from "react-hook-form";

type GroupEdit = {
  optionGroupName: string;
  required: string;
  selectionType: "single" | "multi";
};

export function OptionManage() {
  const tabNames = ["메뉴관리", "옵션관리"];
  const tabLinks = ["/admin/menumanage", "/admin/optionmanage"];
  const currentTab = "옵션관리";

  const [selectedGroup, setSelectedGroup] = useState<OptionGroup>();
  const [selectedOption, setSelectedOption] = useState<Option>();
  const [visibleActive, setVisibleActive] = useState<boolean>(false);
  const [groupModifyActive, setGroupModifyActive] = useState<boolean>(false);
  const grounNameModifyRef = useRef<HTMLInputElement | null>(null);
  const requierdRef = useRef<HTMLSelectElement | null>(null);
  const selectionTypeRef = useRef<HTMLSelectElement | null>(null);

  const { loginState, setAlertState: setADAlertState } = useAdminContext();
  const {
    useGetOptionGroups,
    useUpdateOptionGroup,
    useDeleteOptionGroup,
    useGetOptions,
    useUpdateOption,
  } = OptionApi();
  const { isGetOptionGrLoading } = useGetOptionGroups(loginState.storeId);
  const { updateOptionGroupMutate } = useUpdateOptionGroup();
  const { deleteOptionGroupMutate } = useDeleteOptionGroup();
  const { isgGetOptionLoading } = useGetOptions(loginState.storeId);
  const { updateOptionMutate } = useUpdateOption();

  const optionGroupsState = useSelector<AdminState, OptionGroup[]>(
    ({ optionGroup }) => optionGroup
  );

  const optionState = useSelector<AdminState, Option[]>(({ option }) => option);

  const { onDragEndOptionGroup, onDragEndOption } = useMenuList();

  //페이지 이탈시 그룹들과 옵션의 순서 변경 값을 저장
  useBlocker(({ currentLocation, nextLocation }) => {
    if (currentLocation.pathname !== nextLocation.pathname) {
      optionGroupsState.length > 0 &&
        updateOptionGroupMutate(optionGroupsState);
      optionState.length > 0 && updateOptionMutate(optionState);
    }
    return false;
  });

  //페이지 초기 마운트시 옵션 그룹중 첫번째 그룹을 기본 선택 그룹으로 지정함
  useEffect(() => {
    if (!selectedGroup && optionGroupsState.length > 0) {
      setSelectedGroup(optionGroupsState[0]);
    }
  }, [optionGroupsState]);

  const openInFull = (optionGroupId: string) => {
    const selectedGroup = optionGroupsState.find((group) => {
      return group.optionGroupId === optionGroupId;
    });
    setSelectedGroup(selectedGroup);
  };

  const groupModify = (data: GroupEdit) => {
    if (selectedGroup !== undefined) {
      const modifyGroup: OptionGroup = {
        ...selectedGroup,
        ...data,
        required: JSON.parse(data.required),
      };
      const modifyGroupAppend: OptionGroup[] = new Array(modifyGroup);
      updateOptionGroupMutate(modifyGroupAppend);
      setGroupModifyActive(false);
    }
  };

  const addItemActive = useCallback(
    (active: boolean, optionId?: string) => {
      //optionId를 매개변수로 전달하는 경우 = 메뉴를 수정하는 경우
      if (optionId) {
        const selectedOption = optionState.find(
          (option) => option.optionId === optionId
        );
        setSelectedOption((prev) =>
          selectedOption ? { ...selectedOption } : undefined
        );
      }
      setVisibleActive(active);
    },
    [optionState, selectedGroup]
  );

  const optionGroupDelete = (optionGroupId: string | undefined) => {
    // eslint-disable-next-line no-restricted-globals
    const delConfirm = confirm(
      "옵션그룹과 포함된 모든 옵션 항목이 삭제됩니다. 삭제하시겠습니까?"
    );
    if (!delConfirm || optionGroupId === undefined) return;
    deleteOptionGroupMutate({ optionGroupId, storeId: loginState.storeId });

    setSelectedGroup(optionGroupsState[0]);
  };

  const optionGroups = useMemo(() => {
    return (
      <>
        {optionGroupsState.map((optionGroup, index) => {
          const optionGroupId = optionGroup?.optionGroupId ?? "temp-" + index;
          return (
            <OptionGroupCard
              key={optionGroupId}
              index={optionGroup.order}
              optionGroupId={optionGroupId}
              optionGroupName={optionGroup.optionGroupName}
              optionCount={
                optionGroup.optionCount ? optionGroup.optionCount : 0
              }
              selectedOptionGroupId={selectedGroup?.optionGroupId}
              openInFull={openInFull}
            ></OptionGroupCard>
          );
        })}
      </>
    );
  }, [optionGroupsState, selectedGroup]);

  const optionsCantainer = useMemo(() => {
    const relationOption = optionState.filter(
      (option) => option.optionGroupId === selectedGroup?.optionGroupId
    );
    return (
      <>
        <OptionGroupManager
          groupModify={groupModify}
          groupModifyActive={groupModifyActive}
          optionGroupDelete={optionGroupDelete}
          selectedGroup={selectedGroup}
          setGroupModifyActive={setGroupModifyActive}
        />

        {relationOption.length > 0 ? (
          relationOption.map((option) => {
            return (
              <OptoinsCell
                key={option.optionId}
                selectedOption={option}
                setSelectedOption={setSelectedOption}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
              />
            );
          })
        ) : visibleActive ? (
          <>{visibleActive}</>
        ) : (
          <div className="pt-6 text-center">
            <p className="material-icons text-[150px] text-[#ccc]">
              soup_kitchen
            </p>
            <p className="text-[#aaa] font-bold">등록된 항목이 없습니다.</p>
          </div>
        )}
      </>
    );
  }, [
    groupModifyActive,
    selectedGroup,
    optionState,
    optionGroupsState,
    visibleActive,
  ]);

  return (
    <>
      <LoadingSpinner isLoading={isGetOptionGrLoading} />
      <AdminMain>
        <TabMenuBar
          tabNames={tabNames}
          tabLinks={tabLinks}
          currentTab={currentTab}
        />
        <RoundedBox underLine={false}>
          <div className="flex flex-col mt-5 mb-20">
            <div className="relative flex flex-col lg:flex-row">
              <ListAddButton groupType="optionGroup" className="mb-5 lg:mb-0" />
              {optionGroupsState.length > 0 ? (
                <div
                  style={{ WebkitOverflowScrolling: "touch" }}
                  className="max-w-[690px] h-[160px] flex-grow overflow-x-scroll lg:overflow-hidden lg:hover:overflow-x-scroll shadow-[inset_0_0_100px_#fff]"
                >
                  <DragDropContext onDragEnd={onDragEndOptionGroup}>
                    <CardDroppable
                      droppableId="menuGroupDropZone"
                      direction="horizontal"
                      className="w-fit"
                    >
                      {optionGroups}
                    </CardDroppable>
                  </DragDropContext>
                </div>
              ) : null}
            </div>
            <div className="relative flex flex-grow flex-col p-5 lg:p-10 mt-7 min-h-[500px] border box-border rounded-xl bg-[#f2f2f2] transition-all duration-300 origin-center ">
              {optionGroupsState !== undefined &&
              optionGroupsState[0] !== undefined ? (
                <div className="relative flex flex-col h-full">
                  <div className="w-full pb-[90px] ">
                    <DragDropContext onDragEnd={onDragEndOption}>
                      <CardDroppable
                        droppableId="menuDropZone"
                        direction="vertical"
                        className="max-w-[820px]"
                      >
                        {optionsCantainer}
                      </CardDroppable>
                    </DragDropContext>
                    <OptionInsertCell
                      visibleActive={visibleActive}
                      setVisibleActive={addItemActive}
                      selectedGroup={selectedGroup}
                      setSelectedGroup={setSelectedGroup}
                      usuallyOption={selectedOption}
                      setUsuallyOption={setSelectedOption}
                    />
                  </div>
                  {selectedGroup ? (
                    <div className="absolute bottom-0 left-0 flex justify-center w-full bg-[#f2f2f2] font-bold border-t-2">
                      <button
                        className="flex leading-[70px]"
                        onClick={() => addItemActive(true)}
                      >
                        <span className="inline-block mr-1 material-icons">
                          add
                        </span>
                        <span className="inline-block">항목 추가하기</span>
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
                    등록된 옵션그룹이 없습니다
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

export default OptionManage;
