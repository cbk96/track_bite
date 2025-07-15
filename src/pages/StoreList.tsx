import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { CustomerMain } from "./CustomerMain";
import { RoundedPublicBox, StoreCard } from "../components";
import { InfiniteScroll } from "../components/infiniteScroll";
import { StoreApi } from "../service";
import * as T from "../type";
import type { AppState } from "../store";
import type {
  LoginCustomer,
  StorePublicInfo,
  StoreListSearchFilter,
} from "../type";
import { Storefront, Star } from "phosphor-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  PopupBackGround,
  PopupContainer,
  AddressInsertPopup,
  usePopup,
  CategorySlideButton,
} from "../components";
import * as CT from "../constants";
import * as CS from "../store/customer";
import * as U from "../utils";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useCustomerPublic } from "../context";

type DeliAddress = { province: string; city: string };

export const StoreList = () => {
  const LIMIT_ITEM_NUM = 20;
  const ADDRESS_INSERT_POUP_ID = "addressInsertPop";
  const { setSearchCategory } = useCustomerPublic();
  const [searchParams] = useSearchParams();
  const storeName = searchParams.get("storeName");
  const category = searchParams.get("category");

  const { popupActive, setPopupActive } = usePopup();
  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );

  const [storeList, setStoreList] = useState<StorePublicInfo[]>([]);
  const [searchFilter, setSearchFilter] = useState<StoreListSearchFilter>({
    ...T.initialStoreListSearchFilter,
    limitItemNum: LIMIT_ITEM_NUM,
  });

  const { useGetStoreList } = StoreApi();
  const {
    storeListData,
    fetchNextPage,
    refetchGetStoreList,
    hasNextPage,
    isFetchingNextPage,
  } = useGetStoreList(searchFilter, LIMIT_ITEM_NUM);

  const dispatch = useDispatch();

  const onSetAddress = useCallback(
    (data: Omit<T.Address, "detailedAddress">) => {
      const guestAccount = U.createGuestAccountAndAddress(loginStatus, data);
      dispatch(CS.loginCustomer(guestAccount));

      setPopupActive({ popupId: "", active: false });
    },
    [loginStatus]
  );

  //로그인 중인 계정을 확인해서 주소 정보가 누락되어 있으면 주소 입력 팝업 출력
  //계정의 주소 정보를 검색 조건에 추가
  useEffect(() => {
    if (
      Object.entries(loginStatus.address)
        .filter(([key]) => key !== "detailedAddress")
        .some(([, value]) => value?.trim() === "" || value === undefined)
    ) {
      //주소 입력 팝업 활성화

      setPopupActive({ active: true, popupId: ADDRESS_INSERT_POUP_ID });
    } else {
      setPopupActive({ active: false, popupId: "" });
      setSearchFilter((prev) => ({
        ...prev,
        sigunguCode: loginStatus.address.sigunguCode,
      }));
    }
  }, [loginStatus]);

  useEffect(() => {
    if (storeListData?.pages && Array.isArray(storeListData?.pages.flat())) {
      setStoreList(storeListData?.pages.flat());
    }
  }, [storeListData]);

  //카테고리 선택
  const selectCategory = (cate: CT.CategoryName) => {
    setSearchCategory(cate);
    setSearchFilter((prev) => ({
      ...prev,
      category: cate,
    }));
  };

  useEffect(() => {
    setSearchFilter((prev) => ({
      ...prev,
      storeName: storeName ?? "",
    }));

    if (category) {
      selectCategory(category as CT.CategoryName);
    }
  }, [storeName, category]);

  //검색 조건 변경 감지시 추가 검색
  useEffect(() => {
    refetchGetStoreList();
  }, [searchFilter]);

  return (
    <>
      <PopupBackGround
        popupActive={popupActive}
        setPopupActive={setPopupActive}
      >
        <PopupContainer
          popupActive={popupActive}
          popupId={ADDRESS_INSERT_POUP_ID}
        >
          <AddressInsertPopup
            popupActive={popupActive}
            setPopupActive={setPopupActive}
            onComplete={onSetAddress}
          />
        </PopupContainer>
      </PopupBackGround>
      <section className="bg-main-cust min-w-[320px]">
        <CategorySlideButton
          selectedCategory={searchFilter.category}
          onClick={selectCategory}
          highlightColor="#eab308"
          mutedColor="#ffffff"
          className="h-[290px] lg:h-[450px]"
        />
      </section>
      {/*<PatternZigzagBG className="absolute top-[480px] left-0" />*/}
      <CustomerMain>
        <RoundedPublicBox className="mt-8 mb-6 pt-[40px] pb-[40px] bg-white translate-y-[-80px]">
          {storeList.length > 0 ? (
            <InfiniteScroll
              hasMore={hasNextPage}
              isLoading={isFetchingNextPage}
              loadMore={fetchNextPage}
              className="flex flex-wrap px-3 lg:px-0 mx-auto max-w-[880px] justify-start"
            >
              {storeList.map((store) => (
                <li key={store.storePublicId} className="w-1/2 lg:w-[220px]">
                  <StoreCard
                    store={store}
                    className="min-h-[240px] lg:min-h-[270px] shadow-[0_5px_8px_rgba(0,0,0,0.1)] animate-fadeIn"
                  />
                </li>
              ))}
            </InfiniteScroll>
          ) : (
            <div className="flex flex-col justify-center h-[500px] text-center">
              <Storefront size={200} color="#ccc" className="mx-auto" />
              <span className="text-[#aaa]">조회된 스토어가 없습니다.</span>
            </div>
          )}
        </RoundedPublicBox>
      </CustomerMain>
    </>
  );
};
