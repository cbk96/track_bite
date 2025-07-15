import { useForm } from "react-hook-form";
import type { Customer } from "../type";
import * as T from "../type";
import * as CT from "../constants";
import { ChangeEvent, useEffect, useState } from "react";
import { AuthApi } from "../service";
import {
  AddressInsertPopup,
  FetchButton,
  PasswordChkCustPopup,
  PopupBackGround,
  PopupContainer,
  usePasswordChk,
  usePopup,
} from "../components";
import { useAdjustHeight, useFormAddress } from "../hook";
import { useNavigate } from "react-router-dom";
import { RoundedPublicBox } from "../components";
import { CustomerMain } from "./CustomerMain";
import { useSelector } from "react-redux";
import type { AppState } from "../store";
import type { LoginCustomer, EditCustomer, Address } from "../type";
import { getRandomNum } from "../utils";
import { useCustomerPublic } from "../context";

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

export const EditCustomerInfo = () => {
  const { setAlertState } = useCustomerPublic();
  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );
  const navigate = useNavigate();
  const { useCustomerUpdate } = AuthApi();
  const { mutateUpdateCustomer, isUpdatecustomerPending } = useCustomerUpdate(
    CT.CUSTOMER_ACCESS_TOKEN,
    () => navigate("/mypage")
  );
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: T.initialEDCustomer,
    mode: "onChange",
  });
  const [originLoginStatus, setOriginLoginStatus] = useState<EditCustomer>(
    T.initialEDCustomer
  );

  const { passwordChk, setPasswordChk } = usePasswordChk();
  const { popupActive, setPopupActive } = usePopup();
  const PASS_CHK_POP_ID = "passchk_pop";
  const ADDRESS_INSERT_POUP_ID = "addressInsertPop";

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

  //주소 입력
  const { formAddress, setInitialAddress } = useFormAddress();

  useEffect(() => {
    setInitialAddress(loginStatus.address);
  }, [loginStatus]);

  const onSetAddress = (data: Omit<T.Address, "detailedAddress">) => {
    //입력폼 수정 제한을 위해 데이터를 표시하는 용도
    setInitialAddress(data);

    //실제 폼 입력 데이터
    setValue("address.zonecode", data.zonecode);
    setValue("address.sigunguCode", data.sigunguCode);
    setValue("address.address", data.address);
    setPopupActive({ popupId: "", active: false });
  };

  useEffect(() => {
    setPopupActive({ active: true, popupId: PASS_CHK_POP_ID });
  }, []);

  const contactInfoKey = ["name", "tel", "email"] as const;
  const addressInfoKey = [
    "address.zonecode",
    "address.sigunguCode",
    "address.address",
  ] as const;

  useEffect(() => {
    const { logined, ...rest } = loginStatus;
    setOriginLoginStatus({ ...rest });
    Object.entries(rest)
      .filter(([key]) => key !== "name" && key !== "tel" && key !== "email")
      .map(([key, value]) => {
        setValue(key as any, value);
      });
  }, [loginStatus]);

  const confirmEditCustomer = (data: EditCustomer) => {
    // eslint-disable-next-line no-restricted-globals -- using browser confirm intentionally
    const confirmEdit = confirm("회원 정보를 수정합니다. 진행하시겠습니까?");
    if (!confirmEdit) return;
    mutateUpdateCustomer(data);
  };

  return (
    <>
      <PopupBackGround
        popupActive={popupActive}
        setPopupActive={setPopupActive}
      >
        <PopupContainer popupActive={popupActive} popupId={PASS_CHK_POP_ID}>
          <PasswordChkCustPopup
            setPopupActive={setPopupActive}
            setPasswordChk={setPasswordChk}
          />
        </PopupContainer>
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
      {passwordChk ? (
        <section className="flex py-10 items-center justify-center min-h-screen bg-[#f2f2f2]">
          <form onSubmit={handleSubmit(confirmEditCustomer)}>
            <CustomerMain>
              <div>
                <RoundedPublicBox className="px-10 pb-10 mb-6 bg-white">
                  <div className="mt-10">
                    <legend className="block py-2 font-bold text-left">
                      아이디{" "}
                      {CT.custSignUpRules["customerId"].required ? (
                        <span className="text-main-cust">*</span>
                      ) : null}
                    </legend>
                    <p className="flex ">{watch("customerId")}</p>
                  </div>
                </RoundedPublicBox>
                <RoundedPublicBox className="px-10 pb-10 mb-6 bg-white shadow-[0_5px_8px_rgba(0,0,0,0.1)]">
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
                            className="flex-grow block p-3 h-[52px] mr-1 border-2 rounded-full "
                          >
                            {watch(info)}
                          </span>
                        </p>
                      </div>
                    ))}
                  </>
                </RoundedPublicBox>
                <RoundedPublicBox className="flex flex-col px-10 pb-10 mb-6 bg-white shadow-[0_5px_8px_rgba(0,0,0,0.1)]">
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
                                  message: "주소찾기를 해주세요.",
                                },
                              })}
                              id={info}
                              type={`${
                                info === "address.sigunguCode"
                                  ? "hidden"
                                  : "mt-3 text"
                              }`}
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
                            className={`block px-2 py-3 w-11/12 h-full rounded-xl bg-white border-2 border-sub-cust text-sub-cust text-center
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
                    className="p-4 mx-auto mt-10 font-bold text-white bg-main-cust rounded-xl"
                    isFetching={isUpdatecustomerPending}
                  >
                    회원정보수정
                  </FetchButton>
                </RoundedPublicBox>
              </div>
            </CustomerMain>
          </form>
        </section>
      ) : null}
    </>
  );
};
