import {
  FC,
  PropsWithChildren,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import type { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { useAdminContext } from "../../context";
import { OptionApi } from "../../service";
import { useForm } from "react-hook-form";
import type { OptionGroup, Option } from "../../type";
import type { AdminState } from "../../store/AdminState";
import * as U from "../../utils";

interface OptionInsertCellPopupProps {
  visibleActive: boolean;
  setVisibleActive: (active: boolean) => void;
  selectedGroup: OptionGroup | undefined;
  setSelectedGroup: (menuGroup: OptionGroup) => void;
  usuallyOption?: Option | undefined;
  setUsuallyOption?: (usuallyMenu: Option | undefined) => void;
}

export const OptionInsertCell: FC<
  PropsWithChildren<OptionInsertCellPopupProps>
> = ({
  visibleActive,
  setVisibleActive,
  selectedGroup,
  usuallyOption,
  setUsuallyOption,
}) => {
  const { loginState, setAlertState } = useAdminContext();
  const { useAddOption, useGetOptionGroups, useUpdateOption } = OptionApi();
  useGetOptionGroups(loginState.storeId);
  const { addOptionMutate } = useAddOption();
  const { updateOptionMutate } = useUpdateOption();

  const optionState = useSelector<AdminState, Option[]>(({ option }) => option);

  const initialOption: Option = {
    optionId: "",
    optionGroupId: "",
    optionName: "",
    storeId: loginState.storeId,
    price: 0,
    order: 0,
  };

  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: initialOption });

  //사용자의 입력과 관계없이 자동으로 입력되는 값
  useEffect(() => {
    if (usuallyOption) {
      Object.entries(usuallyOption).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    } else {
      const createMenuId = U.createId("OPTION", loginState.storeId);
      const mostBigOrderMenu =
        optionState.length > 0
          ? Math.max(...optionState.map((option) => option.order))
          : -1;
      const order = mostBigOrderMenu + 1;
      setValue("optionId", createMenuId);
      setValue("order", order);
      setValue(
        "optionGroupId",
        selectedGroup?.optionGroupId ? selectedGroup?.optionGroupId : ""
      );
    }
  }, [selectedGroup, loginState, optionState, usuallyOption]);

  const changeForm = useCallback(
    (key: keyof Option) =>
      (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        if (typeof watch(key) === "number" && Number(inputValue) < 0) {
          setAlertState("금액은 0원 미만으로 설정할 수 없습니다.");
          setValue(key, 0);
          return;
        }
      },
    []
  );

  const optionAddConfirm = (data: Option) => {
    setVisibleActive && setVisibleActive(false);
    if (!usuallyOption) {
      addOptionMutate(data);
    } else {
      const modifyMenuAppend: Option[] = new Array(data);
      updateOptionMutate(modifyMenuAppend);
    }
    reset();
    setUsuallyOption && setUsuallyOption(undefined);
  };

  const cancleAddMenu = () => {
    reset();
    setVisibleActive && setVisibleActive(false);
    setUsuallyOption && setUsuallyOption(undefined);
  };

  return (
    <form
      onSubmit={handleSubmit(optionAddConfirm)}
      className={`${
        visibleActive ? "flex flex-col lg:flex-row" : "hidden"
      } w-full h-[100px] lg:h-[65px] border-b-2 bg-[#f2f2f2] lg:leading-[65px] `}
    >
      <div className="lg:pr-5 lg:ml-3 flex items-center pt-4 lg:pt-0 justify-between w-full lg:w-[80%] text-[16px] h-[65px] font-bold">
        <p className="w-1/2">
          <input
            {...register("optionName", {
              required: "옵션명을 입력해주세요",
              minLength: {
                value: 2,
                message: "옵션명은 2글자부터 입력가능합니다.",
              },
              maxLength: {
                value: 30,
                message: "옵션명은 30글자까지 입력가능합니다.",
              },
            })}
            name="optionName"
            type="text"
            placeholder="옵션명"
            className="w-full lg:w-auto pl-2 h-[35px] border-2 rounded-md"
          />
        </p>
        <p className="flex items-center w-1/2">
          <span className="w-[30px] px-[10px]">+</span>
          <input
            {...register("price", {
              valueAsNumber: true,
              min: {
                value: 0,
                message: "0원 미만의 가격은 입력할 수 없습니다.",
              },
            })}
            name="price"
            type="number"
            placeholder="가격"
            className="w-[calc(100%-30px)] lg:m-2 pl-2 h-[35px] border-2 rounded-md"
            onChange={changeForm("price")}
          />
        </p>
      </div>
      <div className="flex justify-end items-center py-3 w-full lg:w-[20%] z-[101]">
        <span className="lg:flex-1 text-sub lg:pl-3 pr-3 text-center text-[14px] font-bold">
          <button>{usuallyOption ? "수정완료" : "항목등록"}</button>
        </span>
        <span className="lg:flex-1 text-main pl-3 lg:pr-3 text-center text-[14px] font-bold">
          <button type="button" onClick={cancleAddMenu}>
            취소
          </button>
        </span>
      </div>
    </form>
  );
};
