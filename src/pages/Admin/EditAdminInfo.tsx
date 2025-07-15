import { useRef } from "react";
import { useForm } from "react-hook-form";
import * as T from "../../type";
import * as CT from "../../constants";
import { useAdminContext } from "../../context";
import { ChangeEvent, useEffect, useState } from "react";
import { AuthApi } from "../../service";
import { AddressInsertPopup, FetchButton } from "../../components";
import { AdminMain } from "./AdminMain";
import { RoundedBox } from "../../components";
import { PopupContainer, PopupBackGround, usePopup } from "../../components";
import ImageUploadBox from "../../components/ImageUploadBox";
import { TabMenuBar } from "../../components";
import { PasswordChkPopup, usePasswordChk } from "../../components";
import { useFormAddress } from "../../hook";
import { getRandomNum } from "../../utils";

const generateRule = (field: keyof typeof CT.adminSignUpRules) => {
  const rule = CT.adminSignUpRules[field];
  return {
    required: rule.required ? rule.requiredMsg : false,
    minLength: {
      value: rule.minLength,
      message: rule.minLengthMsg,
    },
    maxLength: {
      value: rule.maxLength,
      message: rule.maxLengthMsg,
    },
    pattern: {
      value: rule.pattern,
      message: rule.patternMsg,
    },
  };
};

export const EditAdminInfo = () => {
  const tabNames = ["스토어 정보 수정", "영업시간 수정"];
  const tabLinks = ["/admin/editAdmin", "/admin/editOpHours"];
  const currentTab = "스토어 정보 수정";

  const ADDRESS_INSERT_POUP_ID = "addressInsertPop";

  const { loginState, setAlertState } = useAdminContext();
  const { useCheckAdminIdAvailability: storePublicIdChk, useAdminUpdate } =
    AuthApi();
  const {
    idAvailData: publicIdAvailData,
    mutateChkIdAvail: mutateChkPublicId,
    isChkIdAvailPending: isChkPublicIdPending,
  } = storePublicIdChk();
  const { mutateUpdateAdmin, isUpdateAdminPending } = useAdminUpdate(
    CT.ADMIN_ACCESS_TOKEN
  );

  const { popupActive, setPopupActive } = usePopup();
  const PASS_CHK_POP_ID = "passchk_pop";

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: T.initialEDStore,
    mode: "onChange",
  });

  const [logoPath, setLogoPath] = useState<File | null>(null);
  const [heroBannerPath, setHeroBannerPath] = useState<File | null>(null);

  const [originLoginState, setoriginLoginState] = useState<T.EditStore>(
    T.initialEDStore
  );

  const { passwordChk, setPasswordChk } = usePasswordChk();

  const noticeInput = () => {
    setAlertState(
      "개인정보 수집 방지를 위해 이름과 연락처의 입력을 제한하고 있습니다."
    );
  };

  //랜덤 사용자 데이터 입력
  useEffect(() => {
    noticeInput();
    const randomNum = getRandomNum(20);
    const constantPerson = CT.randomPeople[randomNum];
    setValue("name", constantPerson.name);
    setValue("tel", constantPerson.tel);
  }, []);

  useEffect(() => {
    setPopupActive({ active: true, popupId: PASS_CHK_POP_ID });
  }, []);

  useEffect(() => {
    const { logined, ...rest } = loginState;
    setoriginLoginState({ ...rest });
    Object.entries(rest)
      .filter(([key]) => key !== "name" && key !== "tel")
      .map(([key, value]) => {
        setValue(key as any, value);
      });
  }, [loginState]);

  //주소 입력
  const { formAddress, setInitialAddress } = useFormAddress();

  useEffect(() => {
    setInitialAddress(loginState.address);
  }, [loginState]);

  const onSetAddress = (data: Omit<T.Address, "detailedAddress">) => {
    //입력폼 수정 제한을 위해 데이터를 표시하는 용도
    setInitialAddress(data);

    //실제 폼 입력 데이터
    setValue("address.zonecode", data.zonecode);
    setValue("address.sigunguCode", data.sigunguCode);
    setValue("address.address", data.address);
    setPopupActive({ popupId: "", active: false });
  };

  //입력폼이 비워지면 원래 필드 데이터를 복원
  const changeField =
    (key: keyof T.EditStore) => (e: ChangeEvent<HTMLInputElement>) => {
      const changeValue = e.target.value;

      if (changeValue.trim() === "") {
        setValue(key as any, originLoginState[key]);
      }
    };

  const setUploadPath =
    (key: "logoPath" | "heroBannerPath") => (value: string) => {
      setValue(key, value);
    };

  const contactInfoKey = [
    "storeName",
    "businessType",
    "businessNumber",
  ] as const;
  const addressInfoKey = [
    "address.zonecode",
    "address.sigunguCode",
    "address.address",
  ] as const;

  const confirmEditAdmin = (data: T.EditStore) => {
    // eslint-disable-next-line no-restricted-globals -- using browser confirm intentionally
    const confirmEdit = confirm("스토어 정보를 수정합니다. 진행하시겠습니까?");
    if (!confirmEdit) return;
    mutateUpdateAdmin(data);
  };

  return (
    <>
      <PopupBackGround
        popupActive={popupActive}
        setPopupActive={setPopupActive}
      >
        <PopupContainer popupActive={popupActive} popupId={PASS_CHK_POP_ID}>
          <PasswordChkPopup
            setPopupActive={setPopupActive}
            setPasswordChk={setPasswordChk}
          />
        </PopupContainer>
        <PopupContainer
          popupActive={popupActive}
          popupId={ADDRESS_INSERT_POUP_ID}
        >
          <AddressInsertPopup
            type="admin"
            popupActive={popupActive}
            setPopupActive={setPopupActive}
            onComplete={onSetAddress}
          />
        </PopupContainer>
      </PopupBackGround>
      <AdminMain>
        {passwordChk ? (
          <>
            <TabMenuBar
              tabNames={tabNames}
              tabLinks={tabLinks}
              currentTab={currentTab}
            />
            <section className="items-center justify-center min-h-screen bg-[#f2f2f2]">
              <form
                onSubmit={handleSubmit(confirmEditAdmin)}
                className="w-full text-center "
              >
                <RoundedBox
                  title="계정 정보"
                  underLine={false}
                  className="pb-10"
                >
                  <div className="">
                    <legend className="block py-2 font-bold text-left">
                      아이디
                    </legend>
                    <p className="flex">{loginState.storeId}</p>
                  </div>
                  <div className="mt-10">
                    <legend className="block py-2 font-bold text-left">
                      공개 아이디
                    </legend>
                    <p className="flex">{loginState.storePublicId}</p>
                  </div>
                </RoundedBox>
                <RoundedBox
                  title="브랜드 정보"
                  underLine={false}
                  className="pb-10"
                >
                  <>
                    <div className="mt-10 text-left">
                      <span className="flex mb-3 font-bold">
                        <span className="mr-3 text-[16px] text-[#666666]">
                          스토어 로고
                        </span>
                        <span className="text-[12px] text-main">
                          {"*스토어를 대표하는 로고 이미지를 등록해주세요."}
                          <br />
                          {"(추천 사이즈 140px × 140px)"}
                        </span>
                      </span>
                      <div className="">
                        <ImageUploadBox<T.EditStore>
                          uploadType="storeInfo"
                          uploadImageState={logoPath}
                          setUploadImageState={setLogoPath}
                          usuallyImage={watch("logoPath") ?? ""}
                          attribName="logoPath"
                          setUploadPath={setUploadPath("logoPath")}
                          imageBoxType="auto"
                        />
                      </div>
                    </div>
                    <div className="mt-10 text-left">
                      <span className="flex mb-3 font-bold">
                        <span className="mr-3 text-[16px] text-[#666666]">
                          스토어 배경 이미지
                        </span>
                        <span className="text-[12px] text-main">
                          {
                            "*스토어 페이지 배경을 장식할 이미지를 등록해주세요."
                          }
                          <br />
                          {"(추천 사이즈 1920px × 250px)"}
                        </span>
                      </span>
                      <div className="">
                        <ImageUploadBox<T.EditStore>
                          uploadType="storeInfo"
                          uploadImageState={heroBannerPath}
                          setUploadImageState={setHeroBannerPath}
                          usuallyImage={watch("heroBannerPath") ?? ""}
                          attribName="heroBannerPath"
                          setUploadPath={setUploadPath("heroBannerPath")}
                          imageBoxType="auto"
                        />
                      </div>
                    </div>
                    {contactInfoKey.map((info, index) => (
                      <div
                        key={info + "Area"}
                        className={`${index === 0 ? "mt-5" : "mt-3"}`}
                      >
                        <legend className="block py-2 font-bold text-left">
                          {CT.adminSignUpRules[info].kor}{" "}
                          {CT.adminSignUpRules[info].required ? (
                            <span className="text-main">*</span>
                          ) : null}
                        </legend>
                        <p className="flex">
                          <input
                            {...register(info, generateRule(info))}
                            type="text"
                            onChange={changeField(info as keyof T.EditStore)}
                            placeholder={CT.adminSignUpRules[info].kor ?? ""}
                            maxLength={
                              CT.adminSignUpRules[info].maxLength ?? 99
                            }
                            className="flex-grow block p-3 mr-1 border-2 rounded-full focus:outline-none focus:border-sub"
                          />
                        </p>
                        <p className="block w-full px-3 py-2 text-left text-red-500">
                          {errors[info]?.message}
                        </p>
                      </div>
                    ))}
                    <div className="mt-3">
                      <legend className="block py-2 font-bold text-left">
                        {CT.adminSignUpRules.name.kor}{" "}
                        {CT.adminSignUpRules.name.required ? (
                          <span className="text-main">*</span>
                        ) : null}
                      </legend>
                      <p className="flex">
                        <span
                          onClick={noticeInput}
                          className="flex-grow block p-3 mr-1 h-[52px] text-left border-2 rounded-full"
                        >
                          {watch("name")}
                        </span>
                      </p>
                    </div>
                    <div className="mt-3">
                      <legend className="block py-2 font-bold text-left">
                        {CT.adminSignUpRules.tel.kor}{" "}
                        {CT.adminSignUpRules.tel.required ? (
                          <span className="text-main">*</span>
                        ) : null}
                      </legend>
                      <p className="flex">
                        <span
                          onClick={noticeInput}
                          className="flex-grow block p-3 mr-1 text-left h-[52px] border-2 rounded-full"
                        >
                          {watch("tel")}
                        </span>
                      </p>
                    </div>
                    <div>
                      <legend className="block py-2 font-bold text-left">
                        대표 메뉴 카테고리
                      </legend>
                      <div className="flex flex-wrap">
                        {CT.categoryNameKeys
                          .filter((cate) => cate !== "empty")
                          .map((cate) => (
                            <p
                              key={cate + "key"}
                              className="flex flex-col items-center w-1/3 mt-2"
                            >
                              <input
                                {...register("category", {
                                  required: "대표 메뉴 카테고리를 선택해주세요",
                                })}
                                type="radio"
                                id={cate + "id"}
                                onChange={changeField("category")}
                                value={cate}
                                className="hidden peer"
                              />
                              <label
                                htmlFor={cate + "id"}
                                className={`block px-2 py-3 w-11/12 rounded-xl bg-white border-2 border-sub text-sub 
                                      peer-checked:bg-sub peer-checked:text-white font-bold cursor-pointer`}
                              >
                                {CT.categoryName[cate]}
                              </label>
                            </p>
                          ))}
                        <p className="block w-full px-3 py-2 text-left text-red-500">
                          {errors.category?.message}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5">
                      <legend className="block py-2 font-bold text-left">
                        최소주문금액 <span className="text-main">*</span>
                      </legend>
                      <p className="flex ">
                        <input
                          {...register("minOrderAmount", {
                            required:
                              "주문시 필요한 최소주문금액을 입력해주세요",
                            valueAsNumber: true,
                            min: {
                              value: 0,
                              message: "0원 미만으로 입력할 수 없습니다.",
                            },
                          })}
                          type="number"
                          onChange={changeField("minOrderAmount")}
                          placeholder="최소주문금액"
                          className="flex-grow block p-3 mr-1 border-2 rounded-full focus:outline-none focus:border-sub"
                        />
                      </p>
                      <p className="block w-full px-3 py-2 text-left text-red-500">
                        {errors.minOrderAmount?.message}
                      </p>
                    </div>
                    <div className="mt-5">
                      <legend className="block py-2 font-bold text-left">
                        배달비 <span className="text-main">*</span>
                      </legend>
                      <p className="flex ">
                        <input
                          {...register("deliveryFee", {
                            required: "배달비를 입력해주세요.",
                            valueAsNumber: true,
                            min: {
                              value: 0,
                              message: "0원 미만으로 입력할 수 없습니다.",
                            },
                          })}
                          type="number"
                          onChange={changeField("deliveryFee")}
                          placeholder="배달비"
                          className="flex-grow block p-3 mr-1 border-2 rounded-full focus:outline-none focus:border-sub"
                        />
                      </p>
                      <p className="block w-full px-3 py-2 text-left text-red-500">
                        {errors.deliveryFee?.message}
                      </p>
                    </div>
                    <div className="mt-5">
                      <legend className="block py-2 font-bold text-left">
                        주문 결제수단 <span className="text-main">*</span>
                      </legend>
                      <div className="flex flex-wrap items-center">
                        {CT.paymentMethodKeys.map((payment) => (
                          <p
                            key={payment + "key"}
                            className="flex flex-col items-center w-1/3 mt-2"
                          >
                            <input
                              {...register("paymentMethod", {
                                required: "주문 결제수단을 선택해주세요",
                              })}
                              type="checkbox"
                              id={payment + "id"}
                              value={payment}
                              className="hidden peer"
                            />
                            <label
                              htmlFor={payment + "id"}
                              className="block w-11/12 h-full px-2 py-3 font-bold bg-white border-2 cursor-pointer rounded-xl border-sub text-sub peer-checked:bg-sub peer-checked:text-white"
                            >
                              {CT.paymentMethod[payment]}
                            </label>
                          </p>
                        ))}
                        <p className="block w-full px-3 py-2 text-left text-red-500">
                          {errors.paymentMethod?.message}
                        </p>
                      </div>
                    </div>
                  </>
                </RoundedBox>
                <RoundedBox title="주소" underLine={false} className="pb-10">
                  <>
                    <div className="mt-5">
                      {addressInfoKey.map((info, index) => {
                        const key = info.replace("address.", "") as keyof Omit<
                          T.Address,
                          "detailedAddress"
                        >;
                        return (
                          <div key={info + "Area"}>
                            <p className="flex">
                              <input
                                {...register(info, {
                                  required: {
                                    value: true,
                                    message: "주문찾기를 해주세요.",
                                  },
                                })}
                                id={info}
                                type={`${
                                  info === "address.sigunguCode"
                                    ? "hidden"
                                    : "mt-3 text"
                                }`}
                                readOnly
                                placeholder={CT.addressKorNames[info] ?? ""}
                                value={formAddress[key]}
                                className="flex-grow block p-3 my-2 mr-1 border-2 rounded-full focus:outline-none focus:border-sub"
                              />
                              {info === "address.zonecode" ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPopupActive({
                                      active: true,
                                      popupId: ADDRESS_INSERT_POUP_ID,
                                    })
                                  }
                                  className="px-2 my-2 ml-3 font-bold text-white rounded-xl bg-main hover:bg-main-hover"
                                >
                                  주소찾기
                                </button>
                              ) : null}
                            </p>
                            {info !== "address.sigunguCode" ? (
                              <p className="block w-full px-3 py-2 text-left text-red-500">
                                {errors.address?.[key]?.message}
                              </p>
                            ) : null}
                          </div>
                        );
                      })}
                      <div className="mt-3">
                        <p className="flex">
                          <input
                            {...register(
                              "address.detailedAddress",
                              generateRule("address.detailedAddress")
                            )}
                            type="text"
                            placeholder={"상세주소"}
                            className="flex-grow block p-3 mr-1 border-2 rounded-full focus:outline-none focus:border-sub"
                          />
                        </p>
                        <p className="block w-full px-3 py-2 text-left text-red-500">
                          {errors.address?.detailedAddress?.message}
                        </p>
                      </div>
                    </div>

                    <FetchButton
                      type="submit"
                      className="p-4 mt-10 font-bold text-white bg-main rounded-xl"
                      isFetching={isUpdateAdminPending}
                    >
                      스토어 정보 수정
                    </FetchButton>
                  </>
                </RoundedBox>
              </form>
            </section>
          </>
        ) : null}
      </AdminMain>
    </>
  );
};
