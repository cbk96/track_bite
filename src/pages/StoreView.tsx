import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StoreApi, MenuApi, CouponApi } from "../service";
import { CustomerMain } from "./CustomerMain";
import { RoundedPublicBox, FallbackImg } from "../components";
import { Bell, ArrowDown } from "phosphor-react";
import { useSelector } from "react-redux";
import {
  SectionTab,
  SlideTrain,
  SlideSections,
  useSlideSection,
} from "../components/sectionSlide";
import {
  PopupBackGround,
  PopupContainer,
  MenuPurchasePopup,
  usePopup,
  CouponDownloadPopup,
  AddressInsertPopup,
  CartListPopup,
} from "../components/popup";
import { MenuIntroduce, StoreInfo } from "./";
import { ReviewListView } from "./ReviewListView";
import { ScoreStar } from "../components";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCustomerPublic } from "../context";
import * as CT from "../constants";
import * as CS from "../store/customer";
import * as T from "../type";
import * as U from "../utils";
import type { AppState } from "../store";
import type {
  LoginCustomer,
  MenuGroupPublicInfo,
  MenuPublicInfo,
  StorePublicInfo,
  EventInfo,
} from "../type";
import { useDispatch } from "react-redux";

export const StoreView = () => {
  const handleMissingStore = () => {
    setCUSAlertState("스토어 정보를 찾을 수 없습니다.");
    navigate("/");
  };

  const { storePublicId } = useParams();
  const navigate = useNavigate();
  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );
  const { useGetMenuGroupPublicInfo } = MenuApi();
  const { useGetStorePublicInfo, useGetStoreEventInfo } = StoreApi();
  const { storeInfoData } = useGetStorePublicInfo(
    storePublicId ?? "",
    handleMissingStore
  );
  const { storeEventInfoData } = useGetStoreEventInfo(storePublicId ?? "");
  const { useGetCouponsPublic } = CouponApi();
  const BANNER_WIDTH = 640;

  const {
    sectionHeight,
    selectTabNum,
    setSelectTabNum,
    childWidth,
    sectionParentsRef,
    slideSectionsRef,
    resetParentHeight,
  } = useSlideSection();

  const { menuGroupPublicData } = useGetMenuGroupPublicInfo(
    storePublicId ? storePublicId : ""
  );
  const menuGroupPublicInfo = menuGroupPublicData;

  const { getSearchingCouponPBData } = useGetCouponsPublic({
    isUsable: true,
    isVisible: true,
    storePublicId: storePublicId ?? "",
    today: new Date(),
  });
  const { setAlertState: setCUSAlertState } = useCustomerPublic();

  const POPUP_MENU_PURCHASE_ID = "menuPurchase";
  const POPUP_COUPON_ID = "couponDownload";
  const POPUP_CART_ID = "cartMobilePop";
  const ADDRESS_INSERT_POUP_ID = "addressInsertPop";
  const { popupActive, setPopupActive } = usePopup();

  const [selectGroup, setSelectGroup] = useState<MenuGroupPublicInfo>();
  const [selectMenu, setSelectMenu] = useState<MenuPublicInfo>();
  const [twiceEventInfo, setTwiceEventInfo] = useState<EventInfo[]>([]);

  const dispatch = useDispatch();

  const onSetAddress = useCallback(
    (data: Omit<T.Address, "detailedAddress">) => {
      const guestAccount = U.createGuestAccountAndAddress(loginStatus, data);
      dispatch(CS.loginCustomer(guestAccount));

      setPopupActive({ popupId: "", active: false });
    },
    [loginStatus]
  );

  useEffect(() => {
    if (
      Object.entries(loginStatus.address)
        .filter(([key]) => key !== "detailedAddress")
        .some(([, value]) => value?.trim() === "" || value === undefined)
    ) {
      //주소 입력 팝업 활성화
      setPopupActive({ active: true, popupId: ADDRESS_INSERT_POUP_ID });
    } else {
      console.log(loginStatus.address);
      setPopupActive({ active: false, popupId: "" });
    }
  }, [loginStatus]);

  useEffect(() => {
    resetParentHeight();
  }, [sectionHeight, selectTabNum]);

  useEffect(() => {
    if (!storePublicId) {
      handleMissingStore();
    }
  }, [storePublicId, storeInfoData]);

  useEffect(() => {
    if (storeEventInfoData && Array.isArray(storeEventInfoData)) {
      setTwiceEventInfo(
        storeEventInfoData.length > 1
          ? [...storeEventInfoData, ...storeEventInfoData]
          : [...storeEventInfoData]
      );
    }
  }, [storeEventInfoData]);

  useEffect(() => {
    if (menuGroupPublicInfo && menuGroupPublicInfo.length > 0) {
      const firstMenuGroup = menuGroupPublicInfo.find(
        (menuGroup) => menuGroup.menuCount > 0
      );
      setSelectGroup(firstMenuGroup && firstMenuGroup);
    }
  }, [menuGroupPublicInfo]);

  const toEvent = () => {
    setSelectTabNum(2);
  };

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const couponDownloadPopupActive = () => {
    if (loginStatus.logined !== "login") {
      setCUSAlertState("쿠폰 다운로드는 회원만 가능합니다.");
      return;
    }
    setPopupActive({ active: true, popupId: POPUP_COUPON_ID });
  };

  return (
    <>
      {storePublicId && (
        <PopupBackGround
          popupActive={popupActive}
          setPopupActive={setPopupActive}
        >
          <PopupContainer popupActive={popupActive} popupId={POPUP_CART_ID}>
            <CartListPopup
              setPopupActive={setPopupActive}
              storePublicId={storePublicId}
              className="lg:hidden"
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
          {selectMenu && (
            <PopupContainer
              popupId={POPUP_MENU_PURCHASE_ID}
              popupActive={popupActive}
            >
              <MenuPurchasePopup
                popupActive={popupActive}
                popupId={POPUP_MENU_PURCHASE_ID}
                setPopupActive={setPopupActive}
                selectMenu={selectMenu}
                storePublicId={storePublicId}
                storeName={storeInfoData?.storeName ?? ""}
                logoPath={storeInfoData?.logoPath}
              />
            </PopupContainer>
          )}
          {getSearchingCouponPBData &&
            loginStatus.logined === "login" &&
            Array.isArray(getSearchingCouponPBData) &&
            getSearchingCouponPBData.length > 0 && (
              <PopupContainer
                popupId={POPUP_COUPON_ID}
                popupActive={popupActive}
              >
                <CouponDownloadPopup
                  popupActive={popupActive}
                  setPopupActive={setPopupActive}
                  coupons={getSearchingCouponPBData}
                  storePublicId={storePublicId}
                />
              </PopupContainer>
            )}
        </PopupBackGround>
      )}
      <div
        className={`w-full min-w-[320px] ${
          storeInfoData?.heroBannerPath ? "h-[250px]" : "h-[120px] lg:h-[80px]"
        } bg-cover bg-center`}
        style={{
          backgroundImage: `${
            storeInfoData?.heroBannerPath
              ? `url(${storeInfoData?.heroBannerPath.replace(/\\/g, "/")}`
              : ""
          })`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#f2f2f2",
        }}
      ></div>

      <CustomerMain>
        <div className="relative mx-3 lg:mx-auto pb-3 translate-y-[-20px] bg-white rounded-2xl shadow-[0_5px_8px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col justify-between lg:flex-row">
            <p className="translate-y-[-25px] lg:translate-y-[-35px] absolute lg:relative ml-[22px] w-[70px] h-[70px] lg:w-[140px] lg:h-[140px] overflow-hidden rounded-md bg-white shadow-[0_0_18px_rgba(0,0,0,0.2)]">
              {storeInfoData?.logoPath !== "" &&
                storeInfoData?.logoPath !== undefined && (
                  <FallbackImg
                    src={storeInfoData?.logoPath}
                    fallback="defaultStore.jpg"
                    alt="스토어 메인 이미지"
                    className="w-full h-full "
                  />
                )}
            </p>
            <div className="flex justify-between ml-[22px] flex-grow">
              <div className="pt-[10px] pb-3  text-[18px] font-bold">
                <p className="ml-[80px] lg:ml-0 h-[34px] text-[20px] p-[2px]">
                  {storeInfoData?.storeName}
                </p>
                <div className="flex p-[2px] items-center">
                  <p className="flex mr-2">
                    <ScoreStar
                      color={CT.SUB_CUST_COLOR}
                      score={storeInfoData?.reviewScore ?? 0}
                      size={17}
                    />
                  </p>
                  <span>{(storeInfoData?.reviewScore ?? 0).toFixed(1)}</span>
                </div>
                <p className="flex flex-col lg:flex-row mt-2 p-[2px] text-[14px]">
                  {storeInfoData?.minOrderAmount !== undefined &&
                  storeInfoData?.deliveryFee !== undefined ? (
                    <>
                      <span>
                        최소주문금액{" "}
                        {U.accounting(storeInfoData.minOrderAmount) + "원"}{" "}
                      </span>
                      <span className="hidden px-3 lg:inline">{"|"}</span>
                      <span>
                        배달수수료{" "}
                        {U.accounting(storeInfoData.deliveryFee) + "원"}
                      </span>
                    </>
                  ) : (
                    <span>오픈 준비중인 가게입니다.</span>
                  )}
                </p>
              </div>
            </div>
            {getSearchingCouponPBData &&
              Array.isArray(getSearchingCouponPBData) &&
              getSearchingCouponPBData.length > 0 && (
                <div className="right-0 flex items-center">
                  <button
                    onClick={couponDownloadPopupActive}
                    className={`flex w-full items-center p-3 m-3 mx-[22px] duration-100 bg-white border-2 
                      rounded-lg justify-between
                      ${
                        loginStatus.logined === "login"
                          ? "hover:bg-orange hover:text-white active:mb-1"
                          : "opacity-50"
                      }`}
                  >
                    <span className="inline-block mr-3 font-bold">
                      쿠폰 받기
                    </span>
                    <span className="inline-block p-1 rounded-full bg-orange ">
                      <ArrowDown weight="bold" color="#ffffff" size={20} />
                    </span>
                  </button>
                </div>
              )}
          </div>
          {storeInfoData?.notification && (
            <div className="flex items-center px-6 py-2 text-[18px] ">
              <p className="flex items-center px-2 font-bold">
                <Bell size={20} className="mr-2" weight="bold" />
              </p>
              <span className="inline-block w-[75%] text-[14px] overflow-hidden text-ellipsis whitespace-nowrap">
                {storeInfoData?.notification}
              </span>
            </div>
          )}
        </div>
        {twiceEventInfo.length > 0 ? (
          <RoundedPublicBox
            phosphor="Megaphone"
            title="진행중인 이벤트"
            className="bg-white mt-[10px]"
          >
            <div className="relative max-h-[266px] overflow-hidden">
              <div ref={emblaRef} className="block embla">
                <div className="flex">
                  {twiceEventInfo &&
                    twiceEventInfo.map((eventInfo, index) => (
                      <FallbackImg
                        key={eventInfo.eventId + index}
                        src={eventInfo.slideBannerPath}
                        alt="이벤트"
                        className="w-full"
                      />
                    ))}
                </div>
              </div>
            </div>
          </RoundedPublicBox>
        ) : null}

        <SectionTab
          selectTabNum={selectTabNum}
          setSelectTabNum={setSelectTabNum}
          borderColor={CT.MAIN_CUST_COLOR}
          textColor={CT.MAIN_CUST_COLOR}
          borderDirection="borderBottom"
          borderWeight={5}
          containerClassName="mx-3 lg:mx-0 h-[50px]"
          tabNames={["메뉴", "리뷰", "가게 정보"]}
          tabClassName="pb-[6px] w-[33%] inline-block rounded-bl-xl lg:rounded-bl-0 rounded-br-xl lg:rounded-br-0 rounded-tl-xl lg:rounded-tl-3xl rounded-tr-xl lg:rounded-tr-3xl bg-white"
        />
        <section className="overflow-hidden ">
          <SlideTrain
            selectTabNum={selectTabNum}
            sectionParentsRef={sectionParentsRef}
            childWidth={childWidth}
            className="min-h-[1000px]"
          >
            <SlideSections
              slideSectionsRef={slideSectionsRef}
              key={0}
              index={0}
            >
              <MenuIntroduce
                setSelectMenu={setSelectMenu}
                setSelectGroup={setSelectGroup}
                setPopupActive={setPopupActive}
                popupId={POPUP_MENU_PURCHASE_ID}
                selectGroup={selectGroup}
                storeInfo={storeInfoData ?? T.initialStorePublic}
              />
            </SlideSections>
            <SlideSections
              slideSectionsRef={slideSectionsRef}
              key={1}
              index={1}
              className="flex flex-row justify-center"
            >
              <ReviewListView
                storePublicId={storePublicId ? storePublicId : ""}
              />
            </SlideSections>
            <SlideSections
              slideSectionsRef={slideSectionsRef}
              key={2}
              index={2}
            >
              <StoreInfo
                storeInfo={storeInfoData ?? T.initialStorePublic}
                eventInfos={storeEventInfoData ?? []}
              />
            </SlideSections>
          </SlideTrain>
        </section>
      </CustomerMain>
      <button
        className="block lg:hidden fixed bottom-[50px] w-full h-[50px] bg-main-cust hover:bg-main-cust-hover text-white z-20"
        onClick={() => setPopupActive({ active: true, popupId: POPUP_CART_ID })}
      >
        주문하기
      </button>
    </>
  );
};

export default StoreView;
