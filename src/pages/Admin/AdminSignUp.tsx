import { useRef } from "react";
import { useForm } from "react-hook-form";
import type { Store } from "../../type";
import * as T from "../../type";
import * as CT from "../../constants";
import { ChangeEvent, useEffect, useState } from "react";
import { AuthApi } from "../../service";
import {
  AddressInsertPopup,
  FetchButton,
  PopupBackGround,
  PopupContainer,
  usePopup,
} from "../../components";
import { useAdjustHeight, useFormAddress } from "../../hook";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getRandomNum } from "../../utils";
import { useAdminContext } from "../../context";

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

export const AdminSignUP = () => {
  const ADDRESS_INSERT_POUP_ID = "addressInsertPop";
  const { popupActive, setPopupActive } = usePopup();
  const navigate = useNavigate();
  const { sectionHeight, observerHeight, adjustHeight } = useAdjustHeight();
  const {
    useCheckAdminIdAvailability: storeIdChk,
    useCheckAdminIdAvailability: storePublicIdChk,
    useAdminSignUp,
  } = AuthApi();
  const { idAvailData, mutateChkIdAvail, isChkIdAvailPending } = storeIdChk();
  const {
    idAvailData: publicIdAvailData,
    mutateChkIdAvail: mutateChkPublicId,
    isChkIdAvailPending: isChkPublicIdPending,
  } = storePublicIdChk();
  const { mutateSignUp, isSignUpPending } = useAdminSignUp(() =>
    navigate("/admin/login")
  );
  const { setAlertState } = useAdminContext();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: T.initialStore,
    mode: "onChange",
  });

  const parentRef = useRef<HTMLFormElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const [idChk, setIdChk] = useState<boolean>(false);
  const [idChkMsg, setIdChkMsg] = useState<string>("");
  const [publicIdChk, setPublicIdChk] = useState<boolean>(false);
  const [publicIdChkMsg, setPublicIdChkMsg] = useState<string>("");
  const [passChkField, setPassChkField] = useState<string>("");
  const [passChk, setPassChk] = useState<boolean>(false);
  const [passChkMsg, setPassChkMsg] = useState<string>("");

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
    observerHeight(childRef.current);
  }, []);

  useEffect(() => {
    adjustHeight(parentRef.current, childRef.current);
  }, [sectionHeight]);

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

  const confirmSignUp = (data: Store) => {
    // eslint-disable-next-line no-restricted-globals -- using browser confirm intentionally
    const confirmSignUp = confirm("가맹점 등록 신청합니다. 진행하시겠습니까?");
    if (!confirmSignUp) return;
    mutateSignUp(data);
  };

  const isStep1 = idChk && publicIdChk && passChk;
  const isStep2 =
    isStep1 &&
    !errors.minOrderAmount &&
    !errors.deliveryFee &&
    !errors.paymentMethod &&
    watch("paymentMethod").length !== 0 &&
    !errors.category &&
    watch("category") !== "empty" &&
    watch("name") !== "" &&
    watch("name") !== undefined &&
    watch("tel") !== "" &&
    watch("tel") !== undefined &&
    Object.values(contactInfoKey).every((info) => errors[info] === undefined) &&
    Object.values(contactInfoKey)
      .filter((key) => CT.adminSignUpRules[key].required)
      .every((info) => watch(info) !== "");

  // const isStep1 = true;
  // const isStep2 = true;
  // const isStep3 = true;

  //아이디 중복 확인 | 중복 확인 전 입력 유형 유효성 검사
  const checkIdAvail = (key: "storeId" | "storePublicId") => {
    const inputId = watch(key);
    const minLength = CT.adminSignUpRules[key].minLength ?? 0;
    const maxLength = CT.adminSignUpRules[key].maxLength ?? 99;
    const patternRegex = CT.adminSignUpRules[key].pattern;
    if (
      inputId.length < minLength ||
      inputId.length > maxLength ||
      !patternRegex.test(inputId)
    ) {
      if (key === "storeId") {
        setIdChk(false);
        setIdChkMsg(
          "아이디는 영문자와 숫자를 포함한 " +
            minLength +
            "~" +
            maxLength +
            "자의 조합으로 입력해주세요."
        );
      } else {
        setPublicIdChk(false);
        setPublicIdChkMsg(
          "공개 아이디는 영문자 " +
            minLength +
            "~" +
            maxLength +
            "자를 입력해주세요."
        );
      }

      return;
    }
    key === "storeId"
      ? mutateChkIdAvail({ adminId: inputId, key })
      : mutateChkPublicId({ adminId: inputId, key });
  };

  //아이디 중복 검사의 서버 처리 결과별 메세지 처리
  useEffect(() => {
    if (!idAvailData) return;
    const idChkData = idAvailData?.isIdAvailable;
    if (idChkData) {
      setIdChkMsg("사용 가능한 아이디입니다.");
    } else {
      setIdChkMsg("사용할 수 없는 아이디입니다");
    }
    setIdChk(idChkData);
  }, [idAvailData]);

  useEffect(() => {
    if (!publicIdAvailData) return;
    const idChkData = publicIdAvailData?.isIdAvailable;
    if (idChkData) {
      setPublicIdChkMsg("사용 가능한 공개 아이디입니다.");
    } else {
      setPublicIdChkMsg("사용할 수 없는 공개 아이디입니다");
    }
    setPublicIdChk(idChkData);
  }, [publicIdAvailData]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "storeId") {
        setIdChk(false);
        setIdChkMsg("");
      }
      if (name === "storePublicId") {
        setPublicIdChk(false);
        setPublicIdChkMsg("");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  //주소 입력
  const { formAddress, setInitialAddress } = useFormAddress();

  const onSetAddress = (data: Omit<T.Address, "detailedAddress">) => {
    //입력폼 수정 제한을 위해 데이터를 표시하는 용도
    setInitialAddress(data);

    //실제 폼 입력 데이터
    setValue("address.zonecode", data.zonecode);
    setValue("address.sigunguCode", data.sigunguCode);
    setValue("address.address", data.address);
    setPopupActive({ popupId: "", active: false });
  };

  //비밀번호 일치 검사
  const checkPassMatch = (e: ChangeEvent<HTMLInputElement>) => {
    const inputPass = watch("password");
    const filedName = e.target.name;
    const passwordChk = e.target.value;
    const minLength = CT.adminSignUpRules["password"].minLength ?? 0;
    const maxLength = CT.adminSignUpRules["password"].maxLength ?? 99;

    filedName === "passwordChk" && setPassChkField(passwordChk);

    if (
      inputPass.length < minLength ||
      inputPass.length > maxLength ||
      !CT.idRegex.test(inputPass)
    ) {
      setPassChk(false);
      setPassChkMsg(
        "비밀번호는 영문자와 숫자를 포함한 " +
          minLength +
          "~" +
          maxLength +
          "자의 조합으로 입력해주세요."
      );
      return;
    }

    if (inputPass === passwordChk) {
      setPassChk(true);
      setPassChkMsg("비밀번호가 일치합니다.");
    } else {
      setPassChk(false);
      setPassChkMsg("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <>
      <PopupBackGround
        popupActive={popupActive}
        setPopupActive={setPopupActive}
      >
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
      <section className="flex py-10 items-center justify-center min-h-screen bg-[#f2f2f2]">
        <form
          ref={parentRef}
          onSubmit={handleSubmit(confirmSignUp)}
          className=" w-[450px] min-h-[300px] border-2 duration-200 bg-white rounded-xl text-center overflow-hidden shadow-[0_5px_8px_rgba(0,0,0,0.1)]"
        >
          <div ref={childRef} className="m-10 mb-10">
            <p className="mr-3 text-[32px] text-main font-josefin font-bold">
              Track Bite
            </p>
            <p className="mt-3 text-2xl font-bold">가맹점 등록</p>
            <div className="mt-10">
              <legend className="block py-2 font-bold text-left">
                아이디{" "}
                {CT.adminSignUpRules["storeId"].required ? (
                  <span className="text-main">*</span>
                ) : null}
              </legend>
              <p className="flex">
                <input
                  {...register("storeId", generateRule("storeId"))}
                  id="storeId"
                  type="text"
                  placeholder="아이디"
                  maxLength={CT.adminSignUpRules["storeId"].maxLength ?? 99}
                  className="flex-grow block p-3 mr-2 border-2 rounded-full focus:outline-none focus:border-sub"
                />
                <FetchButton
                  type="button"
                  onClick={() => checkIdAvail("storeId")}
                  isFetching={isChkIdAvailPending}
                  className="p-2 text-white rounded-xl bg-sub hover:bg-sub-hover "
                >
                  {idChk ? "확인 완료" : "중복 확인"}
                </FetchButton>
              </p>
              <p
                className={`block px-3 py-2 w-full text-left ${
                  idChk ? "text-sky-600" : "text-red-500"
                }`}
              >
                {idChkMsg}
              </p>
            </div>
            <div className="mt-10">
              <legend className="block py-2 font-bold text-left">
                공개 아이디{" "}
                {CT.adminSignUpRules["storePublicId"].required ? (
                  <span className="text-main">*</span>
                ) : null}
              </legend>
              <p className="flex">
                <input
                  {...register("storePublicId", generateRule("storePublicId"))}
                  id="storePublicId"
                  type="text"
                  placeholder="공개 아이디"
                  maxLength={
                    CT.adminSignUpRules["storePublicId"].maxLength ?? 99
                  }
                  className="flex-grow block p-3 mr-2 border-2 rounded-full focus:outline-none focus:border-sub"
                />
                <FetchButton
                  type="button"
                  onClick={() => checkIdAvail("storePublicId")}
                  isFetching={isChkPublicIdPending}
                  className="p-2 text-white rounded-xl bg-sub hover:bg-sub-hover "
                >
                  {publicIdChk ? "확인 완료" : "중복 확인"}
                </FetchButton>
              </p>
              <p
                className={`block px-3 py-2 w-full text-left ${
                  publicIdChk ? "text-sky-600" : "text-red-500"
                }`}
              >
                {publicIdChkMsg}
              </p>
            </div>
            <div className="mt-5">
              <legend className="block py-2 font-bold text-left">
                비밀번호{" "}
                {CT.adminSignUpRules["password"].required ? (
                  <span className="text-main">*</span>
                ) : null}
              </legend>
              <p className="flex ">
                <input
                  {...register("password", generateRule("password"))}
                  id="password"
                  type="password"
                  name="password"
                  onChange={checkPassMatch}
                  maxLength={CT.adminSignUpRules["password"].maxLength ?? 99}
                  placeholder="비밀번호"
                  className="flex-grow block p-3 mr-1 border-2 rounded-full focus:outline-none focus:border-sub"
                />
              </p>
              <p className="flex mt-3">
                <input
                  name="passwordChk"
                  type="password"
                  onChange={checkPassMatch}
                  value={passChkField}
                  maxLength={CT.adminSignUpRules["password"].maxLength ?? 99}
                  placeholder="비밀번호 확인"
                  className="flex-grow block p-3 mr-1 border-2 rounded-full focus:outline-none focus:border-sub"
                />
              </p>
              <p
                className={`block px-3 py-2 w-full text-left ${
                  passChk ? "text-sky-600" : "text-red-500"
                }`}
              >
                {passChkMsg}
              </p>
            </div>
            {isStep1 && (
              <>
                <div className="mt-5">
                  <legend className="block py-2 font-bold text-left">
                    {CT.adminSignUpRules.name.kor}{" "}
                    {CT.adminSignUpRules.name.required ? (
                      <span className="text-main">*</span>
                    ) : null}
                  </legend>
                  <p className="flex">
                    <span
                      onClick={noticeInput}
                      className="flex-grow block p-3 mr-1 h-[48px] text-left border-2 rounded-full"
                    >
                      {watch("name")}
                    </span>
                  </p>
                </div>
                <div className="mt-5">
                  <legend className="block py-2 font-bold text-left">
                    {CT.adminSignUpRules.tel.kor}{" "}
                    {CT.adminSignUpRules.tel.required ? (
                      <span className="text-main">*</span>
                    ) : null}
                  </legend>
                  <p className="flex">
                    <span
                      onClick={noticeInput}
                      className="flex-grow block p-3 mr-1 h-[52px] text-left border-2 rounded-full"
                    >
                      {watch("tel")}
                    </span>
                  </p>
                </div>
                {contactInfoKey.map((info, index) => (
                  <div key={info + "Area"} className="mt-3">
                    <legend className="block py-2 font-bold text-left">
                      {CT.adminSignUpRules[info].kor}{" "}
                      {CT.adminSignUpRules[info].required ? (
                        <span className="text-main">*</span>
                      ) : null}
                    </legend>
                    <p className="flex">
                      <input
                        {...register(info, generateRule(info))}
                        id={info}
                        type="text"
                        placeholder={CT.adminSignUpRules[info].kor ?? ""}
                        maxLength={CT.adminSignUpRules[info].maxLength ?? 99}
                        className="flex-grow block p-3 mr-1 border-2 rounded-full focus:outline-none focus:border-sub"
                      />
                    </p>
                    <p className="block w-full px-3 py-2 text-left text-red-500">
                      {errors[info]?.message}
                    </p>
                  </div>
                ))}
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
                        required: "주문시 필요한 최소주문금액을 입력해주세요",
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: "0원 미만으로 입력할 수 없습니다.",
                        },
                      })}
                      type="number"
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
                          className="block w-11/12 h-full min-h-[70px] px-2 py-3 font-bold bg-white border-2 cursor-pointer rounded-xl border-sub text-sub peer-checked:bg-sub peer-checked:text-white"
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
            )}
            {isStep2 && (
              <>
                <div className="mt-5">
                  <legend className="block py-2 mb-5 font-bold text-left">
                    주소 <span className="text-main">*</span>
                  </legend>
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
                              주소 찾기
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
                  className="w-full p-4 mt-10 font-bold text-white bg-main rounded-xl"
                  isFetching={isSignUpPending}
                >
                  가맹점 등록 신청
                </FetchButton>
              </>
            )}
            <div className="mt-10">
              <Link to="/admin/login">가맹점 로그인 화면으로</Link>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};
