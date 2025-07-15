import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { ScoreStar } from "../../components";
import { Star } from "phosphor-react";
import * as CT from "../../constants";
import * as U from "../../utils";
import { useAdminContext } from "../../context";
import { ReviewApi } from "../../service";
import { useReview } from "./";
import type { Review } from "../../type";

interface ReviewListProps {
  customerReviews: Review[];
  adminReviews: Review[];
  registMode?: boolean;
  userRole: "customer" | "admin";
}

export const ReviewList: FC<ReviewListProps> = ({
  customerReviews,
  adminReviews,
  registMode = false,
  userRole = "customer",
}) => {
  const customerColor = {
    bgMain: "bg-main-cust",
    bgMainHover: "hover:bg-main-cust-hover",
    bgSub: "bg-sub-cust",
    bgSubHover: "hover:bg-sub-cust-hover",
  };
  const adminColor = {
    bgMain: "bg-main",
    bgMainHover: "hover:bg-main-hover",
    bgSub: "bg-sub",
    bgSubHover: "hover:bg-sub-hover",
  };

  const [btnColor, setBtnColor] = useState<
    typeof adminColor | typeof customerColor
  >(customerColor);
  const { loginState, setAlertState: setADAlertState } = useAdminContext();

  const { useRegistReviewAns } = ReviewApi();
  const { registReviewAnsMutate } = useRegistReviewAns();
  const { answerInputActive, setAnswerActive, setWriteAnswer, registAnswer } =
    useReview();

  useEffect(() => {
    if (userRole === "customer") {
      setBtnColor(customerColor);
    } else {
      setBtnColor(adminColor);
    }
  }, [userRole]);

  const registAdminWrite = (purchasePackageId: string) => {
    registAnswer({
      reigstType: "admin",
      purchasePackageId,
      setAlertState: setADAlertState,
      logined: loginState.logined,
      storePublicId: loginState.storePublicId,
      customerId: loginState.storePublicId,
      customerName: loginState.storeName,
      registMutate: registReviewAnsMutate,
    });
  };

  return (
    <ul>
      {customerReviews.length > 0 ? (
        customerReviews.map((review) => {
          return (
            <li key={review.reviewId} className="border-b-2">
              <p className="pt-5 pb-2">
                <span className="mr-3 font-bold text-[16px] lg:text-[25px]">
                  {review.customerName}
                </span>

                <span>{U.showDate(review.date)}</span>
              </p>
              <p className="pb-3">
                <ScoreStar
                  color={
                    userRole === "customer" ? CT.SUB_CUST_COLOR : CT.SUB_COLOR
                  }
                  score={review.score ? review.score : 0}
                  size={20}
                />
              </p>
              <p className="flex">
                {review.menuNames &&
                  review.menuNames.map((menuName, index) => {
                    return index < 2 ? (
                      <span
                        key={menuName + index}
                        className={`inline-block mr-3 p-1 pl-2 pr-2 max-w-[80px] lg:max-w-[200px] lg:text-[18px] rounded-full ${btnColor.bgSub} text-white text-ellipsis overflow-hidden whitespace-nowrap`}
                      >
                        {menuName}
                      </span>
                    ) : index === 2 ? (
                      <span
                        key={menuName + index}
                        className={`inline-block mr-3 p-1 pl-2 pr-2 lg:text-[18px] rounded-full ${btnColor.bgSub} text-white`}
                      >
                        ...
                      </span>
                    ) : null;
                  })}
              </p>
              <p className="flex justify-between items-center pt-5 pb-5 lg:text-[18px] overflow-hidden text-ellipsis">
                <span>{review.content}</span>
                {registMode &&
                  !adminReviews.some(
                    (adReview) => adReview.parentId === review.reviewId
                  ) &&
                  answerInputActive.reviewTargetId !== review.reviewId && (
                    <span>
                      <button
                        onClick={() => setAnswerActive(true, review.reviewId)}
                        className={`rounded-md p-1 pl-2 pr-2 text-[18px] text-white ${btnColor.bgMain} ${btnColor.bgMainHover}`}
                      >
                        답글달기
                      </button>
                    </span>
                  )}
              </p>
              {answerInputActive.active &&
                answerInputActive.reviewTargetId === review.reviewId && (
                  <div className="pt-5 pl-10 pr-10 bg-[#f2f2f2] border-t">
                    <span className="mr-3 font-bold text-[16px] lg:text-[25px]">
                      사장님
                    </span>
                    <p className="pt-5 pb-2 text-[18px]">
                      <textarea
                        onChange={setWriteAnswer}
                        className="p-2 w-full h-[150px] rounded-md border resize-none "
                      ></textarea>
                    </p>
                    <p className="flex justify-end pb-3">
                      <button
                        onClick={() => setAnswerActive(false, "")}
                        className={`rounded-md p-1 pl-2 pr-2 mr-1 w-[84px] text-[18px] text-white ${btnColor.bgSub} ${btnColor.bgSubHover}`}
                      >
                        취소
                      </button>
                      <button
                        onClick={() =>
                          registAdminWrite(review.purchasePackageId)
                        }
                        className={`rounded-md p-1 pl-2 pr-2 w-[84px] text-[18px] text-white ${btnColor.bgMain} ${btnColor.bgMainHover} `}
                      >
                        답글등록
                      </button>
                    </p>
                  </div>
                )}
              {adminReviews.length > 0 &&
                adminReviews
                  .filter((adReview) => adReview.parentId === review.reviewId)
                  .map((reply) => {
                    return (
                      <div
                        key={reply.reviewId}
                        className="pt-5 px-5 lg:px-10 bg-[#f2f2f2] border-t"
                      >
                        <span className="mr-3 font-bold text-[16px] lg:text-[25px]">
                          사장님
                        </span>
                        <span>{new Date(reply.date).toLocaleDateString()}</span>
                        <p className="pt-5 pb-5 lg:text-[18px] overflow-hidden text-ellipsis">
                          {reply.content}
                        </p>
                      </div>
                    );
                  })}
            </li>
          );
        })
      ) : (
        <li className="text-center pt-[50px] pb-[50px]">
          <p className="flex items-center justify-center pb-[20px]">
            <Star size={50} color="#ccc" />
            <Star size={75} color="#ccc" />
            <Star size={90} color="#ccc" />
            <Star size={75} color="#ccc" />
            <Star size={50} color="#ccc" />
          </p>
          <span className="font-bold text-[#aaa]">등록된 리뷰가 없습니다.</span>
        </li>
      )}
    </ul>
  );
};
