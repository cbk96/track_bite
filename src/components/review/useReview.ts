import { useCallback, useEffect, useState, ChangeEvent } from "react";
import type { Review } from "../../type";
import type { AlertState } from "../../components/alert";

type AnswerActive = {
  active: boolean;
  reviewTargetId: string;
};

type RegistAnswer = {
  reigstType: "customer" | "admin";
  purchasePackageId: string;
  setAlertState: (alertState: AlertState) => void;
  logined: boolean;
  storePublicId: string;
  customerId: string;
  customerName: string;
  registMutate: (args: { registReview: Review }) => void;
};

export const useReview = () => {
  const filterCustomerReview = useCallback((reviewList: Review[]) => {
    const onlyCustomerReview = reviewList
      ? reviewList.filter((review) => review.parentId === "")
      : [];
    return onlyCustomerReview;
  }, []);

  const filterAdminReview = useCallback((reviewList: Review[]) => {
    const onlyAdminReview = reviewList
      ? reviewList.filter((review) => review.parentId !== "")
      : [];

    return onlyAdminReview;
  }, []);

  const calculReviewScore = useCallback((customerReviews: Review[]) => {
    let cumulScore: number = 0;
    if (customerReviews.length > 0) {
      for (let i = 0; i < customerReviews.length; i++) {
        cumulScore += Number(customerReviews[i].score);
      }
      cumulScore = cumulScore / customerReviews.length;
    }

    return cumulScore;
  }, []);

  const initialAnswer: AnswerActive = { active: false, reviewTargetId: "" };

  const [answerInputActive, setAnswerInputActive] =
    useState<AnswerActive>(initialAnswer);
  const [answerContent, setAnswerContent] = useState<string>("");

  const setAnswerActive = (active: boolean, reviewTargetId: string) => {
    setAnswerInputActive({ active, reviewTargetId });
  };

  const setWriteAnswer = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length > 500) {
      return;
    }
    setAnswerContent(inputValue);
  };

  const registAnswer = useCallback(
    (registAnswer: RegistAnswer) => {
      if (
        registAnswer.logined &&
        !answerInputActive.active &&
        answerInputActive.reviewTargetId === ""
      )
        return;

      if (answerContent.trim() === "") {
        registAnswer.setAlertState("답변 내용이 입력되지 않았습니다.");
        return;
      }
      const timestamp = new Date().getTime();
      const randomSuffix = Math.floor(Math.random() * 1000);
      const reviewId = `REV-${timestamp}-${randomSuffix}`;
      const content = answerContent;
      const date = new Date();

      const registAns: Review = {
        reviewId,
        purchasePackageId: registAnswer.purchasePackageId,
        storePublicId: registAnswer.storePublicId,
        content,
        customerId: registAnswer.customerId,
        customerName: registAnswer.customerName,
        date,
      };
      if (registAnswer.reigstType === "admin") {
        const parentId = answerInputActive.reviewTargetId;
        registAns.parentId = parentId;
      }
      registAnswer.registMutate({ registReview: registAns });
      setAnswerInputActive({ active: false, reviewTargetId: "" });
      setAnswerContent("");
    },
    [answerInputActive, answerContent]
  );

  return {
    answerInputActive,
    setAnswerActive,
    setWriteAnswer,
    registAnswer,
    filterCustomerReview,
    filterAdminReview,
    calculReviewScore,
  };
};
