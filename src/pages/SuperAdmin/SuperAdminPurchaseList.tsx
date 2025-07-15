import { useCallback, useEffect, useState } from "react";
import { RoundedBox, TabMenuBar, PageButton } from "../../components";
import { SuperAdminApi } from "../../service";
import { LoadingSpinner } from "../../components/loading";
import type { Purchase } from "../../type";
import * as CT from "../../constants";
import * as U from "../../utils";
import { SuperAdminMain } from "./SuperAdminMain";
import { LoignChk } from "./LoginChk";

export function SuperAdminPurchaseList() {
  LoignChk();
  const { useSuperGetPurchaseList } = SuperAdminApi();

  const tabNames = ["주문목록", "가맹점목록", "고객목록"];
  const tabLinks = [
    "/superamin/purchase",
    "/superadmin/store",
    "/superadmin/customer",
  ];
  const currentTab = "주문목록";
  let LIMIT_ITEM_NUM = 10;

  const [selectedPageNum, setSelectedPageNum] = useState<number>(1);
  const [purchaseList, setPurchaseList] = useState<Purchase[]>([]);

  const { refetchSGetPurchase, superPurchaseData, isGetSPurchaseLoading } =
    useSuperGetPurchaseList({
      selectedPageNum,
      limitItemNum: LIMIT_ITEM_NUM,
    });

  //이벤트 핸들러로 검색
  const searchByCondition = useCallback(() => {
    refetchSGetPurchase();
    setSelectedPageNum(1);
  }, []);

  //마운트시 자동 검색
  useEffect(() => {
    refetchSGetPurchase();
  }, [selectedPageNum]);

  //마운트시 페이지 데이터 설정
  useEffect(() => {
    if (
      !superPurchaseData ||
      !superPurchaseData.searchingList ||
      !Array.isArray(superPurchaseData.searchingList)
    )
      return;

    setPurchaseList(superPurchaseData.searchingList);
  }, [superPurchaseData]);

  return (
    <>
      <LoadingSpinner isLoading={isGetSPurchaseLoading} />
      <SuperAdminMain>
        <TabMenuBar
          tabNames={tabNames}
          tabLinks={tabLinks}
          currentTab={currentTab}
        />
        <RoundedBox underLine={false}>
          <section className="pt-10">
            <div>
              <button
                type="button"
                onClick={searchByCondition}
                className="p-2 rounded-md bg-sub hover:bg-sub-hover text-white text-[14px] font-bold"
              >
                조회
              </button>
            </div>
            <div className="flex flex-col items-end mt-5 mb-5 lg:items-center lg:justify-end lg:flex-row text-[14px] lg:text-[16px]">
              <div className="flex">
                <p className="flex items-center justify-end lg:pr-5 lg:mr-5 h-[40px] font-bold">
                  <span className="mr-5 ">조회된 주문건</span>
                  <span className="text-[25px] lg:text-[35px] text-main">
                    {superPurchaseData && superPurchaseData.allSearchinhgLength
                      ? superPurchaseData.allSearchinhgLength
                      : 0}
                  </span>
                </p>
              </div>
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
                </li>
                {purchaseList && purchaseList.length > 0 ? (
                  purchaseList.map((item, index) => (
                    <li
                      key={item.purchaseId}
                      className="flex justify-between items-center h-[66px] border-b text-center"
                    >
                      <span className="flex-1 text-[10px]">
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
                superPurchaseData ? superPurchaseData.allSearchinhgLength : 0
              }
              setSelectedPageNum={setSelectedPageNum}
            />
          </div>
        </RoundedBox>
      </SuperAdminMain>
    </>
  );
}

export default SuperAdminPurchaseList;
