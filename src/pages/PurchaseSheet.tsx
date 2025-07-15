import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { CustomerMain } from "./CustomerMain";
import { RoundedPublicBox, MenuListDisplay, FallbackImg } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AppSettingApi,
  StoreApi,
  CartApi,
  CouponApi,
  PurchaseApi,
} from "../service";
import {
  SectionTab,
  SlideTrain,
  SlideSections,
  useSlideSection,
} from "../components/sectionSlide";
import { isStoreOpen } from "../utils";
import { LoadingSpinner } from "../components/loading";
import { useForm } from "react-hook-form";
import * as T from "../type";
import { useCustomerPublic } from "../context";
import type { AppState } from "../store";
import type {
  StorePublicInfo,
  LoginCustomer,
  Cart,
  Purchase,
  Address,
  CouponIssue,
} from "../type";
import * as CT from "../constants";
import * as U from "../utils";
import { initialAddress } from "../type";
import { getRandomNum } from "../utils";

interface PurchaseSheetProps {}

type PurchaseInput = {
  name: string;
  paymentMethod: string;
  cardNumber: string;
  discountPrice: number;
  tel: string;
  deliRequest?: string;
} & Address;

const initialInputPurInfo: PurchaseInput = {
  name: "",
  paymentMethod: "",
  cardNumber: "",
  discountPrice: 0,
  tel: "",
  deliRequest: "",
  zonecode: "",
  sigunguCode: "",
  address: "",
  detailedAddress: "",
};

export const PurchaseSheet: FC<PurchaseSheetProps> = () => {
  const navigate = useNavigate();
  const handleMissingStore = () => {
    navigate("/");
  };
  const { storePublicId } = useParams();
  const { setAlertState: setCUSAlertState } = useCustomerPublic();
  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );
  const { appInfo, getAppSetting } = AppSettingApi();
  const { useGetCartList, useRemoveCartItems } = CartApi();
  const { removeCartsMutate } = useRemoveCartItems();
  const { cartListData, isGetCartListLoading } = useGetCartList(
    loginStatus.customerId,
    storePublicId ?? ""
  );
  const { useAddPurchase } = PurchaseApi();
  const { addPurchaseMutate } = useAddPurchase(() =>
    navigate("/store/storeview/" + storePublicId)
  );
  const { useGetStorePublicInfo } = StoreApi();
  const { storeInfoData } = useGetStorePublicInfo(
    storePublicId ?? "",
    handleMissingStore
  );
  const { useGetCouponIssues, useUpdateCouponIssues, useGetCouponsPublic } =
    CouponApi();
  const CouponIssueData = useGetCouponIssues(
    storePublicId ? storePublicId : "",
    loginStatus.customerId,
    loginStatus.logined === "login"
  ).couponIssueGetData;
  const { updateCouponIssuesMutate } = useUpdateCouponIssues();
  const { getSearchingCouponPBData } = useGetCouponsPublic({
    isUsable: true,
    isVisible: true,
    storePublicId: storePublicId ?? "",
    today: new Date(),
  });

  const [cartState, setCartState] = useState<Cart[]>([]);
  const [createPurchasePackId, setCreatePurchasePackId] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isValidAmt, setIsValidAmt] = useState<boolean>(false);
  const [paymentKorMethod, setPaymentKorMethod] = useState<string[]>([]);
  const [pendingPurchase, setPendingPurchase] = useState<Purchase[]>([]);
  const [storeInfo, setStoreInfo] = useState<StorePublicInfo>(
    T.initialStorePublic
  );
  const [selectCoupon, setSelectCoupon] = useState<string[]>([]);
  const [canUseCoupon, setCanUseCoupon] = useState<CouponIssue[]>([]);
  const [canUseCouponIds, setCanUseCouponIds] = useState<string[]>([]);
  const [totalCouponDiscountPrice, setTotalCouponDiscountPrice] =
    useState<number>(0);
  const [chkTime, setChkTime] = useState(false);
  const [chkLocaiton, setChkLocation] = useState(false);
  const [operatingHours, setOperatingHours] = useState<T.OperatingHours[]>(
    T.initialOperatingHours
  );
  const [constantAddress, setConstAddress] = useState<
    Omit<Address, "detailedAddress">
  >({
    zonecode: "",
    address: "",
    sigunguCode: "",
  });

  const { useGetOperatingHours } = StoreApi();
  useGetOperatingHours(storePublicId ?? "", setOperatingHours);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...initialInputPurInfo,
    },
  });

  const goBack = () => {
    navigate(-1);
  };

  const filterInputNumber =
    (key: "tel" | "cardNumber") => (e: ChangeEvent<HTMLInputElement>) => {
      const inputTel = U.filterNumber(e.target.value);
      setValue(key, inputTel);
    };

  const {
    selectTabNum,
    childWidth,
    setSelectTabNum,
    sectionParentsRef,
    slideSectionsRef,
  } = useSlideSection();

  useEffect(() => {
    if (cartListData && Array.isArray(cartListData)) {
      setCartState(cartListData);
    }
  }, [cartListData]);

  useEffect(() => {
    if (loginStatus.logined === "login") {
      setValue("name", loginStatus.name);
      setValue("tel", loginStatus.tel);
    } else {
      const randomNum = getRandomNum(20);
      const constantPerson = CT.randomPeople[randomNum];

      setValue("name", constantPerson.name);
      setValue("tel", constantPerson.tel);
    }
    setConstAddress({
      zonecode: loginStatus.address.zonecode,
      sigunguCode: loginStatus.address.sigunguCode,
      address: loginStatus.address.address,
    });
    setValue("zonecode", loginStatus.address.zonecode);
    setValue("sigunguCode", loginStatus.address.sigunguCode);
    setValue("address", loginStatus.address.address);
    setValue("detailedAddress", loginStatus.address.detailedAddress);
  }, [loginStatus]);

  const noticeInput = () => {
    setCUSAlertState(
      "개인정보 수집 방지를 위해 이름과 연락처의 입력을 제한하고 있습니다."
    );
  };

  useEffect(() => {
    noticeInput();
    if (!loginStatus || !storePublicId) {
      setCUSAlertState("잘못된 접근입니다.");
      navigate("/");
    } else {
      getAppSetting();
      storeInfoData && setStoreInfo(storeInfoData);
      setCreatePurchasePackId(U.createId("PURCHPACK", storePublicId));
    }
  }, [loginStatus, storePublicId]);

  //주문 가능 여부
  useEffect(() => {
    const { isStoreOpenByLocation, isStoreOpenByTime } = isStoreOpen();
    setChkLocation(
      isStoreOpenByLocation(
        storeInfo.address.sigunguCode,
        loginStatus.address.sigunguCode
      )
    );
    setChkTime(isStoreOpenByTime(operatingHours));
  }, [storeInfo, operatingHours]);

  //장바구니 메뉴 총 합계금액 계산
  useEffect(() => {
    if (
      cartListData &&
      Array.isArray(cartListData) &&
      cartListData.length > 0
    ) {
      let cumulPrice = 0;
      for (let i = 0; i < cartState.length; i++) {
        cumulPrice += Number(cartState[i].sumPrice) * cartState[i].quanti;
      }
      const vaildAmount =
        storeInfo.minOrderAmount !== undefined
          ? storeInfo.minOrderAmount <= cumulPrice
          : false;
      setIsValidAmt(vaildAmount);
      setTotalPrice(cumulPrice);
    } else {
      navigate("/");
    }
  }, [cartListData, cartState]);

  //가게에서 설정한 결제 수단 저장
  useEffect(() => {
    const paymentMethodKor = storeInfo.paymentMethod.map(
      (payment) => CT.paymentMethod[payment as CT.PaymentMethod]
    );

    setPaymentKorMethod(paymentMethodKor);
  }, [storeInfo]);

  //신용카드 외 다른 결제수단 선택시 카드번호 입력값 비움
  useEffect(() => {
    if (storeInfo.paymentMethod[selectTabNum] !== "Credit_card") {
      setValue("cardNumber", "");
    }
  }, [selectTabNum]);

  useEffect(() => {
    if (
      CouponIssueData &&
      Array.isArray(CouponIssueData) &&
      CouponIssueData.length > 0
    ) {
      const usingCoupon = CouponIssueData.filter((coupon: CouponIssue) => {
        return !coupon.used;
      }).map((coupon: CouponIssue) => ({
        ...coupon,
        purchasePackageId: createPurchasePackId,
      }));

      setCanUseCoupon(usingCoupon);
    }
  }, [CouponIssueData, createPurchasePackId]);

  //추가 입력값을 제외한 주문 데이터를 장바구니 데이터로 자동 생성
  useEffect(() => {
    const purchaseFromCart: Purchase[] = cartState.map((cart) => {
      const createPurchaseId = U.createId("PURCH", cart.storePublicId);
      return {
        purchaseId: createPurchaseId,
        purchasePackageId: createPurchasePackId,
        storeName: storeInfo.storeName ?? "",
        logoPath: storeInfo.logoPath ?? "",
        name: "",
        totalPrice: 0,
        deliveryFee: storeInfo.deliveryFee ?? 0,
        storePublicId: cart.storePublicId,
        customerId: loginStatus.customerId,
        menu: cart.menu,
        option: cart.option,
        quanti: cart.quanti,
        sumPrice: cart.sumPrice,
        paymentMethod: "",
        cardNumber: "",
        usedCouponIds: [],
        couponDiscountPrice: 0,
        purStatus: CT.purchaseStatusKeys[0],
        address: initialAddress,
        tel: "",
        deliRequest: "",
        date: new Date(),
        businessFee: 0,
      };
    });

    setPendingPurchase(purchaseFromCart);
  }, [cartState, createPurchasePackId, storeInfo]);

  //사용 가능한 상태의 쿠폰들의 아이디를 배열로 저장
  useEffect(() => {
    if (
      getSearchingCouponPBData &&
      Array.isArray(getSearchingCouponPBData) &&
      getSearchingCouponPBData.length > 0
    ) {
      const canUseCouponIdArr = getSearchingCouponPBData.map((coupon) => {
        return coupon.couponId;
      });
      setCanUseCouponIds(canUseCouponIdArr);
    }
  }, [getSearchingCouponPBData]);

  //쿠폰 선택
  const selectCouponId = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const exisCoupon = [...selectCoupon];
      let creaseDiscountPrice = totalCouponDiscountPrice;
      const selectNowCoupon = canUseCoupon.find(
        (coupon) => coupon.couponId === e.target.value
      );
      if (e.target.checked) {
        const addCoupon = [...exisCoupon, e.target.value];
        creaseDiscountPrice += Number(selectNowCoupon?.discountPrice);

        setSelectCoupon(addCoupon);
      } else {
        const removeCoupon = exisCoupon.filter(
          (coupon) => coupon !== e.target.value
        );
        creaseDiscountPrice -= Number(selectNowCoupon?.discountPrice);

        setSelectCoupon(removeCoupon);
      }
      setTotalCouponDiscountPrice(creaseDiscountPrice);
    },
    [selectCoupon, canUseCoupon, totalCouponDiscountPrice]
  );

  //주문 처리
  const purchaseConfirm = useCallback(
    (data: PurchaseInput) => {
      if (appInfo === undefined) {
        setCUSAlertState("주문 처리중 문제가 발생했습니다.");
        return;
      }
      const businessFee = appInfo.businessFee;
      const selectCartIds = cartState.map((cart) => {
        return cart.cartId;
      });

      //카드 정보 입력 여부
      const inputCardNumber =
        storeInfo.paymentMethod[selectTabNum] === "Credit_card"
          ? data.cardNumber
          : "";

      //사용할 쿠폰 선택
      const selectedCoupon: CouponIssue[] = canUseCoupon
        .filter((coupon) => {
          return selectCoupon.includes(coupon.couponId);
        })
        .map((coupon) => ({ ...coupon, used: true }));

      //입력 정보 정리후 서버 전송
      if (
        data !== undefined &&
        data.tel !== "" &&
        (storeInfo.paymentMethod[selectTabNum] !== "Credit_card" ||
          (storeInfo.paymentMethod[selectTabNum] === "Credit_card" &&
            data.cardNumber))
      ) {
        const cofirmPurchase: Purchase[] = pendingPurchase.map((purch) => ({
          ...purch,
          name: data.name,
          totalPrice: totalPrice,
          paymentMethod: storeInfo.paymentMethod[selectTabNum],
          cardNumber: inputCardNumber,
          usedCouponIds: selectCoupon,
          couponDiscountPrice: totalCouponDiscountPrice,
          address: {
            zonecode: data.zonecode,
            sigunguCode: data.sigunguCode,
            address: data.address,
            detailedAddress: data.detailedAddress,
          },
          tel: data.tel,
          deliRequest: data.deliRequest,
          businessFee: businessFee,
        }));
        selectedCoupon.length > 0 &&
          loginStatus.logined === "login" &&
          updateCouponIssuesMutate(selectedCoupon);
        removeCartsMutate({
          cartIds: selectCartIds,
          customerId: loginStatus.customerId,
        });
        //주문 정보 서버 전송
        addPurchaseMutate({ purchases: cofirmPurchase });
      } else {
        setCUSAlertState("입력되지 않은 값이 있습니다.");
      }
    },
    [
      register,
      cartState,
      appInfo,
      totalPrice,
      pendingPurchase,
      selectCoupon,
      selectTabNum,
      totalCouponDiscountPrice,
    ]
  );

  return (
    <>
      <CustomerMain>
        <RoundedPublicBox
          className="pb-6 mt-6 bg-white "
          titleBgColor={CT.MAIN_CUST_COLOR}
          titleColor="#fff"
          titleUnderLine={false}
          title="주문내역"
        >
          <div className="pl-10 pr-10">
            <p className="flex items-center pt-5 pb-5 border-b-2">
              {storeInfo.logoPath !== "" &&
                storeInfo.logoPath !== undefined && (
                  <FallbackImg
                    src={storeInfo.logoPath}
                    className="mr-3 w-[45px] rounded-lg border"
                    fallback="defaultStore.jpg"
                    alt="가게 로고 이미지"
                  />
                )}
              <span className="font-bold text-[18px]">
                {storeInfo.storeName}
              </span>
            </p>
            {cartState && cartState.length > 0 ? (
              <div>
                <MenuListDisplay menuList={cartState} />
              </div>
            ) : (
              <p className="p-10 pt-16 pb-16 text-[14px] text-[#aaa] text-center font bold ">
                주문 목록에 담긴 메뉴가 없습니다.
              </p>
            )}
            <p className="pt-2 text-right lg:pt-5 ">
              <span className="mr-5 text-[12px] lg:text-[16px] font-bold">
                쿠폰 할인액
              </span>
              <span className="inline-block min-w-[100px] lg:min-w-[150px] text-[14px] lg:text-[20px] font-bold">
                {U.accounting(totalCouponDiscountPrice)}원
              </span>
            </p>
            {storeInfo.deliveryFee !== undefined && (
              <p className="pt-2 text-right lg:pt-5 ">
                <span className="mr-5 text-[12px] lg:text-[16px] font-bold">
                  배달 수수료
                </span>
                <span className="inline-block min-w-[100px] lg:min-w-[150px] text-[14px] lg:text-[20px] font-bold">
                  {U.accounting(storeInfo.deliveryFee ?? 0)}원
                </span>
              </p>
            )}

            <p className="pt-2 text-right lg:pt-5 text-main-cust">
              <span className="mr-5 text-[16px] lg:text-[20px] font-bold">
                총 주문금액
              </span>
              <span className="inline-block min-w-[100px] lg:min-w-[150px] text-[18px] lg:text-[25px] font-bold">
                {U.accounting(
                  totalPrice -
                    totalCouponDiscountPrice +
                    (storeInfo.deliveryFee ?? 0)
                )}
                원
              </span>
            </p>
          </div>
          <LoadingSpinner isLoading={isGetCartListLoading} />
        </RoundedPublicBox>
        <form onSubmit={handleSubmit(purchaseConfirm)}>
          <RoundedPublicBox
            className="mt-6 bg-white "
            titleBgColor={CT.MAIN_CUST_COLOR}
            titleColor="#fff"
            titleUnderLine={false}
            title="배달정보"
          >
            <ul className="pb-5 pl-10 pr-10 ">
              <li className="flex flex-col border-b-2 items-left lg:items-center lg:flex-row pt-7 pb-7 ">
                <legend className="mr-10 mb-3 lg:mb-0 text-left lg:text-right w-[165px] font-bold text-[#666]">
                  받으시는 분 성함
                </legend>
                <p className="flex flex-col">
                  <span
                    onClick={noticeInput}
                    className="p-2 lg:w-[400px] rounded-md border lg:border-2"
                  >
                    {watch("name")}
                  </span>
                </p>
              </li>
              <li className="flex flex-col border-b-2 items-left lg:items-center lg:flex-row pt-7 pb-7">
                <legend className="mr-10 w-[165px] mb-3 lg:mb-0 text-left lg:text-right font-bold text-[#666]">
                  받으실 주소
                </legend>
                <p className="flex flex-col">
                  <input
                    type="hidden"
                    value={constantAddress.sigunguCode}
                    {...register("sigunguCode", {})}
                    onChange={() => {}}
                    className="p-2 rounded-md"
                  />
                  <span className="p-2 mb-3 lg:w-[400px] border rounded-md lg:border-2">
                    {"(" + watch("zonecode") + ") " + watch("address")}
                  </span>

                  <span className="flex flex-col mb-3 lg:w-[400px]">
                    <input
                      type="text"
                      {...register("detailedAddress", {
                        required: "상세주소를 입력해주세요.",
                      })}
                      onChange={() => {}}
                      className="p-2 border rounded-md lg:border-2"
                    />
                    {errors.detailedAddress ? (
                      <span className="p-1 pl-2 pr-2 text-red-500">
                        {errors.detailedAddress.message}
                      </span>
                    ) : null}
                  </span>
                </p>
              </li>
              <li className="flex flex-col border-b-2 items-left lg:items-center lg:flex-row pt-7 pb-7">
                <legend className="mr-10 w-[165px] mb-3 lg:mb-0 text-left lg:text-right font-bold text-[#666]">
                  받으시는 분 연락처
                </legend>
                <p className="flex flex-col">
                  <span
                    onClick={noticeInput}
                    className="p-2 lg:w-[400px] h-[44px] text-left border rounded-md lg:border-2"
                  >
                    {watch("tel")}
                  </span>
                </p>
              </li>
              <li className="flex flex-col items-left lg:items-center lg:flex-row pt-7 pb-7 ">
                <legend className="mr-10 w-[165px] mb-3 lg:mb-0 text-left lg:text-right font-bold text-[#666]">
                  요청사항
                </legend>
                <p className="flex flex-col">
                  <input
                    type="text"
                    {...register("deliRequest", {
                      maxLength: {
                        value: 80,
                        message: "80글자까지 입력 가능합니다.",
                      },
                    })}
                    placeholder="도착 후 벨 눌러주세요."
                    className="p-2 lg:w-[400px] border rounded-md lg:border-2"
                  />
                  {errors.deliRequest ? (
                    <span className="p-1 pl-2 pr-2 text-red-500">
                      {errors.deliRequest.message}
                    </span>
                  ) : null}
                </p>
              </li>
            </ul>
          </RoundedPublicBox>
          <RoundedPublicBox
            className="mt-6 bg-white "
            titleBgColor={CT.MAIN_CUST_COLOR}
            titleColor="#fff"
            titleUnderLine={false}
            title="쿠폰 선택"
          >
            <ul className="py-5 pl-10 pr-10">
              {canUseCoupon && canUseCoupon.length > 0 ? (
                canUseCoupon.map((coupon, index) => (
                  <li
                    key={coupon.couponId}
                    className={`${
                      index >= canUseCoupon.length - 1 ? "" : "border-b-2"
                    } ${
                      (!canUseCouponIds.includes(coupon.couponId) ||
                        coupon.used ||
                        coupon.minOrderAmount > totalPrice) &&
                      "opacity-50"
                    }`}
                  >
                    <label
                      htmlFor={coupon.couponId}
                      className="flex items-center pt-5 pb-5 cursor-pointer"
                    >
                      <p className="flex items-center mr-5 justify-center w-[30px] h-[30px] border-[2px] border-sub-cust rounded-lg">
                        <input
                          type="checkbox"
                          id={coupon.couponId}
                          value={coupon.couponId}
                          checked={selectCoupon.includes(coupon.couponId)}
                          onChange={selectCouponId}
                          className="hidden peer"
                          disabled={
                            !canUseCouponIds.includes(coupon.couponId) ||
                            coupon.used ||
                            coupon.minOrderAmount > totalPrice
                          }
                        />
                        <span className="inline-block w-[20px] h-[20px] rounded-md bg-white peer-checked:bg-sub-cust"></span>
                      </p>
                      <div className="flex flex-col items-center lg:flex-row">
                        <div className="mr-10">
                          <p className="mb-1 text-[20px] font-bold text-orange">
                            {U.accounting(coupon.discountPrice)}원 할인
                          </p>
                          <p className="mb-1 font-bold">
                            <span className="mr-3">{coupon.couponName}</span>
                            <span>{"(" + coupon.storeName + ")"}</span>
                          </p>
                          <p>
                            <span className="mr-5">
                              {U.accounting(coupon.minOrderAmount) +
                                "원 주문시 할인"}
                            </span>
                            <span>
                              {U.showDate(coupon.validFrom) +
                                " ~ " +
                                U.showDate(coupon.validUntil)}{" "}
                            </span>
                          </p>
                        </div>

                        {!canUseCouponIds.includes(coupon.couponId) ||
                        coupon.used ? (
                          <span className="mt-3 lg:mt-0 text-main">
                            *유효기간이 지났거나 스토어 관리자가 사용을 제한한
                            쿠폰입니다.
                          </span>
                        ) : (
                          coupon.minOrderAmount > totalPrice && (
                            <span className="text-main">
                              {U.accounting(coupon.minOrderAmount)}원 이상
                              주문시 사용 가능합니다.
                            </span>
                          )
                        )}
                      </div>
                    </label>
                  </li>
                ))
              ) : (
                <li className="font-bold text-center text-[#666] leading-[80px]">
                  사용 가능한 쿠폰이 없습니다.
                </li>
              )}
            </ul>
          </RoundedPublicBox>
          <RoundedPublicBox
            titleBgColor={CT.MAIN_CUST_COLOR}
            titleColor="#fff"
            titleUnderLine={false}
            title="결제수단"
            className="mt-6 bg-white "
          >
            <SectionTab
              selectTabNum={selectTabNum}
              setSelectTabNum={setSelectTabNum}
              borderColor={CT.SUB_CUST_COLOR}
              textColor={CT.SUB_CUST_COLOR}
              borderWeight={2}
              disableBorder={true}
              containerClassName="flex-col justify-start items-center lg:flex-row lg:h-[50px]"
              tabNames={paymentKorMethod}
              tabClassName="mb-3 mx-2 lg:mb-0 w-[80%] lg:w-[31%] inline-block rounded-xl bg-white"
            />
            <div className="pt-5">
              <SlideTrain
                selectTabNum={selectTabNum}
                sectionParentsRef={sectionParentsRef}
                childWidth={childWidth}
              >
                <SlideSections
                  slideSectionsRef={slideSectionsRef}
                  key={0}
                  index={0}
                  className="pt-10 pb-10 bg-white"
                >
                  <div className="flex items-center justify-center">
                    <legend className="mr-10 lg:w-[165px] text-right font-bold text-[#666]">
                      신용카드번호
                    </legend>
                    <p className="flex flex-col">
                      <input
                        type="text"
                        {...register("cardNumber", {
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "숫자만 입력 가능합니다.",
                          },
                          minLength: {
                            value: 13,
                            message: "카드번호는 최소 13자리여야 합니다.",
                          },
                          maxLength: {
                            value: 19,
                            message: "카드번호는 최대 19자리여야 합니다.",
                          },
                        })}
                        placeholder="'-' 없이 입력."
                        className="p-2 lg:w-[400px] border rounded-md lg:border-2"
                        onChange={filterInputNumber("cardNumber")}
                      />
                      {errors.cardNumber ? (
                        <span className="p-1 pl-2 pr-2 text-red-500">
                          {errors.cardNumber.message}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </SlideSections>
                <SlideSections
                  slideSectionsRef={slideSectionsRef}
                  key={1}
                  index={1}
                  className="pt-10 pb-10 bg-white "
                >
                  <div className="text-center">
                    배달이 도착하면 라이더님께 카드를 제시해주세요.
                  </div>
                </SlideSections>
                <SlideSections
                  slideSectionsRef={slideSectionsRef}
                  key={2}
                  index={2}
                  className="pt-10 pb-10 bg-white "
                >
                  <div className="text-center">
                    배달이 도착하면 라이더님께 현금을 제시해주세요.
                  </div>
                </SlideSections>
              </SlideTrain>
            </div>
          </RoundedPublicBox>
          <div className="flex justify-center mx-3 mt-6 lg:mx-0">
            <button
              type="button"
              onClick={goBack}
              className="p-3 mr-3 w-[275px] text-white bg-sub-cust hover:bg-sub-cust-hover rounded-md "
            >
              취소
            </button>
            {storeInfo.minOrderAmount !== undefined &&
            storeInfo.deliveryFee !== undefined &&
            isValidAmt &&
            chkLocaiton &&
            chkTime ? (
              <button className="p-3 w-[275px] text-white bg-main-cust hover:bg-main-cust-hover rounded-md">
                주문하기
              </button>
            ) : (
              <span className="p-3 w-[275px] text-white bg-grayCustom text-center rounded-md">
                {storeInfo.minOrderAmount === undefined ||
                storeInfo.deliveryFee === undefined
                  ? "현재 주문 불가능한 가게입니다."
                  : !isValidAmt
                  ? U.accounting(storeInfo.minOrderAmount ?? 0) +
                    "원 이상부터 주문 가능합니다"
                  : !chkLocaiton
                  ? "배달 가능한 주소가 아닙니다."
                  : "영업시간이 아닙니다."}
              </span>
            )}
          </div>
        </form>
      </CustomerMain>
    </>
  );
};

export default PurchaseSheet;
