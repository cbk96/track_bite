import { FC, useEffect } from "react";
import { MenuGroup, OptionGroup } from "../../type";
import { useForm } from "react-hook-form";

type GroupEdit = {
  optionGroupName: string;
  required: string;
  selectionType: "single" | "multi";
};

interface props {
  selectedGroup: OptionGroup | undefined;
  groupModifyActive: boolean;
  groupModify: (data: GroupEdit) => void;
  optionGroupDelete: (optionGroupId: string | undefined) => void;
  setGroupModifyActive: (active: boolean) => void;
}

export const OptionGroupManager: FC<props> = ({
  selectedGroup,
  groupModifyActive,
  groupModify,
  optionGroupDelete,
  setGroupModifyActive,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GroupEdit>({
    defaultValues: {
      optionGroupName: "",
      required: "true",
      selectionType: "single",
    },
  });

  useEffect(() => {
    setValue("optionGroupName", selectedGroup?.optionGroupName ?? "");
    setValue("required", String(selectedGroup?.required) ?? "true");
    setValue("selectionType", selectedGroup?.selectionType ?? "single");
  }, [selectedGroup]);

  return (
    <div className="flex flex-col lg:flex-row pt-[2px] mb-[15px] min-h-[45px] text-[12px] font-bold leading-[40px]">
      {groupModifyActive && selectedGroup ? (
        <form onSubmit={handleSubmit(groupModify)}>
          <div className="flex h-[45px] lg:mr-5 justify-between">
            <input
              type="text"
              {...register("optionGroupName", {
                required: "그룹명을 입력해주세요",
                minLength: {
                  value: 2,
                  message: "그룹명은 최소 2글자 이상이어야 합니다.",
                },
                maxLength: {
                  value: 10,
                  message: "그룹명은 최대 10글자이어야 합니다..",
                },
              })}
              className="pl-2 w-[calc(100%-190px)] lg:w-auto font-normal text-[10px] lg:text-[12px] border box-border rounded-lg"
              placeholder={selectedGroup.optionGroupName}
            />
            <p>
              <select
                {...register("required")}
                className="h-full px-2 font-bold bg-white border rounded-lg"
              >
                <option value="true">필수선택</option>
                <option value="false">부가선택</option>
              </select>
            </p>
            <p>
              <select
                {...register("selectionType")}
                className="h-full px-2 font-bold bg-white border rounded-lg"
                name="selectionType"
              >
                <option value="single">단일선택</option>
                <option value="multi">복수선택</option>
              </select>
            </p>
            <button className="w-[50px] h-[45px] text-[16px] bg-white border rounded-lg ">
              수정
            </button>
          </div>
        </form>
      ) : (
        <div className="flex">
          <p className="text-[18px] mr-5">{selectedGroup?.optionGroupName}</p>
          <p className="mr-5">
            {selectedGroup?.required ? "필수" : "부가"} /{" "}
            {selectedGroup?.selectionType === "single" ? "단일" : "복수"} 선택
          </p>
        </div>
      )}
      <div className="flex">
        <p className=" text-[#999] mr-5">
          {"등록항목 "}
          {selectedGroup?.optionCount ? selectedGroup.optionCount : 0}개
        </p>

        <p className="mr-5 text-sub">
          <button onClick={() => setGroupModifyActive(!groupModifyActive)}>
            {groupModifyActive ? "취소" : "그룹 수정"}
          </button>
        </p>
        <p className="mr-5 text-main">
          <button
            onClick={() => optionGroupDelete(selectedGroup?.optionGroupId)}
          >
            그룹 삭제
          </button>
        </p>
      </div>
    </div>
  );
};
