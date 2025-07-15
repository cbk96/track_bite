import { useState } from "react";
import { Link } from "react-router-dom";
import { SaleSummeryBox } from "../../components";
import { AdminMain } from "./AdminMain";
import { RoundedBox, FallbackImg } from "../../components";
import { useAdminContext } from "../../context/AdminContext";
import * as CT from "../../constants";
import { StoreApi, MenuApi, PromotionApi } from "../../service";
import * as U from "../../utils";
import * as T from "../../type";

export function AdminHome() {
  const [operatingHours, setOperatingHours] = useState<T.OperatingHours[]>(
    T.initialOperatingHours
  );
  const { loginState } = useAdminContext();
  const { useGetStoreNotification } = PromotionApi();
  const { getStoreNotiData } = useGetStoreNotification(loginState.storeId);

  const { useGetOperatingHours } = StoreApi();
  useGetOperatingHours(loginState.storePublicId ?? "", setOperatingHours);

  const { useGetPopularMenus } = MenuApi();
  const { popularMenuData } = useGetPopularMenus(loginState.storePublicId);

  return (
    <>
      <SaleSummeryBox />
      <AdminMain className="pt-3">
        <RoundedBox
          title="가게정보"
          underLine={false}
          modifyLink="/admin/editAdmin"
          modifyText="수정"
        >
          {loginState !== null && loginState.logined && (
            <>
              <div className="min-h-[140px] lg:min-h-[180px] border-b-2">
                <div className="flex">
                  <p className="w-[100px] h-[100px] lg:w-[140px] lg:h-[140px] bg-white shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-lg">
                    <FallbackImg
                      src={`${loginState.logoPath}`}
                      fallback="defaultStore.jpg"
                      alt="가게 로고 이미지"
                      className="overflow-hidden rounded-md"
                    />
                  </p>
                  <div className="pl-7 mt-[6px]  text-[#666666]">
                    <p className="mb-[10px] font-bold">
                      {loginState.storeName}
                    </p>
                    <p className="mb-[5px]">
                      <span className="mr-5 inline-block w-[90px]">대표자</span>
                      <span>{loginState.name}</span>
                    </p>
                    <p className="mb-[5px]">
                      <span className="mr-5 inline-block w-[90px]">업종</span>
                      <span>{CT.categoryName[loginState.category]}</span>
                    </p>
                    <p className="">
                      <span className="mr-5 inline-block w-[90px]">
                        전화번호
                      </span>
                      <span>{loginState.tel}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="pb-10 border-b-2">
                <p className="pr-5 pt-6 pb-3 text-[16px] font-bold flex justify-between">
                  <span>최소주문금액 | 배달수수료</span>
                </p>
                <div className="px-5 text-[#666666] flex flex-col lg:flex-row font-bold leading-10">
                  <p>
                    <span className="inline-block pr-8 w-[132px] font-normal text-main">
                      최소주문금액
                    </span>
                    <span className="inline-block w-[100px]">
                      {U.accounting(loginState.minOrderAmount) + "원"}
                    </span>
                  </p>
                  <p>
                    <span className="inline-block pr-8 w-[132px] lg:mr-2 font-normal text-sub">
                      배달수수료
                    </span>
                    <span className="inline-block w-[100px]">
                      {U.accounting(loginState.deliveryFee) + "원"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="pb-10">
                <p className="flex justify-between pt-6 pb-3 pr-5 font-bold">
                  <span className="text-[16px]">영업시간</span>
                  <span className="text-main">
                    <Link to="/admin/editOpHours">수정 &gt;</Link>
                  </span>
                </p>
                <ul className="text-[#666666] px-5">
                  {operatingHours && operatingHours.length > 0 ? (
                    operatingHours.map((day) => {
                      return (
                        <li key={day.day} className="font-bold leading-10">
                          <span className="inline-block w-[130px] pr-8 font-normal">
                            {CT.weekName[day.day]}
                          </span>
                          {day.open === "" && day.close === "" ? (
                            <span>휴무일</span>
                          ) : (
                            <>
                              <span>{day.open}</span>
                              <span className="w-[30px] inline-block text-center">
                                ~
                              </span>
                              <span>{day.close}</span>
                            </>
                          )}
                        </li>
                      );
                    })
                  ) : (
                    <li className="py-10 text-center">
                      등록된 영업시간 정보가 없습니다.
                    </li>
                  )}
                </ul>
              </div>
            </>
          )}
        </RoundedBox>

        <RoundedBox
          title="사장님 알림"
          modifyText="수정"
          modifyLink="/admin/promotionmanage"
        >
          <div className="pt-[43px] px-5 pb-[43px]">
            {getStoreNotiData
              ? getStoreNotiData
              : "스토어를 소개하는 문구를 등록해주세요."}
          </div>
        </RoundedBox>

        <RoundedBox
          title="많이 팔린 판매 메뉴"
          modifyText="메뉴관리"
          modifyLink="/admin/menumanage"
        >
          <ul className="py-[43px] mx-auto flex justify-start">
            {popularMenuData &&
            Array.isArray(popularMenuData) &&
            popularMenuData.length > 0 ? (
              popularMenuData.map((menu, index) => (
                <li
                  key={menu.menuId + "Popular"}
                  className="lg:px-5 mr-3 lg:mr-0 w-1/3 font-bold text-center text-[#666]"
                >
                  <div className="relative mx-auto w-[100px] h-[100px] lg:w-[207px] lg:h-[207px]">
                    <p
                      className={`absolute left-[-10px] text-white  
                        ${
                          index === 0
                            ? "top-[-15px] w-[50px] h-[50px] lg:w-[80px] lg:h-[80px] bg-main rounded-xl lg:rounded-2xl text-[40px] lg:text-[60px] leading-[45px] lg:leading-[75px]"
                            : "top-[-15px] lg:top-[-10px] w-[50px] h-[50px] lg:w-[62px] lg:h-[62px] bg-sub rounded-xl lg:rounded-2xl text-[40px] lg:text-[50px] leading-[45px] lg:leading-[57px]"
                        }`}
                    >
                      {index + 1}
                    </p>
                    <FallbackImg
                      src={menu.imagePath}
                      alt="메뉴 이미지"
                      fallback="defaultMenu.jpg"
                      className="w-full h-full rounded-lg shadow-[0_5px_8px_rgba(0,0,0,0.3)] lg:shadow-[0_10px_20px_rgba(0,0,0,0.3)] overflow-hidden"
                    />
                  </div>
                  <p className="mt-3 text-[12px] lg:text-[14px]">
                    {menu.menuName}
                  </p>
                  <p className="text-[16px] lg:text-[18px] leading-[60px]">
                    {menu.totalOrdered + "건"}
                  </p>
                </li>
              ))
            ) : (
              <li className="px-5">주문 정보가 존재하지 않습니다.</li>
            )}
          </ul>
        </RoundedBox>
      </AdminMain>
    </>
  );
}

export default AdminHome;
