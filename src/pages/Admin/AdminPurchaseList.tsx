import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { AdminMain } from "./AdminMain";
import { RoundedBox, TabMenuBar, SideBar, PageButton } from "../../components";
import { useAdminContext } from "../../context/AdminContext";
import { PurchaseApi } from "../../service";
import {
  PopupBackGround,
  PopupContainer,
  PurchaseDetailPopup,
  usePopup,
} from "../../components/popup";
import { DateRangeInput, useDateRange } from "../../components/dateRange";
import { LoadingSpinner } from "../../components/loading";
import type { Purchase } from "../../type";
import * as CT from "../../constants";
import * as U from "../../utils";

export function AdminPurchaseList() {
  const { loginState } = useAdminContext();
  const { useGetPurchaseList } = PurchaseApi();

  const tabNames = ["주문내역", "리뷰내역"];
  const tabLinks = ["/admin/purchaseList", "/admin/reviewmanage"];
  const currentTab = "주문내역";
  let LIMIT_ITEM_NUM = 10;

  const [selectedPageNum, setSelectedPageNum] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [purchaseList, setPurchaseList] = useState<Purchase[]>([]);
  const [paymentSelect, setPaymentSelect] = useState<CT.PaymentMethod[]>([
    ...CT.paymentMethodKeys,
  ]);
  const [purStatusSelect, setPurStatusSelect] = useState<CT.PurchaseStatus[]>([
    ...CT.purchaseStatusKeys,
  ]);
  const [selectPurchase, setSelectPurchase] = useState<Purchase[]>([]);
  const { dateRange, changeDateRange } = useDateRange(7);

  const popupId = "purchaseDetail";
  const { popupActive, setPopupActive } = usePopup();

  const changePayment = (e: ChangeEvent<HTMLInputElement>) => {
    const exisPayment = [...paymentSelect];
    if (e.target.checked) {
      const addPayment = [...exisPayment, e.target.value as CT.PaymentMethod];
      setPaymentSelect(addPayment);
    } else {
      const removePayment = exisPayment.filter(
        (payment) => payment !== e.target.value
      );
      setPaymentSelect(removePayment);
    }
  };

  const changePurStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const exisPurStatus = [...purStatusSelect];
    if (e.target.checked) {
      const addPurStatus = [
        ...exisPurStatus,
        e.target.value as CT.PurchaseStatus,
      ];
      setPurStatusSelect(addPurStatus);
    } else {
      const removePurStatus = exisPurStatus.filter(
        (purStatus) => purStatus !== e.target.value
      );
      setPurStatusSelect(removePurStatus);
    }
  };

  const { getPurchaseData, refetchGetPurchase, isGetPurchaseLoading } =
    useGetPurchaseList("detailSearch", {
      storePublicId: loginState.storePublicId,
      paymentSelect,
      purStatusSelect,
      selectedPageNum,
      limitItemNum: LIMIT_ITEM_NUM,
      startRangeDate: dateRange.startDay,
      endRangeDate: dateRange.endDay,
    });

  const selectPurchaseByID = (purchasePackageId: string) => {
    if (
      !getPurchaseData ||
      !getPurchaseData.searchingPkList ||
      Array.isArray(getPurchaseData)
    )
      return;

    setPopupActive({ active: true, popupId });

    const selectPurch = getPurchaseData.searchingItems.filter(
      (purch) => purch.purchasePackageId === purchasePackageId
    );
    setSelectPurchase(selectPurch);
  };

  //이벤트 핸들러로 검색
  const searchByCondition = useCallback(() => {
    refetchGetPurchase();
    setSelectedPageNum(1);
  }, [dateRange, paymentSelect, purStatusSelect]);

  //마운트시 자동 검색
  useEffect(() => {
    refetchGetPurchase();
  }, [selectedPageNum]);

  //마운트시 페이지 데이터 설정
  useEffect(() => {
    if (
      !getPurchaseData ||
      !getPurchaseData.searchingItems ||
      !getPurchaseData.searchingPkList ||
      !Array.isArray(getPurchaseData.searchingItems) ||
      !Array.isArray(getPurchaseData.searchingPkList)
    )
      return;

    //총 주문금액 계산
    let sumPrice = 0;
    for (let i = 0; i < getPurchaseData.searchingItems.length; i++) {
      sumPrice += getPurchaseData.searchingItems[i].sumPrice;
    }

    setPurchaseList(getPurchaseData.searchingPkList);
    setTotalPrice(sumPrice);
  }, [getPurchaseData]);

  return (
    <>
      <LoadingSpinner isLoading={isGetPurchaseLoading} />
      <PopupBackGround
        popupActive={popupActive}
        setPopupActive={setPopupActive}
      >
        <PopupContainer popupId={popupId} popupActive={popupActive}>
          <PurchaseDetailPopup
            setPopupActive={setPopupActive}
            selectPurchase={selectPurchase}
            searchByCondition={searchByCondition}
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
          <section>
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
                  {CT.paymentMethodKeys.map((payment) => (
                    <li key={payment}>
                      <input
                        type="checkbox"
                        id={payment + "Input"}
                        value={payment}
                        checked={paymentSelect.includes(payment)}
                        onChange={changePayment}
                        className="hidden peer"
                      />
                      <label
                        htmlFor={payment + "Input"}
                        className="mr-1 p-2  rounded-md bg-white text-[14px] text-main font-bold border-2 border-main peer-checked:bg-main peer-checked:text-white cursor-pointer"
                      >
                        {CT.paymentMethod[payment]}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-[20px]">
                <ul className="flex">
                  {CT.purchaseStatusKeys.map((purStatus) => (
                    <li key={purStatus}>
                      <input
                        type="checkbox"
                        id={purStatus + "Input"}
                        value={purStatus}
                        checked={purStatusSelect.includes(purStatus)}
                        onChange={changePurStatus}
                        className="hidden peer"
                      />
                      <label
                        htmlFor={purStatus + "Input"}
                        className="mr-1 p-2  rounded-md bg-white text-[14px] text-main font-bold border-2 border-main peer-checked:bg-main peer-checked:text-white cursor-pointer"
                      >
                        {CT.purchaseStatus[purStatus]}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={searchByCondition}
                className="p-2 rounded-md bg-sub hover:bg-sub-hover text-white text-[14px] font-bold"
              >
                주문조회
              </button>
            </div>
            <div className="flex flex-col items-end mt-5 mb-5 lg:items-center lg:justify-end lg:flex-row text-[14px] lg:text-[16px]">
              <div className="flex">
                <p className="flex items-center justify-end pr-5 mr-5 h-[40px] font-bold border-r-2">
                  <span className="mr-5">일일 총 주문건</span>
                  <span className="text-[25px] lg:text-[35px] text-main">
                    {getPurchaseData && getPurchaseData.todayItemLength}
                  </span>
                </p>
                <p className="flex items-center justify-end lg:pr-5 lg:mr-5 h-[40px] font-bold lg:border-r-2">
                  <span className="mr-5 ">조회된 주문건</span>
                  <span className="text-[25px] lg:text-[35px] text-main">
                    {getPurchaseData && getPurchaseData.searchingAllPkLength
                      ? getPurchaseData.searchingAllPkLength
                      : 0}
                  </span>
                </p>
              </div>
              <p className="flex mt-3 lg:mt-0 items-center justify-end h-[40px] font-bold ">
                <span className="mr-5">일일 총 주문금액</span>
                <span className="mr-1 text-[25px] lg:text-[35px] text-main">
                  {U.accounting(totalPrice)}
                </span>
                <span className="text-main">원</span>
              </p>
            </div>
            <div className="relative">
              <ul className="border-t-2 border-[#666666]">
                <li className="flex justify-between items-center h-[66px] border-b text-center font-bold">
                  <span className="flex-1">주문번호</span>
                  <span className="flex-1 hidden lg:inline">주문일시</span>
                  <span className="flex-1">주문상태</span>
                  <span className="flex-1 ">주문메뉴</span>
                  <span className="flex-1 hidden lg:inline">결제방법</span>
                  <span className="flex-1 hidden lg:inline">주문금액</span>
                  <span className="flex-1">주문관리</span>
                </li>
                {purchaseList && purchaseList.length > 0 ? (
                  purchaseList.map((item, index) => (
                    <li
                      key={item.purchaseId}
                      className="flex justify-between items-center h-[66px] border-b text-center"
                    >
                      <span className="flex-1 text-[10px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.purchasePackageId}
                      </span>
                      <span className="flex-1 hidden lg:inline">
                        {U.showDate(item.date)}
                      </span>
                      <span className="flex-1">
                        {CT.purchaseStatus[item.purStatus]}
                      </span>
                      <span className="flex-1">{item.menu.menuName}</span>
                      <span className="flex-1 hidden lg:inline">
                        {
                          CT.paymentMethod[
                            item.paymentMethod
                              .split("|")[0]
                              .trim() as CT.PaymentMethod
                          ]
                        }
                      </span>
                      <span className="flex-1 hidden lg:inline">
                        {U.accounting(item.totalPrice)}원
                      </span>
                      <span className="flex-1">
                        <button
                          type="button"
                          onClick={() =>
                            selectPurchaseByID(item.purchasePackageId)
                          }
                          className="p-3 text-white rounded-md bg-sub hover:bg-sub-hover"
                        >
                          관리
                        </button>
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-center leading-[100px] border-b">
                    조회된 주문 내역이 없습니다.
                  </li>
                )}
              </ul>
            </div>
          </section>
          <div className="mb-10 mt-7">
            <PageButton
              selectedPageNum={selectedPageNum}
              pageButtonPcs={10}
              showItemPcs={LIMIT_ITEM_NUM}
              foundedItemAllPcs={
                getPurchaseData ? getPurchaseData.searchingAllPkLength : 0
              }
              setSelectedPageNum={setSelectedPageNum}
            />
          </div>
        </RoundedBox>
      </AdminMain>
    </>
  );
}

export default AdminPurchaseList;
