import { FC, PropsWithChildren, useState, useMemo, useEffect } from "react";
import { PopupButton } from "./PopupButton";
import { useForm } from "react-hook-form";
import { PopupLayoutAdmin } from "./PopupLayoutAdmin";
import { useSelector } from "react-redux";
import { useAdminContext } from "../../context";
import { MenuApi, OptionApi } from "../../service";
import type {
  MenuGroup,
  Menu,
  OptionGroup,
  Option,
  SortedOptions,
} from "../../type";
import type { AdminState } from "../../store/AdminState";
import ImageUploadBox from "../ImageUploadBox";
import { optionSort } from "../../utils";
import { List, ListItem, Collapse } from "@mui/material";
import * as CT from "../../constants";
import * as U from "../../utils";

interface MenuInsertPopupProps {
  popUpActive: (active: boolean, popupId: string) => void;
  selectedGroup: MenuGroup | undefined;
  setSelectedGroup: (menuGroup: MenuGroup) => void;
  usuallyMenu?: Menu | undefined;
  setUsuallyMenu?: (usuallyMenu: Menu | undefined) => void;
}

export const MenuInsertPopup: FC<PropsWithChildren<MenuInsertPopupProps>> = ({
  popUpActive,
  selectedGroup,
  usuallyMenu,
  setUsuallyMenu,
}) => {
  const { loginState, setAlertState } = useAdminContext();
  const { useAddMenu, useGetMenuGroups, useUpdateMenu } = MenuApi();
  const { useGetOptionGroups, useGetOptions } = OptionApi();
  const { isGetOptionGrLoading } = useGetOptionGroups(loginState.storeId);
  const { isgGetOptionLoading } = useGetOptions(loginState.storeId);
  const menuState = useSelector<AdminState, Menu[]>(({ menu }) => menu);
  const optionGroupsState = useSelector<AdminState, OptionGroup[]>(
    ({ optionGroup }) => optionGroup
  );
  const optionsState = useSelector<AdminState, Option[]>(
    ({ option }) => option
  );
  const { addMenuMutate } = useAddMenu();
  const { updateMenuMutate } = useUpdateMenu(() =>
    setAlertState("메뉴 수정이 완료되었습니다.")
  );

  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [sortedOption, setSortedOption] = useState<SortedOptions[]>();
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [activeAddOption, setActiveAddOption] = useState<boolean>(false);

  const toggleSubMenu = (menuIndex: number) => {
    if (openMenu === menuIndex) {
      setOpenMenu(null);
    } else {
      setOpenMenu(menuIndex);
    }
  };

  const initialMenu: Menu = {
    menuId: "",
    menuName: "",
    storeId: loginState.storeId,
    menuGroupId: "",
    price: 0,
    menuDescrip: "",
    imagePath: "",
    optionGroupId: [],
    saleStatus: CT.saleStatusKeys[0],
    order: 0,
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      ...initialMenu,
    },
  });

  //메뉴 그룹 정보 로드
  useGetMenuGroups(loginState.storeId);

  //사용자의 입력과 관계없이 자동으로 입력되는 메뉴 정보
  useEffect(() => {
    setValue("storeId", loginState.storeId);
    if (usuallyMenu) {
      setActiveAddOption(false);
      Object.entries(usuallyMenu).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    } else {
      setActiveAddOption(true);

      const createMenuId = U.createId("MENU", loginState.storeId);
      const mostBigOrderMenu =
        menuState.length > 0
          ? Math.max(...menuState.map((menu) => menu.order))
          : -1;
      const order = mostBigOrderMenu + 1;
      setValue("menuId", createMenuId);
      setValue("order", order);
      setValue(
        "menuGroupId",
        selectedGroup?.menuGroupId ? selectedGroup?.menuGroupId : ""
      );
    }
  }, []);

  //옵션 그룹 아이디 기준으로 옵션 항목 리스트 생성
  useEffect(() => {
    const sortedOptions = optionSort(optionGroupsState, optionsState);
    setSortedOption(sortedOptions);
  }, [optionGroupsState, optionsState]);

  //메뉴 최종 등록
  const menuAddConfirm = (data: Menu) => {
    const { imagePath, optionGroupId, order, ...emtpyChkElement } = data;
    const hasEmpty = Object.values(emtpyChkElement).some(
      (value) =>
        (typeof value === "string" && value.trim() === "") ||
        Number(value) < 0 ||
        value === null ||
        value === undefined
    );
    if (!hasEmpty) {
      if (!usuallyMenu) {
        addMenuMutate(data);
      } else {
        const modifyMenuAppend: Menu[] = new Array(data);
        updateMenuMutate(modifyMenuAppend);
      }
      setUploadImage(null);
      Object.entries(initialMenu).forEach(([key, value]) => {
        setValue(key as any, value);
      });
      reset();
      setOpenMenu(null);
      popUpActive(false, "");
    } else {
      console.log("data : ", data);
      setAlertState("입력되지 않은 정보가 있습니다.");
    }
    setUsuallyMenu && setUsuallyMenu(undefined);
  };

  const setImagePath = (imagePath: string) => {
    setValue("imagePath", imagePath);
  };

  const cancleAddMenu = () => {
    Object.entries(initialMenu).forEach(([key, value]) => {
      setValue(key as any, value);
    });
    reset();
    setUploadImage(null);
    popUpActive(false, "");
    setUsuallyMenu && setUsuallyMenu(undefined);
    setOpenMenu(null);
  };

  const addSelectOption = useMemo(() => {
    return (
      <>
        {watch("optionGroupId").length > 0 || activeAddOption ? (
          sortedOption ? (
            sortedOption.map((options, index) => {
              return activeAddOption ||
                watch("optionGroupId").includes(options.optionGroupId) ? (
                <div className="ml-5 mr-5" key={options.optionGroupId + index}>
                  <ListItem
                    type="button"
                    component="button"
                    onClick={() => toggleSubMenu(index)}
                    key={index}
                  >
                    <p className="flex leading-[52px]">
                      <span className="mr-2 font-bold">
                        {activeAddOption ? (
                          <input
                            type="checkbox"
                            {...register("optionGroupId")}
                            value={options.optionGroupId}
                            className="mr-2"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        ) : null}
                        {options.groupName}
                      </span>
                      <span className="text-[13px]">
                        {"("}
                        {options.required ? "필수 " : "부가 "} /
                        {options.selectionType === "single" ? " 단일" : " 복수"}
                        {") 선택"}
                      </span>
                      {/* <span className="text-[12px]">
                        {options.optionCount <= 0 &&
                          "항목이 없을 경우 고객에게 보이지 않습니다."}
                      </span> */}
                    </p>
                  </ListItem>
                  <Collapse
                    in={openMenu === index}
                    timeout="auto"
                    unmountOnExit
                  >
                    <ul className="pt-2 pb-2 pl-10 pr-10 bg-[#f2f2f2] rounded-md">
                      {options.options.map((option, index) => (
                        <li
                          key={option.optionId + "insert" + index}
                          className="flex justify-between mt-5 mb-5"
                        >
                          <span className="text-[14px] font-bold">
                            {option.optionName}
                          </span>
                          <span className="text-[14px]">
                            {option.price == 0
                              ? "추가비용 없음"
                              : "+" +
                                new Intl.NumberFormat().format(option.price) +
                                "원"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Collapse>
                </div>
              ) : null;
            })
          ) : null
        ) : (
          <div className="m-10 mb-20 text-center">연결된 옵션이 없습니다.</div>
        )}
      </>
    );
  }, [sortedOption, register, openMenu, activeAddOption]);

  return (
    <form
      onSubmit={handleSubmit(menuAddConfirm)}
      className="min-w-[320px] w-screen lg:w-full"
    >
      <PopupLayoutAdmin title={usuallyMenu ? "메뉴수정" : "메뉴등록"}>
        <div className="p-[25px] pb-[75px] flex-grow overflow-y-scroll ">
          <p className="pl-[15px] leading-[40px] font-bold text-[20px]">
            {selectedGroup?.menuGroupName}
          </p>
          <div className="flex flex-col lg:flex-row mt-[15px] w-full lg:h-[220px] justify-between">
            <div>
              <ImageUploadBox<Menu>
                uploadType="menu"
                uploadImageState={uploadImage}
                setUploadImageState={setUploadImage}
                usuallyImage={watch("imagePath")}
                setUploadPath={setImagePath}
                attribName="imagePath"
                width={220}
                height={220}
              />
            </div>
            <div className="flex flex-col w-full lg:w-[285px] justify-between">
              <p className="flex pl-[10px] mt-[30px] lg:mt-0 bg-white rounded-lg border-2 leading-[53px]">
                <legend className="inline-block w-[30%] font-bold">
                  메뉴명
                </legend>
                <input
                  type="text"
                  {...register("menuName", {
                    required: "메뉴명은 필수입니다.",
                    minLength: {
                      value: 3,
                      message: "최대 3글자 이상 입력해야 합니다.",
                    },
                    maxLength: {
                      value: 20,
                      message: "최대 20글자 입력 가능합니다.",
                    },
                  })}
                  placeholder={
                    errors.menuName ? errors.menuName.message : "메뉴명"
                  }
                  className={`inline-block w-[70%] p-1 pl-2 pr-2 h-[53px] text-[16px] `}
                />
              </p>
              <p className="px-3 h-5 text-[12px] text-left text-red-500">
                {errors.menuName?.message}
              </p>
              <p className="flex pl-[10px] mt-[10px] lg:mt-0 bg-white rounded-lg border-2">
                <legend className="inline-block w-[30%] font-bold leading-[53px]">
                  판매가격
                </legend>
                <input
                  type="number"
                  {...register("price", {
                    valueAsNumber: true,
                    required: "가격은 필수입니다.",
                    min: {
                      value: 0,
                      message: "0원 미만의 가격은 입력할 수 없습니다.",
                    },
                  })}
                  value={errors.price && ""}
                  placeholder={"0"}
                  className={`inline-block w-[70%] p-1 pl-2 pr-2 h-[53px] text-[16px] `}
                />
              </p>
              <p className="px-3 h-5 text-[12px] text-left text-red-500">
                {errors.price?.message}
              </p>
              <p className="flex pl-[10px] mt-[10px] lg:mt-0 bg-white rounded-lg border-2">
                <legend className="inline-block w-[30%] font-bold leading-[53px]">
                  판매상태
                </legend>
                <select
                  {...register("saleStatus")}
                  className="inline-block w-[70%] p-1 pl-2 pr-2 h-[53px] text-[16px] bg-white"
                >
                  {CT.saleStatusKeys.map((key) => (
                    <option value={key}>{CT.saleStatus[key]}</option>
                  ))}
                </select>
              </p>
            </div>
          </div>
          <div className="mt-[30px] flex bg-white border-2 rounded-lg">
            <legend className="p-[15px] inline-block w-[20%] font-bold">
              메뉴설명
            </legend>
            <textarea
              {...register("menuDescrip", {
                required: "메뉴 설명은 필수입니다.",
                minLength: {
                  value: 5,
                  message: "최소 5글자 이상 입력해야 합니다.",
                },
                maxLength: {
                  value: 100,
                  message: "최대 100글자 입력 가능합니다.",
                },
              })}
              maxLength={100}
              placeholder="메뉴를 소개해주세요."
              className={`block p-[15px] w-[80%] h-[120px] resize-none `}
            />
          </div>
          <p className="px-3 h-5 text-[12px] text-left text-red-500">
            {errors.menuDescrip?.message}
          </p>
          <div className="mt-[10px] bg-white border-2 rounded-lg">
            <p className="flex">
              <legend className="p-[15px] inline-block w-[20%] font-bold">
                {activeAddOption ? "옵션 추가" : "연결옵션"}
              </legend>
              <span className="p-[15px] font-bold text-main">
                <button
                  type="button"
                  onClick={() => setActiveAddOption(!activeAddOption)}
                >
                  {activeAddOption ? "완료" : "옵션 추가"}
                </button>
              </span>
            </p>
            <List>{addSelectOption}</List>
          </div>
        </div>
        <PopupButton
          type="admin"
          confirmText={usuallyMenu ? "메뉴수정" : "메뉴등록"}
          handleCancel={cancleAddMenu}
          cancelText="취소"
        />
      </PopupLayoutAdmin>
    </form>
  );
};
