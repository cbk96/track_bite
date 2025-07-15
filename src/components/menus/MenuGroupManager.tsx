import { FC, useEffect } from "react";
import { MenuGroup } from "../../type";
import { useForm } from "react-hook-form";

interface props {
  selectedMenuGroup: MenuGroup | undefined;
  groupModifyActive: boolean;
  groupModify: (data: { menuGroupName: string }) => void;
  menuGroupDelete: (menuGroupId: string | undefined) => void;
  setGroupModifyActive: (active: boolean) => void;
}

export const MenuGroupManager: FC<props> = ({
  selectedMenuGroup,
  groupModifyActive,
  groupModify,
  menuGroupDelete,
  setGroupModifyActive,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      menuGroupName: "",
    },
  });

  useEffect(() => {
    setValue("menuGroupName", selectedMenuGroup?.menuGroupName ?? "");
  }, [selectedMenuGroup]);

  return (
    <div className="flex flex-col lg:flex-row pt-[2px] mb-[15px] min-h-[45px] text-[12px] font-bold leading-[40px]">
      <div className="text-[18px] mr-5">
        {groupModifyActive && selectedMenuGroup ? (
          <form onSubmit={handleSubmit(groupModify)}>
            <div>
              <p>
                <input
                  type="text"
                  {...register("menuGroupName", {
                    required: "그룹명을 입력해주세요.",
                    minLength: {
                      value: 2,
                      message: "그룹명은 최소 2글자 이상이어야 합니다.",
                    },
                    maxLength: {
                      value: 7,
                      message: "그룹명은 최대 7글자이어야 합니다..",
                    },
                  })}
                  className="pl-2 w-[calc(100%-50px)] max-w-[300px] font-normal text-[15px] border box-border rounded-tl-lg rounded-bl-lg"
                  placeholder={selectedMenuGroup.menuGroupName}
                />

                <button className="w-[50px] text-[16px] bg-white border rounded-tr-lg rounded-br-lg">
                  수정
                </button>
              </p>
              {errors.menuGroupName ? (
                <span className="p-1 pl-2 pr-2 text-red-500">
                  {errors.menuGroupName.message}
                </span>
              ) : null}
            </div>
          </form>
        ) : (
          <>{selectedMenuGroup?.menuGroupName}</>
        )}
      </div>
      <div className="flex">
        <p className=" text-[#999] mr-5">
          {"등록메뉴 "}
          {selectedMenuGroup?.menuCount ? selectedMenuGroup.menuCount : 0}개
        </p>
        <p className="mr-5 text-sub">
          <button onClick={() => setGroupModifyActive(!groupModifyActive)}>
            {groupModifyActive ? "취소" : "그룹 수정"}
          </button>
        </p>
        <p className="mr-5 text-main">
          <button
            onClick={() => menuGroupDelete(selectedMenuGroup?.menuGroupId)}
          >
            그룹 삭제
          </button>
        </p>
      </div>
    </div>
  );
};
