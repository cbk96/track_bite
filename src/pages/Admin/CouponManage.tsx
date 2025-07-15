import { use, useState, useEffect, useCallback, ChangeEvent } from "react";
import { AdminMain } from "./AdminMain";
import { SideBar, TabMenuBar, RoundedBox } from "../../components";
import { DateRangeInput, useDateRange } from "../../components/dateRange";
import { PageButton } from "../../components";
import { LoadingSpinner, useLoading } from "../../components/loading";
import { useAdminContext } from "../../context";
import { CouponApi } from "../../service";
import {
  PopupBackGround,
  PopupContainer,
  CouponInsertPopup,
  usePopup,
} from "../../components/popup";
import { Coupon } from "../../type";
import * as U from "../../utils";
import * as CT from "../../constants";

export const CouponManage = () => {
  const tabNames = ["홍보관리", "쿠폰관리"];
  const tabLinks = ["/admin/promotionmanage", "/admin/couponmanage"];
  const currentTab = "쿠폰관리";
  const limitItemNum = 10;

  const { loginState } = useAdminContext();
  const { useGetCoupons } = CouponApi();

  const { dateRange, changeDateRange } = useDateRange(30);
  const { popupActive, setPopupActive } = usePopup();
  const [selectedPageNum, setSelectedPageNum] = useState<number>(1);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon>();
  const [couponEditMode, setCouponEditMode] = useState<"write" | "update">(
    "write"
  );
  const [usableSelect, setUsableSelect] = useState<CT.IsUsableMethod[]>([
    ...CT.IsUsableMethodKeys,
  ]);
  const [visibleSelect, setVisibleSelect] = useState<CT.IsVisibleMethod[]>([
    ...CT.IsVisibleMethodKeys,
  ]);
  const popupId = "couponInsert";

  const changeUsable = (e: ChangeEvent<HTMLInputElement>) => {
    const exis = [...usableSelect];
    if (e.target.checked) {
      const addUsableStatus = [...exis, e.target.value as CT.IsUsableMethod];
      setUsableSelect(addUsableStatus);
    } else {
      const removeUsableStatus = exis.filter(
        (payment) => payment !== e.target.value
      );
      setUsableSelect(removeUsableStatus);
    }
  };

  const changeVisible = (e: ChangeEvent<HTMLInputElement>) => {
    const exis = [...visibleSelect];
    if (e.target.checked) {
      const addVisbleStatus = [...exis, e.target.value as CT.IsVisibleMethod];
      setVisibleSelect(addVisbleStatus);
    } else {
      const removeVisbleStatus = exis.filter(
        (payment) => payment !== e.target.value
      );
      setVisibleSelect(removeVisbleStatus);
    }
  };

  const { getSearchingCouponData, isCouponLoading, getSearChingCouponRefetch } =
    useGetCoupons({
      storeId: loginState.storeId,
      usableSelect,
      visibleSelect,
      selectedPageNum,
      limitItemNum,
      startRangeDate: dateRange.startDay,
      endRangeDate: dateRange.endDay,
    });

  //마운트시 리뷰 검색
  useEffect(() => {
    getSearChingCouponRefetch();
  }, [loginState, selectedPageNum]);

  //이벤트 핸들러로 리뷰 검색
  const searchByCondition = useCallback(() => {
    getSearChingCouponRefetch();
    setSelectedPageNum(1);
  }, [loginState, dateRange, selectedPageNum, usableSelect, visibleSelect]);

  const openCouponInsertPopup = () => {
    setCouponEditMode("write");
    setPopupActive({ active: true, popupId });
    setSelectedCoupon(undefined);
  };

  const openCouponUpdatePopup = (coupon: Coupon) => {
    setCouponEditMode("update");
    setPopupActive({ active: true, popupId });
    setSelectedCoupon(coupon);
  };

  return (
    <>
      <PopupBackGround
        popupActive={popupActive}
        setPopupActive={setPopupActive}
      >
        <PopupContainer popupId={popupId} popupActive={popupActive}>
          <CouponInsertPopup
            popupActive={popupActive}
            setPopupActive={setPopupActive}
            selectedCoupon={selectedCoupon}
            type={couponEditMode}
          />
        </PopupContainer>
      </PopupBackGround>
      <AdminMain>
        <TabMenuBar
          tabNames={tabNames}
          tabLinks={tabLinks}
          currentTab={currentTab}
        />
        <RoundedBox underLine={false}>
          <div className="mt-[20px]">
            <p className="text-[16px] font-bold ">기간</p>
            <DateRangeInput
              dateRange={dateRange}
              changeDateRange={changeDateRange}
            />
          </div>
          <div className="mt-[30px] mb-[60px]">
            <p className="text-[16px] font-bold ">조회조건</p>
            <div className="mt-[20px]">
              <ul className="flex">
                {CT.IsUsableMethodKeys.map((item) => (
                  <li key={item}>
                    <input
                      type="checkbox"
                      id={"usable" + item + "Input"}
                      value={item}
                      checked={usableSelect.includes(item)}
                      onChange={changeUsable}
                      className="hidden peer"
                    />
                    <label
                      htmlFor={"usable" + item + "Input"}
                      className="mr-1 p-2  rounded-md bg-white text-[14px] text-main font-bold border-2 border-main peer-checked:bg-main peer-checked:text-white cursor-pointer"
                    >
                      {CT.isUsableMethod[item]}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-[20px]">
              <ul className="flex">
                {CT.IsVisibleMethodKeys.map((item) => (
                  <li key={item}>
                    <input
                      type="checkbox"
                      id={"visible" + item + "Input"}
                      value={item}
                      checked={visibleSelect.includes(item)}
                      onChange={changeVisible}
                      className="hidden peer"
                    />
                    <label
                      htmlFor={"visible" + item + "Input"}
                      className="mr-1 p-2  rounded-md bg-white text-[14px] text-main font-bold border-2 border-main peer-checked:bg-main peer-checked:text-white cursor-pointer"
                    >
                      {CT.isVisibleMethod[item]}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-[60px] mb-[60px]">
            <button
              type="button"
              onClick={searchByCondition}
              className="p-2 rounded-md bg-sub hover:bg-sub-hover text-white text-[14px] font-bold"
            >
              쿠폰조회
            </button>
          </div>
          <div className="flex flex-col mt-5 mb-5 lg:justify-end lg:items-center lg:flex-row text-[14px] lg:text-[16px]">
            <div className="flex">
              <p className="flex flex-1 items-center justify-end pr-5 mr-5 h-[40px] font-bold border-r-2">
                <span className="mr-5 ">사용가능 쿠폰</span>
                <span className="text-[25px] lg:text-[35px] text-main">
                  {getSearchingCouponData &&
                    getSearchingCouponData.usableId &&
                    getSearchingCouponData.usableId.length}
                </span>
              </p>
              <p className="flex flex-1 items-center justify-end pr-5 lg:mr-5 h-[40px] font-bold lg:border-r-2">
                <span className="mr-5">노출중인 쿠폰</span>
                <span className="text-[25px] lg:text-[35px] text-main">
                  {getSearchingCouponData &&
                    getSearchingCouponData.visibleId &&
                    getSearchingCouponData.visibleId.length}
                </span>
              </p>
            </div>
            <div className="flex">
              <p className="flex flex-1 items-center justify-end pr-5 mr-5 h-[40px] font-bold border-r-2">
                <span className="mr-5">검색된 쿠폰</span>
                <span className="text-[25px] lg:text-[35px] text-main">
                  {getSearchingCouponData &&
                    getSearchingCouponData.searchingAllItemLength}
                </span>
              </p>
              <p className="flex flex-1 items-center justify-end pr-5 lg:mr-5 h-[40px] font-bold ">
                <span className="mr-5">전체 쿠폰</span>
                <span className="text-[25px] lg:text-[35px] text-main">
                  {getSearchingCouponData &&
                    getSearchingCouponData.allItemLength}
                </span>
              </p>
            </div>
            <p className="flex mt-5 items-center justify-end lg:mr-5 h-[40px] font-bold ">
              <button
                onClick={openCouponInsertPopup}
                className="block w-full p-3 text-white rounded-md lg:w-auto lg:inline bg-main hover:bg-main-hover"
              >
                쿠폰등록
              </button>
            </p>
          </div>
          <div className=" relative border-t-2 border-[#666666]">
            <ul className="border-t-2 border-[#666666]">
              <li className="flex justify-between items-center h-[66px] border-b text-center font-bold">
                <span className="flex-1 hidden lg:inline">쿠폰 아이디</span>
                <span className="flex-1">쿠폰 이름</span>
                <span className="flex-1">상태</span>
                <span className="flex-1 hidden lg:inline">노출 상태</span>
                <span className="flex-1">할인 금액</span>
                <span className="flex-1 hidden lg:inline">등록/수정일</span>
                <span className="flex-1">쿠폰관리</span>
              </li>
              {getSearchingCouponData &&
              getSearchingCouponData.searchingItemList &&
              Array.isArray(getSearchingCouponData.searchingItemList) &&
              getSearchingCouponData.searchingItemList.length > 0 ? (
                getSearchingCouponData.searchingItemList.map((coupon) => (
                  <li
                    key={coupon.couponId}
                    className="flex justify-between items-center h-[66px] border-b text-center"
                  >
                    <span className="flex-1 hidden lg:inline">
                      {coupon.couponId}
                    </span>
                    <span className="flex-1">{coupon.couponName}</span>
                    <span
                      className={`flex-1 ${
                        coupon.isUsable && "text-main font-bold"
                      }`}
                    >
                      {coupon.isUsable ? "사용가능" : "사용불가"}
                    </span>
                    <span className="flex-1 hidden lg:inline">
                      {coupon.isVisible ? "노출중" : "숨김"}
                    </span>
                    <span className="flex-1">
                      {U.accounting(coupon.discountPrice) + "원"}
                    </span>
                    <span className="flex-1 hidden lg:inline">
                      {U.showDate(coupon.registDate)}
                      <br />
                      {U.showDate(coupon.modifyDate)}
                    </span>
                    <span className="flex-1">
                      <button
                        onClick={() => openCouponUpdatePopup(coupon)}
                        className="p-3 text-white rounded-md bg-sub hover:bg-sub-hover"
                      >
                        관리
                      </button>
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-center leading-[100px] border-b">
                  조회된 쿠폰 내역이 없습니다.
                </li>
              )}
            </ul>
            <LoadingSpinner isLoading={isCouponLoading} />
          </div>
          <div className="mb-10 mt-7">
            <PageButton
              selectedPageNum={selectedPageNum}
              pageButtonPcs={10}
              showItemPcs={limitItemNum}
              foundedItemAllPcs={
                getSearchingCouponData
                  ? getSearchingCouponData.searchingAllItemLength
                  : 0
              }
              setSelectedPageNum={setSelectedPageNum}
            />
          </div>
        </RoundedBox>
      </AdminMain>
    </>
  );
};

export default CouponManage;
