import { useCallback, useEffect, useState } from "react";
import { RoundedBox, TabMenuBar, SideBar, PageButton } from "../../components";
import { SuperAdminApi } from "../../service";
import { LoadingSpinner } from "../../components/loading";
import type { Customer, Purchase, Store } from "../../type";
import * as CT from "../../constants";
import * as U from "../../utils";
import { SuperAdminMain } from "./SuperAdminMain";
import { LoignChk } from "./LoginChk";

export function SuperAdminCustomerList() {
  LoignChk();
  const { useSuperGetCustomerList } = SuperAdminApi();

  const tabNames = ["주문목록", "가맹점목록", "고객목록"];
  const tabLinks = [
    "/superadmin/purchase",
    "/superadmin/store",
    "/superadmin/customer",
  ];
  const currentTab = "고객목록";
  let LIMIT_ITEM_NUM = 10;

  const [selectedPageNum, setSelectedPageNum] = useState<number>(1);
  const [searchingList, setSearchingList] = useState<Customer[]>([]);

  const { superCustomerData, refetchSGetCustomer, isGetSCustomerLoading } =
    useSuperGetCustomerList({
      selectedPageNum,
      limitItemNum: LIMIT_ITEM_NUM,
    });

  //이벤트 핸들러로 검색
  const searchByCondition = useCallback(() => {
    refetchSGetCustomer();
    setSelectedPageNum(1);
  }, []);

  //마운트시 자동 검색
  useEffect(() => {
    refetchSGetCustomer();
  }, [selectedPageNum]);

  //마운트시 페이지 데이터 설정
  useEffect(() => {
    if (
      !superCustomerData ||
      !superCustomerData.searchingList ||
      !Array.isArray(superCustomerData.searchingList)
    )
      return;

    setSearchingList(superCustomerData.searchingList);
  }, [superCustomerData]);

  return (
    <>
      <LoadingSpinner isLoading={isGetSCustomerLoading} />
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
                <p className="flex items-center justify-end lg:pr-5 lg:mr-5 h-[40px] font-bold ">
                  <span className="mr-5 ">가입 고객 수</span>
                  <span className="text-[25px] lg:text-[35px] text-main">
                    {superCustomerData && superCustomerData.allSearchinhgLength
                      ? superCustomerData.allSearchinhgLength
                      : 0}
                  </span>
                </p>
              </div>
            </div>
            <div className="relative">
              <ul className="border-t-2 border-[#666666]">
                <li className="flex justify-between items-center h-[66px] border-b text-center font-bold">
                  <span className="flex-1">아이디</span>
                  <span className="flex-1">이름</span>
                  <span className="flex-1 hidden lg:inline">전화번호</span>
                  <span className="flex-1 hidden lg:inline">이메일</span>
                  <span className="flex-1 ">가입일</span>
                  <span className="flex-1 hidden lg:inline">선호 카테고리</span>
                </li>
                {searchingList && searchingList.length > 0 ? (
                  searchingList.map((item, index) => (
                    <li
                      key={item.customerId}
                      className="flex justify-between items-center h-[66px] border-b text-center"
                    >
                      <span className="flex-1 text-[10px]">
                        {item.customerId}
                      </span>
                      <span className="flex-1 ">{item.name}</span>
                      <span className="flex-1 hidden lg:inline">
                        {item.tel}
                      </span>
                      <span className="flex-1 hidden lg:inline text-[14px]">
                        {item.email}
                      </span>
                      <span className="flex-1">
                        {U.showDate(item.joinDate)}
                      </span>
                      <span className="flex-1 hidden lg:inline">
                        {CT.categoryName[item.prefer]}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-center leading-[100px] border-b">
                    조회된 가맹점 내역이 없습니다.
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
                superCustomerData ? superCustomerData.allSearchinhgLength : 0
              }
              setSelectedPageNum={setSelectedPageNum}
            />
          </div>
        </RoundedBox>
      </SuperAdminMain>
    </>
  );
}

export default SuperAdminCustomerList;
