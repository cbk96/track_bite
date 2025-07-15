import { useRef } from "react";
import { useForm } from "react-hook-form";
import type { Customer } from "../type";
import * as T from "../type";
import * as CT from "../constants";
import { ChangeEvent, useEffect, useState } from "react";
import { AuthApi } from "../service";
import {
  AddressInsertPopup,
  FetchButton,
  PopupBackGround,
  PopupContainer,
  usePopup,
} from "../components";
import { useAdjustHeight } from "../hook";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFormAddress } from "../hook";
import { useCustomerPublic } from "../context";
import { getRandomNum } from "../utils";

const generateRule = (field: keyof typeof CT.custSignUpRules) => {
  const rule = CT.custSignUpRules[field];
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

export const SignUP = () => {
  const { setAlertState } = useCustomerPublic();
  const navigate = useNavigate();
  const { sectionHeight, observerHeight, adjustHeight } = useAdjustHeight();
  const { useCheckIdAvailability, useSignUp } = AuthApi();
  const { idAvailData, mutateChkIdAvail, isChkIdAvailPending } =
    useCheckIdAvailability();
  const { mutateSignUp, isSignUpPending } = useSignUp(() => navigate("/login"));

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: T.initialCustomer,
    mode: "onChange",
  });

  const parentRef = useRef<HTMLFormElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const [idChk, setIdChk] = useState<boolean>(false);
  const [idChkMsg, setIdChkMsg] = useState<string>("");
  const [passChkField, setPassChkField] = useState<string>("");
  const [passChk, setPassChk] = useState<boolean>(false);
  const [passChkMsg, setPassChkMsg] = useState<string>("");

  const ADDRESS_INSERT_POUP_ID = "addressInsertPop";

  const { popupActive, setPopupActive } = usePopup();

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
    setValue("email", constantPerson.email);
  }, []);

  useEffect(() => {
    observerHeight(childRef.current);
  }, []);

  useEffect(() => {
    adjustHeight(parentRef.current, childRef.current);
  }, [sectionHeight]);

  const contactInfoKey = ["name", "tel", "email"] as const;
  const addressInfoKey = [
    "address.zonecode",
    "address.sigunguCode",
    "address.address",
  ] as const;

  const confirmSignUp = (data: Customer) => {
    // eslint-disable-next-line no-restricted-globals -- using browser confirm intentionally
    const confirmSignUp = confirm("회원가입합니다. 진행하시겠습니까?");
    if (!confirmSignUp) return;
    mutateSignUp(data);
  };

  const isStep1 = idChk && passChk;
  const isStep2 =
    isStep1 &&
    Object.values(contactInfoKey).every((info) => errors[info] === undefined) &&
    Object.values(contactInfoKey)
      .filter((key) => CT.custSignUpRules[key].required)
      .every((info) => watch(info) !== "");

  // const isStep1 = true;
  // const isStep2 = true;
  // const isStep3 = true;

  //아이디 중복 확인 | 중복 확인 전 입력 유형 유효성 검사
  const checkIdAvail = () => {
    const inputId = watch("customerId");
    const minLength = CT.custSignUpRules["customerId"].minLength ?? 0;
    const maxLength = CT.custSignUpRules["customerId"].maxLength ?? 99;

    if (
      inputId.length < minLength ||
      inputId.length > maxLength ||
      !CT.idRegex.test(inputId)
    ) {
      setIdChk(false);
      setIdChkMsg(
        "아이디는 영문자와 숫자를 포함한 " +
          minLength +
          "~" +
          maxLength +
          "자의 조합으로 입력해주세요."
      );

      return;
    }
    mutateChkIdAvail({ customerId: inputId });
  };

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

  //아이디 중복 검사의 서버 처리 결과별 메세지 처리
  useEffect(() => {
    if (!idAvailData) return;
    const idChkData = idAvailData;
    if (idChkData) {
      setIdChk(true);
      setIdChkMsg("사용 가능한 아이디입니다.");
    } else {
      setIdChk(false);
      setIdChkMsg("사용할 수 없는 아이디입니다");
    }
  }, [idAvailData]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "customerId") {
        setIdChk(false);
        setIdChkMsg("");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  //비밀번호 일치 검사
  const checkPassMatch = (e: ChangeEvent<HTMLInputElement>) => {
    const inputPass = watch("password");
    const filedName = e.target.name;
    const passwordChk = e.target.value;
    const minLength = CT.custSignUpRules["password"].minLength ?? 0;
    const maxLength = CT.custSignUpRules["password"].maxLength ?? 99;

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
            <p className="mr-3 text-[32px] text-main-cust font-josefin font-bold">
              Track Bite
            </p>
            <p className="mt-3 text-2xl font-bold">회원가입</p>
            <div className="mt-10">
              <legend className="block py-2 font-bold text-left">
                아이디{" "}
                {CT.custSignUpRules["customerId"].required ? (
                  <span className="text-main-cust">*</span>
                ) : null}
              </legend>
              <p className="flex ">
                <input
                  {...register("customerId", generateRule("customerId"))}
                  id="customerId"
                  type="text"
                  placeholder="아이디"
                  maxLength={CT.custSignUpRules["customerId"].maxLength ?? 99}
                  className="flex-grow block p-3 mr-2 border-2 rounded-full focus:outline-none focus:border-sub-cust"
                />
                <FetchButton
                  type="button"
                  onClick={checkIdAvail}
                  isFetching={isChkIdAvailPending}
                  className="p-2 text-white rounded-xl bg-sub-cust hover:bg-sub-cust-hover "
                >
                  중복 확인
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
            <div className="mt-5">
              <legend className="block py-2 font-bold text-left">
                비밀번호{" "}
                {CT.custSignUpRules["password"].required ? (
                  <span className="text-main-cust">*</span>
                ) : null}
              </legend>
              <p className="flex ">
                <input
                  {...register("password", generateRule("password"))}
                  id="password"
                  type="password"
                  name="password"
                  onChange={checkPassMatch}
                  maxLength={CT.custSignUpRules["password"].maxLength ?? 99}
                  placeholder="비밀번호"
                  className="flex-grow block p-3 mr-1 border-2 rounded-full focus:outline-none focus:border-sub-cust"
                />
              </p>
              <p className="flex mt-3">
                <input
                  name="passwordChk"
                  type="password"
                  onChange={checkPassMatch}
                  value={passChkField}
                  maxLength={CT.custSignUpRules["password"].maxLength ?? 99}
                  placeholder="비밀번호 확인"
                  className="flex-grow block p-3 mr-1 border-2 rounded-full focus:outline-none focus:border-sub-cust"
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
                {contactInfoKey.map((info, index) => (
                  <div
                    key={info + "Area"}
                    className={`${index === 0 ? "mt-5" : "mt-3"}`}
                  >
                    <legend className="block py-2 font-bold text-left">
                      {CT.custSignUpRules[info].kor}{" "}
                      {CT.custSignUpRules[info].required ? (
                        <span className="text-main-cust">*</span>
                      ) : null}
                    </legend>
                    <p className="flex">
                      <span
                        onClick={noticeInput}
                        className="flex-grow block p-3 mr-1 h-[52px] text-left border-2 rounded-full"
                      >
                        {watch(info)}
                      </span>
                    </p>
                  </div>
                ))}
              </>
            )}
            {isStep2 && (
              <>
                <div className="mt-5">
                  <legend className="block py-2 mb-5 font-bold text-left">
                    주소 <span className="text-main-cust">*</span>
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
                            className="flex-grow block p-3 my-2 mr-1 border-2 rounded-full focus:outline-none focus:border-sub-cust"
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
                              className="px-2 my-2 ml-3 font-bold text-white rounded-xl bg-main-cust hover:bg-main-cust-hover"
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
                        className="flex-grow block p-3 mr-1 border-2 rounded-full focus:outline-none focus:border-sub-cust"
                      />
                    </p>
                    <p className="block w-full px-3 py-2 text-left text-red-500">
                      {errors.address?.detailedAddress?.message}
                    </p>
                  </div>
                </div>
                <div>
                  <legend className="block py-2 font-bold text-left">
                    선호 카테고리
                  </legend>
                  <div className="flex flex-wrap">
                    {CT.categoryNameKeys.map((cate) => (
                      <p
                        key={cate + "key"}
                        className="flex flex-col items-center w-1/3 mt-2"
                      >
                        <input
                          {...register("prefer")}
                          type="radio"
                          id={cate + "id"}
                          value={cate}
                          className="hidden peer"
                        />
                        <label
                          htmlFor={cate + "id"}
                          className={`block px-2 py-3 w-11/12 h-full rounded-xl bg-white border-2 border-sub-cust text-sub-cust 
                        peer-checked:bg-sub-cust peer-checked:text-white font-bold cursor-pointer`}
                        >
                          {cate === "empty"
                            ? "선택안함"
                            : CT.categoryName[cate]}
                        </label>
                      </p>
                    ))}
                  </div>
                </div>
                <FetchButton
                  type="submit"
                  className="w-full p-4 mt-10 font-bold text-white bg-main-cust rounded-xl"
                  isFetching={isSignUpPending}
                >
                  회원가입
                </FetchButton>
              </>
            )}
            <div className="mt-10">
              <Link to="/">메인화면으로</Link>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};
