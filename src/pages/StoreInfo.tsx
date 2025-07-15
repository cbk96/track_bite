import { FC, useEffect, useState } from "react";
import { StoreApi } from "../service";
import { RoundedPublicBox, FallbackImg } from "../components";
import type { StorePublicInfo, EventInfo, OperatingHours } from "../type";
import * as CT from "../constants";
import * as T from "../type";
import * as U from "../utils";

interface StoreInfoProps {
  storeInfo: StorePublicInfo;
  eventInfos: EventInfo[];
}

export const StoreInfo: FC<StoreInfoProps> = ({ storeInfo, eventInfos }) => {
  const [operatingHours, seteOperatingHours] = useState<T.OperatingHours[]>(
    T.initialOperatingHours
  );
  const [paymentKorMethod, setPaymentKorMethod] = useState<string[]>([]);

  const { useGetOperatingHours } = StoreApi();

  useGetOperatingHours(storeInfo.storePublicId ?? "", seteOperatingHours);

  useEffect(() => {
    if (storeInfo !== null) {
      const paymentMethodKor = storeInfo.paymentMethod.map(
        (payment) => CT.paymentMethod[payment as CT.PaymentMethod]
      );

      setPaymentKorMethod(paymentMethodKor);
    }
  }, [storeInfo]);

  return (
    <div>
      {storeInfo && storeInfo.notification && (
        <RoundedPublicBox
          title="사장님 알림"
          phosphor="Bell"
          className="mb-6 pb-5 bg-white min-h-[200px] "
        >
          <p className="ml-[40px] mr-[40px] pt-5 text-[16px] text-[#666]">
            {storeInfo.notification}
          </p>
        </RoundedPublicBox>
      )}
      {eventInfos && eventInfos.length > 0 && (
        <RoundedPublicBox
          phosphor="Megaphone"
          title="진행중인 이벤트"
          className="pb-10 mb-6 bg-white "
        >
          {eventInfos.map((eventInfo) => (
            <div key={eventInfo.eventId} className="ml-[40px] mr-[40px] ">
              <div
                key={eventInfo.eventId}
                id={"to" + eventInfo.eventId}
                className="border-b-2"
              >
                <p className="pt-[30px] pb-[30px] text-[16px] font-bold">
                  {eventInfo.eventName}
                </p>
                <p>
                  <FallbackImg
                    src={eventInfo.bigBannerPath}
                    fallback="defaultEvent.jpg"
                    alt="이벤트 메인 배너"
                    className="max-w-[70%]"
                  />
                </p>
                <p className="leading-[30px] pt-[30px] pb-[30px] text-[16px] text-[#666]">
                  {eventInfo.eventDetail}
                </p>
              </div>
            </div>
          ))}
        </RoundedPublicBox>
      )}

      <RoundedPublicBox
        title="업체정보"
        phosphor="House"
        className="pb-10 mb-6 bg-white "
      >
        <div className="ml-[40px] mr-[40px] pt-3  text-[#666] leading-[50px]">
          <div className="flex items-start">
            <legend className="inline-block pr-3 w-[40%]">영업시간</legend>
            <ul className="inline-block mb-3 w-[60%] text-[#666666]">
              {operatingHours &&
                operatingHours.map((day) => {
                  return (
                    <li key={day.day} className="flex">
                      <span className="inline-block w-[50px] mr-3 font-normal ">
                        {CT.weekName[day.day]}
                      </span>
                      {day.open === "" && day.close === "" ? (
                        <span>휴무일</span>
                      ) : (
                        <>
                          <span> {day.open}</span>
                          <span className="w-[30px] inline-block text-center">
                            ~
                          </span>
                          <span> {day.close}</span>
                        </>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
          <p className="flex">
            <legend className="inline-block pr-3 w-[40%]">전화번호</legend>
            <span className="w-[60%]">{storeInfo.tel}</span>
          </p>
          <p className="flex">
            <legend className="inline-block pr-3 w-[40%]">주소</legend>
            <span className="w-[60%]">
              <span className="mr-1">
                {"(" +
                  storeInfo.address.zonecode +
                  ") " +
                  storeInfo.address.address}
              </span>
              <span className="mr-1">{storeInfo.address.detailedAddress}</span>
            </span>
          </p>
        </div>
      </RoundedPublicBox>

      <RoundedPublicBox
        title="사업자정보"
        phosphor="IdentificationCard"
        className="pb-10 mb-6 bg-white "
      >
        <div className="ml-[40px] mr-[40px] pt-3 text-[#666] leading-[50px]">
          <p className="flex">
            <legend className="inline-block pr-3 w-[40%]">상호명</legend>
            <span className="w-[60%]">{storeInfo.storeName}</span>
          </p>
          <p className="flex">
            <legend className="inline-block pr-3 w-[40%]">
              사업자등록번호
            </legend>
            <span className="w-[60%]">{storeInfo.businessNumber}</span>
          </p>
          <p className="flex">
            <legend className="inline-block pr-3 w-[40%]">업종</legend>
            <span className="w-[60%]">{storeInfo.businessType}</span>
          </p>
        </div>
      </RoundedPublicBox>

      <RoundedPublicBox
        title="결제정보"
        phosphor="CreditCard"
        className="pb-10 mb-6 bg-white "
      >
        <div className="ml-[40px] mr-[40px] pt-3 text-[#666] leading-[50px]">
          <p className="flex">
            <legend className="inline-block pr-3 w-[40%]">최소주문금액</legend>
            <span className="w-[60%]">
              {(storeInfo.minOrderAmount
                ? U.accounting(storeInfo.minOrderAmount)
                : 0) + "원"}
            </span>
          </p>
          <p className="flex">
            <legend className="inline-block pr-3 w-[40%]">결제수단</legend>
            <span className="w-[60%]">
              {paymentKorMethod.length > 0
                ? paymentKorMethod.map((payment, index) => (
                    <span key={payment}>
                      <span>{payment}</span>
                      {paymentKorMethod.length - 1 > index && (
                        <span className="mr-3">,</span>
                      )}
                    </span>
                  ))
                : null}
            </span>
          </p>
        </div>
      </RoundedPublicBox>
    </div>
  );
};
