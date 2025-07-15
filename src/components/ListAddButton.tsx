import { FC, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useAdminContext } from "../context";
import { MenuApi, OptionApi } from "../service";
import { useForm } from "react-hook-form";
import type { AdminState } from "../store/AdminState";
import type { MenuGroup, OptionGroup } from "../type";
import { FirstAid } from "phosphor-react";
import * as U from "../utils";

interface ListAddButtonProps {
  groupType: "menuGroup" | "optionGroup";
  className?: string;
}

type GroupInsert = {
  groupName: string;
  required: "true" | "false";
  selectionType: "single" | "multi";
};

export const ListAddButton: FC<ListAddButtonProps> = ({
  groupType,
  className,
}) => {
  const addButtonConatainer = useRef<HTMLDivElement | null>(null);
  const errorMsgRef = useRef<HTMLParagraphElement | null>(null);
  const [addButtonActive, setAddbuttonActive] = useState<boolean>(false);

  const { loginState } = useAdminContext();
  const { useAddMenuGroup, useUpdateMenuGroup } = MenuApi();
  const { useAddOptionGroup, useUpdateOptionGroup } = OptionApi();
  const { addOptionGroupMutate } = useAddOptionGroup();
  const { updateOptionGroupMutate } = useUpdateOptionGroup();
  const storeId = loginState.storeId;

  const initialGroupInsert: GroupInsert = {
    groupName: "",
    required: "true",
    selectionType: "single",
  };

  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: initialGroupInsert });

  const menuGroupsState = useSelector<AdminState, MenuGroup[]>(
    ({ menuGroups }) => menuGroups
  );

  const optionGroupsState = useSelector<AdminState, OptionGroup[]>(
    ({ optionGroup }) => optionGroup
  );

  const { addMenuGroupMutate, isPending } = useAddMenuGroup();
  const { updateMenuGroupMutate } = useUpdateMenuGroup();

  const activeAddGroupButton = () => {
    reset();
    setAddbuttonActive(!addButtonActive);
  };

  const cofirmAddMenuGroup = (data: GroupInsert) => {
    const groupId = U.createId("GROUP", storeId);
    const mostBigOrderGroup =
      menuGroupsState.length > 0
        ? Math.max(...menuGroupsState.map((group) => group.order))
        : -1;
    const order = mostBigOrderGroup + 1;

    const newGroup: MenuGroup = {
      storeId: storeId,
      menuGroupId: groupId,
      menuGroupName: data.groupName,
      order: order,
      menuCount: 0,
    };
    if (menuGroupsState.length > 0) {
      //그룹 추가 처리전에 기존 메뉴그룹들의 순서 변경 값을 저장
      updateMenuGroupMutate(menuGroupsState);
    }
    addMenuGroupMutate(newGroup);
    activeAddGroupButton();
    errorMsgRef.current?.classList.add("invisible");
  };

  const cofirmAddOptionGroup = (data: GroupInsert) => {
    const groupId = U.createId("OPTGROUP", storeId);
    const mostBigOrderGroup =
      optionGroupsState.length > 0
        ? Math.max(...optionGroupsState.map((option) => option.order))
        : -1;
    const order = mostBigOrderGroup + 1;

    const newGroup: OptionGroup = {
      storeId: storeId,
      optionGroupId: groupId,
      optionGroupName: data.groupName,
      required: JSON.parse(data.required),
      selectionType: data.selectionType,
      order: order,
    };
    if (optionGroupsState.length > 0) {
      //그룹 추가 처리전에 기존 메뉴그룹들의 순서 변경 값을 저장
      updateOptionGroupMutate(optionGroupsState);
      activeAddGroupButton();
    }
    addOptionGroupMutate(newGroup);
    errorMsgRef.current?.classList.add("invisible");
  };

  return (
    <div
      key="addButton"
      ref={addButtonConatainer}
      className={`relative mx-2 lg:mx-0 lg:w-[200px] h-[100pX] lg:h-[130px] z-50 ${className}`}
    >
      <form
        onSubmit={handleSubmit(
          groupType === "menuGroup" ? cofirmAddMenuGroup : cofirmAddOptionGroup
        )}
        className={`absolute p-2 border w-full transition-all duration-800 rounded-xl bg-white  overflow-hidden 
        ${
          addButtonActive
            ? "max-h-[500px] shadow-[0_18px_18px_rgba(0,0,0,0.2)]"
            : "max-h-0 shadow-[0_0px_15px_rgba(0,0,0,0.1)]"
        }`}
      >
        <div className="flex ">
          <input
            type="text"
            {...register("groupName", {
              required: "그룹명을 입력해주세요.",
              minLength: {
                value: 2,
                message: "그룹명은 최소 2글자부터 입력 가능합니다.",
              },
              maxLength: {
                value: 10,
                message: "그룹명은 최대 10글자까지 입력 가능합니다.",
              },
            })}
            name="groupName"
            maxLength={10}
            className="w-full p-1 m-1 border-2 rounded-md outline-none"
            placeholder={
              groupType === "menuGroup" ? "메뉴그룹명" : "옵션그룹명"
            }
          />
        </div>
        <p className="ml-2 mr-2 text-[10px] text-main">
          {errors.groupName?.message}
        </p>
        {groupType === "optionGroup" && (
          <>
            <p>
              <select
                {...register("required")}
                name="required"
                className="py-3 mb-3 font-bold bg-white rounded-lg"
              >
                <option value="true">필수선택</option>
                <option value="false">부가선택</option>
              </select>
            </p>
            <p>
              <select
                {...register("selectionType")}
                name="selectionType"
                className="py-3 mb-3 font-bold bg-white rounded-lg"
              >
                <option value="single">단일선택</option>
                <option value="multi">복수선택</option>
              </select>
            </p>
          </>
        )}
        <p className="flex p-1 mt-1">
          <button
            className="flex-grow p-1 m-1 text-white rounded-md bg-sub"
            type="button"
            onClick={activeAddGroupButton}
          >
            취소
          </button>
          <button className="flex-grow p-1 m-1 text-white rounded-md bg-main">
            등록
          </button>
        </p>
      </form>
      <button
        onClick={activeAddGroupButton}
        disabled={addButtonActive}
        className={`absolute top-0 left-0 rounded-xl text-white shadow-[0_0px_15px_rgba(0,0,0,0.1)] font-bold cursor-pointer duration-300 overflow-hidden
              ${addButtonActive ? "w-0 h-0" : "p-1 w-full h-full"}
              ${groupType === "menuGroup" ? "bg-main" : "bg-sub"}`}
      >
        <span className="block absolute top-8 left-5 text-left text-[20px]">
          {groupType === "menuGroup" ? "메뉴그룹 추가" : "옵션그룹 추가"}
        </span>
        <FirstAid
          size={80}
          weight="fill"
          className="absolute bottom-0 right-0"
        />
      </button>
    </div>
  );
};

export default ListAddButton;
