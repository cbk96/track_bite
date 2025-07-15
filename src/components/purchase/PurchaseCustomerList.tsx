import {
  FC,
  useState,
  useEffect,
  useCallback,
  useRef,
  ChangeEvent,
} from "react";
import { Link } from "react-router-dom";
import { useCustomerPublic } from "../../context";
import { ReviewApi } from "../../service";
import { CookingPot } from "phosphor-react";
import { FetchButton } from "../FetchButton";
import { useDateRange, DateRangeInput } from "../../components/dateRange";
import * as CT from "../../constants";
import * as T from "../../type";
import * as U from "../../utils";
import { PurchaseApi } from "../../service";
import type { PopupStatus } from "../popup";
import type { AppState } from "../../store";
import type {
  LoginCustomer,
  Purchase,
  CompactPurchase,
  Review,
} from "../../type";
import { InfiniteScroll } from "../infiniteScroll";
import { useSelector } from "react-redux";
import { ScoreStar } from "../scoreStar";
import { FallbackImg } from "../FallbackImg";
import { ReactComponent as BikeIcon } from "../../svg/bike.svg";

interface PurchaseCustomerListProps {
  setPopupActive: React.Dispatch<React.SetStateAction<PopupStatus>>;
  popupId: string;
  setSelectPurchaseId: React.Dispatch<React.SetStateAction<string>>;
}

type ReviewActive = {
  active: boolean;
  purchasePackageId: string;
  storePublicId: string;
};

export const PurchaseCustomerList: FC<PurchaseCustomerListProps> = ({
  setPopupActive,
  popupId,
  setSelectPurchaseId,
}) => {
  const { dateRange, changeDateRange } = useDateRange(7);
  const { setAlertState } = useCustomerPublic();

  const { useGetPurchaseCustList } = PurchaseApi();

  const loadCountRef = useRef(1);
  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );

  const LIMIT_ITEM_NUM = 20;
  const initialReviewActive: ReviewActive = {
    active: false,
    purchasePackageId: "",
    storePublicId: "",
  };

  const [loadCount, setLoadCount] = useState(1);
  const [byOrderpurChases, setByOrderPurchases] = useState<Purchase[]>([]);
  const [byMenupurChases, setByMenuPurchases] = useState<CompactPurchase[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [writeReview, setWriteReview] = useState<Review>(T.initialReview);
  const [reviewActive, setReviewActive] =
    useState<ReviewActive>(initialReviewActive);

  const searchCondition = {
    customerId: loginStatus.customerId,
    startItemNum: 0,
    limitItemNum: LIMIT_ITEM_NUM,
    startRangeDate: dateRange.startDay,
    endRangeDate: dateRange.endDay,
  };

  const {
    searchPurchaseData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetchGetPurchaseList,
  } = useGetPurchaseCustList(searchCondition, LIMIT_ITEM_NUM);

  //리뷰 작성용 mutate
  const { useRegistReview } = ReviewApi();
  const { registReviewMutate } = useRegistReview(() =>
    refetchGetPurchaseList()
  );

  //검색 버튼 수동검색
  const manualSearch = useCallback(() => {
    refetchGetPurchaseList();
  }, [loginStatus, LIMIT_ITEM_NUM, dateRange]);

  //스크롤 이벤트로 추가된 검색 데이터 갱신
  useEffect(() => {
    if (
      searchPurchaseData &&
      Array.isArray(
        searchPurchaseData.pages.flatMap((page) => page.SearchingResult)
      ) &&
      Array.isArray(
        searchPurchaseData.pages.flatMap((page) => page.SearchingMenus)
      ) &&
      Array.isArray(searchPurchaseData.pages.flatMap((page) => page.reviews))
    ) {
      setByOrderPurchases((prev) =>
        searchPurchaseData.pages.flatMap((page) =>
          page.SearchingResult ? page.SearchingResult : []
        )
      );
      setByMenuPurchases((prev) =>
        searchPurchaseData.pages.flatMap((page) =>
          page.SearchingMenus ? page.SearchingMenus : []
        )
      );
      setReviews((prev) =>
        searchPurchaseData.pages.flatMap((page) =>
          page.reviews ? page.reviews : []
        )
      );
    }
  }, [searchPurchaseData]);

  const selectPurchaseByPackId = (purchasePackageId: string) => {
    setSelectPurchaseId(purchasePackageId);
    setPopupActive({ active: true, popupId });
  };

  //리뷰작성
  const inputReview =
    (key: keyof Review) => (e: ChangeEvent<HTMLTextAreaElement>) => {
      const inputValue = e.target.value;
      if (inputValue.length > 200) {
        setAlertState("200자 이상은 입력할 수 없습니다.");
        return;
      }
      setWriteReview((prev) => ({ ...prev, [key]: inputValue }));
    };

  //리뷰 점수 입력
  const inputReviewScore = (score: number) => {
    if (Number(score) <= 0) {
      setWriteReview((prev) => ({ ...prev, score: 0.5 }));
      return;
    }
    setWriteReview((prev) => ({ ...prev, score: score }));
  };

  //사용자 입력값 외 자동 입력
  useEffect(() => {
    const createPurchasePackageId = U.createId("REV", loginStatus.customerId);
    const menuNames = byMenupurChases
      .filter(
        (menu) => menu.purchasePackageId === reviewActive.purchasePackageId
      )
      .map((purch) => purch.menu.menuName);

    setWriteReview((prev) => ({
      ...prev,
      reviewId: createPurchasePackageId,
      purchasePackageId: reviewActive.purchasePackageId,
      storePublicId: reviewActive.storePublicId,
      customerId: loginStatus.customerId,
      customerName: loginStatus.name,
      menuNames,
    }));
  }, [reviewActive]);

  const reviewRegist = useCallback(() => {
    if (writeReview.content.trim() === "" || Number(writeReview.score) <= 0) {
      setAlertState("입력되지 않은 값이 있습니다.");
      return;
    }
    registReviewMutate({ registReview: writeReview });
    setReviewActive(initialReviewActive);
    setWriteReview(T.initialReview);
  }, [writeReview]);

  useEffect(() => {
    console.log("byOrderpurChases : ", byOrderpurChases);
  }, [byOrderpurChases]);

  return (
    <>
      <div className="pt-[30px] pb-[20px] lg:pl-[40px] border-b-2">
        <p className="flex items-center text-[18px] font-bold">
          <BikeIcon className="w-[27px] mr-3" />
          <span>주문내역</span>
        </p>
        <div className="flex flex-col itmes-start lg:items-end lg:flex-row">
          <DateRangeInput
            dateRange={dateRange}
            changeDateRange={changeDateRange}
          />
          <FetchButton
            type="button"
            onClick={manualSearch}
            isFetching={isFetchingNextPage}
            className="mt-2 lg:mt-0 lg:ml-5 mb-[4px] pl-3 pr-3 h-[38px] leading-[38px] font-bold text-white rounded-lg bg-main-cust hover:bg-main-cust-hover"
          >
            기간 내 검색
          </FetchButton>
        </div>
      </div>
      <InfiniteScroll
        hasMore={hasNextPage}
        isLoading={isFetchingNextPage}
        loadMore={fetchNextPage}
        className="px-[10px] lg:px-[40px] bg-white"
      >
        {byOrderpurChases.length > 0 ? (
          byOrderpurChases.map((purchase) => (
            <li
              key={purchase.purchasePackageId}
              className="min-h-[250px] lg:min-h-[198px] border-b-2 "
            >
              <div className="flex justify-between">
                <p className="leading-[70px] font-bold">
                  <span className="mr-3">{U.showDate(purchase.date)}</span>
                  <span className="text-[14px]">
                    {"(" + CT.purchaseStatus[purchase.purStatus] + ")"}
                  </span>
                </p>
                <button
                  onClick={() =>
                    selectPurchaseByPackId(purchase.purchasePackageId)
                  }
                  className="hover:text-main-cust"
                >
                  주문상세 &gt;
                </button>
              </div>
              <div className="relative flex items-start lg:items-center lg:h-[100px]">
                <span className="mr-4 w-[100px] h-[100px] rounded-md shadow-[0_5px_8px_rgba(0,0,0,0.3)] overflow-hidden">
                  <Link to={"/store/storeview/" + purchase.storePublicId}>
                    <FallbackImg
                      src={purchase.logoPath}
                      fallback="defaultStore.jpg"
                      alt="스토어 로고"
                      className=""
                    />
                  </Link>
                </span>
                <div className="flex-grow flex flex-col justify-between h-[200px] lg:h-full">
                  <p className="mb-5 text-[18px] font-bold">
                    <Link to={"/store/storeview/" + purchase.storePublicId}>
                      {purchase.storeName}
                    </Link>
                  </p>
                  <div className="absolute bottom-0 left-0 flex flex-col justify-between lg:flex-row lg:relative">
                    <p className="flex p-1 my-2 overflow-hidden lg:my-0 whitespace-nowrap">
                      {byMenupurChases
                        .filter(
                          (menu) =>
                            menu.purchasePackageId ===
                            purchase.purchasePackageId
                        )
                        .map((purchMenu, index) => {
                          if (index < 2) {
                            return (
                              <span
                                key={purchMenu.purchaseId + index}
                                className="inline-block p-[5px] pl-[10px] pr-[10px] max-w-[80px] lg:max-w-[200px] mr-3 text-white rounded-full bg-sub-cust text-ellipsis overflow-hidden whitespace-nowrap"
                              >
                                {purchMenu.menu.menuName}
                              </span>
                            );
                          }
                          if (index === 2) {
                            return (
                              <span
                                key={purchMenu.purchaseId + index}
                                className="inline-block p-[5px] pl-[20px] pr-[20px] mr-3 text-white rounded-full bg-sub-cust"
                              >
                                ...
                              </span>
                            );
                          }
                        })}
                    </p>
                    <p className="px-2 my-2 lg:my-0">
                      {purchase.purStatus === "Delivered" &&
                        !reviews.some(
                          (review) =>
                            review.purchasePackageId ===
                            purchase.purchasePackageId
                        ) && (
                          <button
                            className="rounded-md p-1 pl-2 pr-2 lg:text-[18px] text-white bg-main-cust hover:bg-main-cust-hover "
                            onClick={() =>
                              setReviewActive({
                                active: true,
                                purchasePackageId: purchase.purchasePackageId,
                                storePublicId: purchase.storePublicId,
                              })
                            }
                          >
                            리뷰작성
                          </button>
                        )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 작성된 리뷰 */}
              {reviews.length > 0 &&
                (() => {
                  const review = reviews.find(
                    (review) =>
                      review.purchasePackageId === purchase.purchasePackageId
                  );
                  return review ? (
                    <div className="mt-8 mb-3 pl-10 pr-10 bg-[#f2f2f2] rounded-lg">
                      <p className="pt-5 pb-2">
                        <span className="mr-3 font-bold text-[16px] lg:text-[25px]">
                          {review.customerName}
                        </span>
                        <span>{U.showDate(review.date)}</span>
                      </p>
                      <p className="pb-3">
                        <ScoreStar
                          color={CT.SUB_CUST_COLOR}
                          score={review.score ? review.score : 0}
                          size={20}
                        />
                      </p>

                      <p className="flex justify-between items-center pt-5 pb-5 lg:text-[18px]">
                        <span>{review.content}</span>
                      </p>
                    </div>
                  ) : null;
                })()}

              {/* 리뷰 작성 폼 */}
              {reviewActive.active &&
                reviewActive.purchasePackageId ===
                  purchase.purchasePackageId && (
                  <div className="mt-8 mb-3 pt-5 pl-10 pr-10 bg-[#f2f2f2] border-t">
                    <div className="flex items-end">
                      <div className="mr-3">
                        <ScoreStar
                          color={CT.SUB_CUST_COLOR}
                          type="input"
                          score={writeReview.score ?? 0}
                          setScore={inputReviewScore}
                        />
                      </div>
                      <span className="mr-3 font-bold">{loginStatus.name}</span>
                    </div>
                    <p className="pt-5 pb-2 text-[18px]">
                      <textarea
                        onChange={inputReview("content")}
                        className="p-2 w-full h-[150px] rounded-md border resize-none "
                      ></textarea>
                    </p>
                    <p className="flex justify-end pb-3">
                      <button
                        onClick={() =>
                          setReviewActive({
                            active: false,
                            purchasePackageId: "",
                            storePublicId: "",
                          })
                        }
                        className="rounded-md p-1 pl-2 pr-2 mr-1 w-[84px] text-[18px] text-white bg-sub-cust hover:bg-sub-cust-hover "
                      >
                        취소
                      </button>
                      <button
                        onClick={reviewRegist}
                        className="rounded-md p-1 pl-2 pr-2 w-[84px] text-[18px] text-white bg-main-cust hover:bg-main-cust-hover "
                      >
                        리뷰등록
                      </button>
                    </p>
                  </div>
                )}
            </li>
          ))
        ) : (
          <li className="p-12 text-center">
            <p>
              <CookingPot size={150} color="#ccc" className="mx-auto" />
            </p>
            <p className="font-bold text-[#aaa]">
              조회된 주문 내역이 없습니다.
            </p>
          </li>
        )}
      </InfiniteScroll>
    </>
  );
};
