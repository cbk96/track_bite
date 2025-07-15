import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import * as CT from "../constants";
import { CustomerMain } from "./CustomerMain";
import {
  CategorySlideButton,
  CategoryTableButton,
  RoundedPublicBox,
} from "../components";
import { useCustomerPublic } from "../context";
import { useNavigate } from "react-router-dom";
import { StoreApi } from "../service";
import { useSelector } from "react-redux";
import { AppState } from "../store";
import { LoginCustomer } from "../type";
import { StoreCard } from "../components";

export function Home() {
  const loginStatus = useSelector<AppState, LoginCustomer>(
    ({ loginCustomer }) => loginCustomer
  );

  const { useGetPopularStore } = StoreApi();
  const { popularStoreData, refetchPopularStore } = useGetPopularStore(
    loginStatus.address.sigunguCode ?? "",
    loginStatus.prefer ?? ""
  );

  const { searchCategory, setSearchCategory } = useCustomerPublic();
  const navigate = useNavigate();

  const selectCategory = (cate: CT.CategoryName) => {
    setSearchCategory(cate);
    navigate(`/store?category=${cate}`);
  };

  useEffect(() => {
    refetchPopularStore();
  }, [loginStatus]);
  return (
    <>
      <div className="w-full min-w-[320px] bg-main-cust">
        <div className="bg-white rounded-t-xl">
          <CategorySlideButton
            selectedCategory={searchCategory as CT.CategoryName}
            onClick={selectCategory}
            className="block lg:mb-7 lg:rounded-none"
          />
        </div>
      </div>

      {loginStatus.address &&
      loginStatus.address.sigunguCode &&
      popularStoreData &&
      popularStoreData.topStores.length > 0 ? (
        <CustomerMain>
          <RoundedPublicBox className="px-3 py-5 mt-5 bg-white border-b-2 bg-gradient-to-t lg:py-10 ">
            <p className="ml-[17px] flex items-end">
              <span className="text-[16px] lg:text-[22px] text-main-cust font-bold">
                요즘 가장 핫한 가게!
              </span>
            </p>
            <div className="overflow-x-scroll">
              <ul className="flex">
                {popularStoreData.topStores.map((store, index) => (
                  <li
                    key={store.storePublicId + "TOP" + index}
                    className="w-[200px] lg:w-[220px] shrink-0"
                  >
                    <StoreCard
                      store={store}
                      className="min-h-[200px] shadow-[0_5px_8px_rgba(0,0,0,0.1)]"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </RoundedPublicBox>
          {loginStatus.prefer !== undefined &&
          popularStoreData.preferStores.length > 0 ? (
            <RoundedPublicBox className="px-3 py-5 mt-5 bg-white lg:py-10">
              <p className="ml-[17px]  flex items-end">
                <span className="text-[16px] lg:text-[22px] text-sub-cust font-bold">
                  {CT.categoryName[loginStatus.prefer] + " 좋아한다면 여기!"}
                </span>
              </p>
              <div className="overflow-x-scroll">
                <ul className="flex">
                  {popularStoreData.preferStores.map((store, index) => (
                    <li
                      key={store.storePublicId + "TOP" + index}
                      className="w-[200px] lg:w-[220px] shrink-0"
                    >
                      <StoreCard
                        store={store}
                        className="min-h-[200px] shadow-[0_5px_8px_rgba(0,0,0,0.1)]"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </RoundedPublicBox>
          ) : null}
        </CustomerMain>
      ) : null}
      <div
        className="lg:hidden min-w-[320px] h-[550px] bg-no-repeat bg-center"
        style={{
          backgroundSize: "auto 100%",
          backgroundImage: `url("${CT.LOCAL_IMAGE_PATH}/projectBackground_mobile.jpg")`,
        }}
      ></div>
      <div
        className="hidden lg:block min-w-[320px] h-[550px] bg-no-repeat bg-center"
        style={{
          backgroundSize: "auto 100%",
          backgroundImage: `url("${CT.LOCAL_IMAGE_PATH}/projectBackground.jpg")`,
        }}
      ></div>
    </>
  );
}

export default Home;
