import { FC, useEffect, useState } from "react";
import { ReviewApi } from "../service";
import { RoundedPublicBox, ScoreStar } from "../components";
import { useReview, ReviewList } from "../components/review";
import { InfiniteScroll } from "../components/infiniteScroll";
import * as CT from "../constants";
import type { Review } from "../type";

interface ReviewListViewProps {
  storePublicId: string;
}

export const ReviewListView: FC<ReviewListViewProps> = ({ storePublicId }) => {
  const LIMIT_ITEM_NUM = 10;
  const { useGetReviewListPublic } = ReviewApi();
  const [totalScore, setTotalScore] = useState<number>(0);
  const [allReviewLength, setAllReviewLength] = useState<number>(0);
  const [customerReview, setCustomerReview] = useState<Review[]>([]);
  const [adminReview, setAdminReview] = useState<Review[]>([]);

  const {
    reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetchGetReviews,
  } = useGetReviewListPublic(
    { storePublicId, startItemNum: 0, limitItemNum: LIMIT_ITEM_NUM },
    LIMIT_ITEM_NUM
  );

  useEffect(() => {
    if (
      reviewsData &&
      Array.isArray(reviewsData.pages.flatMap((page) => page.customerReviw)) &&
      Array.isArray(reviewsData.pages.flatMap((page) => page.adminReview)) &&
      reviewsData.pages.flatMap((page) => page.totalScroe) &&
      reviewsData.pages.flatMap((page) => page.allReviewLength)
    ) {
      setCustomerReview(
        reviewsData.pages.flatMap((page) =>
          page.customerReviw ? page.customerReviw : []
        )
      );
      setAdminReview(reviewsData.pages.flatMap((page) => page.adminReview));
      setTotalScore(
        reviewsData.pages.flatMap((page) =>
          page.totalScroe ? page.totalScroe : []
        )[0] ?? 0
      );
      setAllReviewLength(
        reviewsData.pages.flatMap((page) =>
          page.allReviewLength ? page.allReviewLength : []
        )[0] ?? 0
      );
    }
  }, [reviewsData]);

  return (
    <RoundedPublicBox className="w-full px-5 py-10 bg-white lg:px-10">
      <div className="pb-5 border-b-2">
        <span className="mr-3 font-bold text-[30px] lg:text-[60px]">
          {totalScore.toFixed(1)}
        </span>
        <span className="text-[15px] lg:text-[30px]">
          {"("}
          {allReviewLength > 0 ? allReviewLength : 0}
          {")"}
        </span>
        <p>
          <ScoreStar color={CT.SUB_CUST_COLOR} score={totalScore} size={30} />
        </p>
      </div>
      <InfiniteScroll
        hasMore={hasNextPage}
        isLoading={isFetchingNextPage}
        loadMore={fetchNextPage}
      >
        <ReviewList
          userRole="customer"
          customerReviews={customerReview}
          adminReviews={adminReview}
        />
      </InfiniteScroll>
    </RoundedPublicBox>
  );
};
