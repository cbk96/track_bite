import { useCallback, useEffect, useMemo, useState } from "react";
import { ReviewList } from "../../components/review";
import { useAdminContext } from "../../context";
import { ReviewApi } from "../../service";
import { AdminMain } from "./AdminMain";
import { SideBar, TabMenuBar, RoundedBox } from "../../components";
import { DateRangeInput, useDateRange } from "../../components/dateRange";
import { PageButton, ScoreStar } from "../../components";
import { LoadingSpinner, useLoading } from "../../components/loading";

export const ReviewManage = () => {
  const tabNames = ["주문내역", "리뷰내역"];
  const tabLinks = ["/admin/purchaseList", "/admin/reviewmanage"];
  const currentTab = "리뷰내역";
  const limitItemNum = 10;

  const { loginState } = useAdminContext();
  const { useGetReviewList } = ReviewApi();
  const { dateRange, changeDateRange } = useDateRange(30);
  const [selectedPageNum, setSelectedPageNum] = useState<number>(1);
  const { isLoading, setIsLoading } = useLoading();

  const { getReviewListata, refetchGetReviewList } = useGetReviewList(
    "detailSearch",
    {
      storePublicId: loginState.storePublicId,
      selectedPageNum,
      limitItemNum,
      startRangeDate: dateRange.startDay,
      endRangeDate: dateRange.endDay,
    }
  );

  //마운트시 리뷰 검색
  useEffect(() => {
    refetchGetReviewList();
  }, [loginState, selectedPageNum]);

  //이벤트 핸들러로 리뷰 검색
  const searchByCondition = useCallback(() => {
    refetchGetReviewList();
    setSelectedPageNum(1);
  }, [dateRange, selectedPageNum]);

  return (
    <>
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
          <div className="mt-[60px] mb-[60px]">
            <button
              type="button"
              onClick={searchByCondition}
              className="p-2 rounded-md bg-sub hover:bg-sub-hover text-white text-[14px] font-bold"
            >
              리뷰조회
            </button>
          </div>
          <div className="flex flex-col lg:flex-row items-end lg:items-center justify-end mt-5 mb-5 text-[14px] lg:text-[16px]">
            <p className="flex items-center justify-end pr-5 lg:mr-5 h-[40px] font-bold lg:border-r-2">
              <ScoreStar score={getReviewListata?.grade ?? 0} />
              <span className="text-[25px] lg:text-[35px] text-main">
                {getReviewListata && getReviewListata.grade
                  ? getReviewListata.grade.toFixed(1)
                  : 0}
              </span>
            </p>
            <div className="flex mt-3 lg:mt-0">
              <p className="flex items-center justify-end pr-5 mr-5 h-[40px] font-bold border-r-2">
                <span className="mr-5">일일 리뷰 수</span>
                <span className="text-[25px] lg:text-[35px] text-main">
                  {getReviewListata && getReviewListata.todayItemLength}
                </span>
              </p>
              <p className="flex items-center justify-end pr-5 lg:mr-5 h-[40px] font-bold lg:border-r-2">
                <span className="mr-5">조회된 리뷰</span>
                <span className="text-[25px] lg:text-[35px] text-main">
                  {getReviewListata && getReviewListata.searchingAllItemLength}
                </span>
              </p>
            </div>
          </div>
          <div className=" relative border-t-2 border-[#666666]">
            <ReviewList
              userRole="admin"
              customerReviews={
                getReviewListata &&
                getReviewListata.searchingItemList &&
                getReviewListata.searchingItemList[0]
                  ? getReviewListata.searchingItemList[0]
                  : []
              }
              adminReviews={
                getReviewListata &&
                getReviewListata.searchingItemList &&
                getReviewListata.searchingItemList[1]
                  ? getReviewListata.searchingItemList[1]
                  : []
              }
              registMode={true}
            />
            <LoadingSpinner isLoading={isLoading} />
          </div>
          <div className="mb-10 mt-7">
            <PageButton
              selectedPageNum={selectedPageNum}
              pageButtonPcs={10}
              showItemPcs={limitItemNum}
              foundedItemAllPcs={
                getReviewListata ? getReviewListata.searchingAllItemLength : 0
              }
              setSelectedPageNum={setSelectedPageNum}
            />
          </div>
        </RoundedBox>
      </AdminMain>
    </>
  );
};

export default ReviewManage;
