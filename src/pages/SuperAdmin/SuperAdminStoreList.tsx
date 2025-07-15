import { useCallback, useEffect, useState } from "react";
import { RoundedBox, TabMenuBar, SideBar, PageButton } from "../../components";
import { SuperAdminApi } from "../../service";
import { LoadingSpinner } from "../../components/loading";
import type { Store } from "../../type";
import * as CT from "../../constants";
import * as U from "../../utils";
import { SuperAdminMain } from "./SuperAdminMain";
import { LoignChk } from "./LoginChk";

export function SuperAdminStoreList() {
  LoignChk();
  const { useSuperGetStoreList } = SuperAdminApi();

  const tabNames = ["주문목록", "가맹점목록", "고객목록"];
  const tabLinks = [
    "/superadmin/purchase",
    "/superadmin/store",
    "/superadmin/customer",
  ];
  const currentTab = "가맹점목록";
  let LIMIT_ITEM_NUM = 10;

  const [selectedPageNum, setSelectedPageNum] = useState<number>(1);
  const [searchingList, setSearchingList] = useState<Store[]>([]);

  const { superStoreData, refetchSGetStore, isGetSStoreLoading } =
    useSuperGetStoreList({
      selectedPageNum,
      limitItemNum: LIMIT_ITEM_NUM,
    });

  //이벤트 핸들러로 검색
  const searchByCondition = useCallback(() => {
    refetchSGetStore();
    setSelectedPageNum(1);
  }, []);

  //마운트시 자동 검색
  useEffect(() => {
    refetchSGetStore();
  }, [selectedPageNum]);

  //마운트시 페이지 데이터 설정
  useEffect(() => {
    if (
      !superStoreData ||
      !superStoreData.searchingList ||
      !Array.isArray(superStoreData.searchingList)
    )
      return;

    setSearchingList(superStoreData.searchingList);
  }, [superStoreData]);

  return (
    <>
      <LoadingSpinner isLoading={isGetSStoreLoading} />
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
                  <span className="mr-5 ">가입 가맹점 수</span>
                  <span className="text-[25px] lg:text-[35px] text-main">
                    {superStoreData && superStoreData.allSearchinhgLength
                      ? superStoreData.allSearchinhgLength
                      : 0}
                  </span>
                </p>
              </div>
            </div>
            <div className="relative">
              <ul className="border-t-2 border-[#666666]">
                <li className="flex justify-between items-center h-[66px] border-b text-center font-bold">
                  <span className="flex-1">공개 아이디</span>
                  <span className="flex-1 hidden lg:inline">가맹점명</span>
                  <span className="flex-1">사업자명</span>
                  <span className="flex-1 ">가입일</span>
                  <span className="flex-1 hidden lg:inline">업종</span>
                  <span className="flex-1 hidden lg:inline">취급 카테고리</span>
                </li>
                {searchingList && searchingList.length > 0 ? (
                  searchingList.map((item, index) => (
                    <li
                      key={item.storePublicId}
                      className="flex justify-between items-center h-[66px] border-b text-center"
                    >
                      <span className="flex-1 text-[10px]">
                        {item.storePublicId}
                      </span>
                      <span className="flex-1">{item.storeName}</span>
                      <span className="flex-1 hidden lg:inline">
                        {item.name}
                      </span>
                      <span className="flex-1">
                        {U.showDate(item.joinDate)}
                      </span>
                      <span className="flex-1 hidden lg:inline">
                        {item.businessType}
                      </span>
                      <span className="flex-1 hidden lg:inline">
                        {CT.categoryName[item.category]}
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
                superStoreData ? superStoreData.allSearchinhgLength : 0
              }
              setSelectedPageNum={setSelectedPageNum}
            />
          </div>
        </RoundedBox>
      </SuperAdminMain>
    </>
  );
}

export default SuperAdminStoreList;
