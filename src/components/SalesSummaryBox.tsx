import { useAdminContext } from "../context";
import { PurchaseApi, ReviewApi } from "../service";
import * as CT from "../constants";
import * as U from "../utils";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const SaleSummeryBox = () => {
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [inProgressCount, setInProgressCount] = useState(0); // 진행중인 주문 수
  const [deliveredCount, setDeliveredCount] = useState(0); // 배달완료 주문 수
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayDisplayDate = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const { loginState } = useAdminContext();
  const { useGetPurchaseList } = PurchaseApi();
  const { useGetReviewList } = ReviewApi();
  const { getPurchaseData, refetchGetPurchase, isGetPurchaseLoading } =
    useGetPurchaseList("homeSearch", {
      storePublicId: loginState.storePublicId,
      paymentSelect: CT.paymentMethodKeys,
      purStatusSelect: CT.purchaseStatusKeys,
      selectedPageNum: 1,
      limitItemNum: 0,
      startRangeDate: today,
      endRangeDate: today,
    });

  const { getReviewListata, refetchGetReviewList } = useGetReviewList(
    "homeSearch",
    {
      storePublicId: loginState.storePublicId,
      selectedPageNum: 1,
      limitItemNum: 10,
      startRangeDate: today,
      endRangeDate: today,
    }
  );

  useEffect(() => {
    if (
      !getPurchaseData ||
      !getPurchaseData.searchingPkList ||
      !Array.isArray(getPurchaseData.searchingPkList)
    )
      return;

    //배달 상태별 상태 저장
    const progressPur = Array.isArray(getPurchaseData.searchingPkList)
      ? getPurchaseData.searchingPkList.filter(
          (pur) => pur.purStatus !== "Delivered"
        )
      : [];

    const deliveredPur = Array.isArray(getPurchaseData.searchingPkList)
      ? getPurchaseData.searchingPkList.filter(
          (pur) => pur.purStatus === "Delivered"
        )
      : [];

    setInProgressCount(progressPur.length);
    setDeliveredCount(deliveredPur.length);

    //총 주문금액 계산
    let sumPrice = 0;
    for (let i = 0; i < getPurchaseData.searchingItems.length; i++) {
      sumPrice += getPurchaseData.searchingItems[i].sumPrice;
    }

    setTotalPrice(sumPrice);
  }, [getPurchaseData]);

  return (
    <div className="relative pt-[28px] w-full h-[170px] lg:h-[227px] bg-main">
      <div className="flex px-3 flex-col relative lg:pl-[293px] mx-auto max-w-[1300px]">
        <div className="mt-1 mb-4 h-[31px] font-bold text-[18px] ">
          <span className="pr-3 text-white border-r-2">매출 요약</span>
          <span className="px-3 text-[#ffff5f]">{todayDisplayDate}</span>
        </div>
        <div className="min-w-[320px] lg:w-[1020px] h-[100px] lg:h-[160px] flex text-center font-bold leading-[40px] lg:leading-[67px]">
          <Link to="/admin/purchaseList" className="flex-grow">
            <div className="flex items-center bg-white shadow-[0_8px_15px_rgba(0,0,0,0.1)] lg:mr-[20px] rounded-lg overflow-hidden">
              <p className="bg-white flex-1 h-[100px] lg:h-[160px] pt-[15px] lg:pt-[30px]">
                <span className="block text-base">일일 총 주문건</span>
                <span className="block text-[20px] lg:text-[45px] text-main ">
                  {getPurchaseData ? getPurchaseData.todayItemLength : 0}
                </span>
              </p>
              <p className="bg-white flex-1 h-[100px] lg:h-[160px] pt-[15px] lg:pt-[30px] before:absolute before:block before:h-[70px] lg:before:h-[100px] before:border-r-2">
                <span className="block text-base">진행중인 주문</span>
                <span className="block text-[20px] lg:text-[45px] text-main ">
                  {inProgressCount}
                </span>
              </p>
              <p className="bg-white hidden lg:block flex-1 h-[100px] lg:h-[160px] pt-[15px] lg:pt-[30px] before:absolute before:block before:h-[70px] lg:before:h-[100px] before:border-r-2">
                <span className="block text-base">배달완료 된 주문</span>
                <span className="block text-[20px] lg:text-[45px] text-main ">
                  {deliveredCount}
                </span>
              </p>
              <p className="bg-white flex-1 h-[100px] lg:h-[160px] pt-[15px] lg:pt-[30px] before:absolute before:block before:h-[70px] lg:before:h-[100px] before:border-r-2 ">
                <span className="block text-base">일일매출</span>
                <span className="block text-[15px] lg:text-[30px] text-main">
                  {U.accounting(totalPrice)}
                </span>
              </p>
            </div>
          </Link>
          <Link to="/admin/reviewmanage" className="hidden lg:block">
            <p className="bg-white w-[80px] lg:w-[200px] h-[160px] pt-[15px] lg:pt-[30px] shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-lg">
              <span className="block text-base">일일 리뷰</span>

              <span className="block text-[45px] text-main leading-[67px]">
                {getReviewListata ? getReviewListata.todayItemLength : 0}
              </span>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
