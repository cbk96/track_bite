import { FC, useEffect } from "react";
import { PopularStore, StorePublicInfo } from "../type";
import { Link } from "react-router-dom";
import { FallbackImg } from "./FallbackImg";
import * as CT from "../constants";
import * as U from "../utils";
import { Star } from "phosphor-react";

interface props {
  store: StorePublicInfo | PopularStore;
  className?: string;
}

export const StoreCard: FC<props> = ({ store, className }) => {
  const chkStorePublicInfo = (obj: any): obj is StorePublicInfo => {
    return (
      obj &&
      typeof obj === "object" &&
      "deliveryFee" in obj &&
      "minOrderAmount" in obj
    );
  };
  const chkPopularStore = (obj: any): obj is PopularStore => {
    return (
      obj &&
      typeof obj === "object" &&
      "totalOrdered" in obj &&
      "category" in obj
    );
  };

  return (
    <div className={`mx-3 my-5 mb-5 bg-white rounded-lg ${className}`}>
      <Link
        to={"/store/storeview/" + store.storePublicId}
        className="inline-block w-full h-full overflow-hidden bg-white rounded-t-lg"
      >
        <FallbackImg
          src={store.heroBannerPath}
          alt="스토어 메인 이미지"
          fallback="defaultStore.jpg"
          className="object-cover w-full h-[120px]"
        />

        <div className="p-5 pt-1">
          <p className="overflow-hidden font-bold text-ellipsis whitespace-nowrap">
            {store.storeName}
          </p>
          <p className="flex items-center">
            <Star color={CT.SUB_CUST_COLOR} weight="fill" className="mr-1" />
            <span className="mr-1 font-bold ">
              {(store.reviewScore ?? 0).toFixed(1)}
            </span>
            <span>{"(" + (store.reviewCount ?? 0) + ")"}</span>
          </p>
          {chkStorePublicInfo(store) && store.minOrderAmount ? (
            <p>최소 주문 {U.accounting(store.minOrderAmount) + "원"}</p>
          ) : null}
          {chkStorePublicInfo(store) && store.deliveryFee ? (
            <p>배달비 {U.accounting(store.deliveryFee) + "원"}</p>
          ) : null}
          {chkPopularStore(store) && store.totalOrdered ? (
            <p>주문수 {store.totalOrdered ?? 0}</p>
          ) : null}
        </div>
      </Link>
    </div>
  );
};
