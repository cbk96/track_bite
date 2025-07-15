import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { CustomerMain } from "./CustomerMain";
import { RoundedPublicBox } from "../components";
import { InfiniteScroll } from "../components/infiniteScroll";
import { CouponApi } from "../service";
import { useNavigate } from "react-router-dom";
import { CouponSummaryBox, CouponItem } from "../components";
import type { AppState } from "../store";
import type { LoginCustomer, CouponIssue } from "../type";
import { ReactComponent as UsedCouponIcon } from "../svg/coupon_used.svg";
import { ReactComponent as UnusedCouponIcon } from "../svg/coupon_unused.svg";

export const MyCoupons = () => {
  const LIMIT_ITEM_NUM = 5;
  const [couponIssues, setCouponIssues] = useState<CouponIssue[]>([]);

  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );

  const navigate = useNavigate();
  const { useGetAllCouponIssues } = CouponApi();
  const { couponIssuesData, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllCouponIssues(
      {
        customerId: loginStatus.customerId,
        startItemNum: 0,
        limitItemNum: LIMIT_ITEM_NUM,
      },
      LIMIT_ITEM_NUM
    );

  useEffect(() => {
    if (
      couponIssuesData?.pages &&
      Array.isArray(couponIssuesData?.pages.flat())
    ) {
      setCouponIssues((prev) => couponIssuesData?.pages.flat());
    }
  }, [couponIssuesData]);

  const toStore = (coupon: CouponIssue) => {
    navigate("/store/storeview/" + coupon.storePublicId);
  };

  return (
    <>
      <CouponSummaryBox couponIssues={couponIssues} />
      <CustomerMain>
        <RoundedPublicBox className="p-3 mt-8 mb-6 min-h-[300px] bg-white">
          <InfiniteScroll
            hasMore={hasNextPage}
            isLoading={isFetchingNextPage}
            loadMore={fetchNextPage}
          >
            {couponIssues && couponIssues.length > 0 ? (
              couponIssues.map((coupon) => (
                <li key={coupon.couponIssueId}>
                  <CouponItem
                    coupon={coupon}
                    couponClick={() => toStore(coupon)}
                    type="view"
                    className="hover:bg-orange-shade active:translate-y-1"
                  >
                    <div className="mr-10 font-bold text-center text-[#ccc]">
                      {coupon.used ? (
                        <>
                          <UsedCouponIcon className="block h-[40px]" />
                          <span>사용</span>
                        </>
                      ) : (
                        <>
                          <UnusedCouponIcon className="block h-[40px]" />
                          <span>미사용</span>
                        </>
                      )}
                    </div>
                  </CouponItem>
                </li>
              ))
            ) : (
              <li className="py-32 text-center">등록된 쿠폰이 없습니다.</li>
            )}
          </InfiniteScroll>
        </RoundedPublicBox>
      </CustomerMain>
    </>
  );
};
