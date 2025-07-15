import { FC } from "react";
import { FallbackImg } from "../../components";
import * as CT from "../../constants";
import * as U from "../../utils";
import type { EventInfo } from "../../type";

interface props {
  eventInfo: EventInfo;
  insertActive: (type: "add" | "modify", eidtId: string) => void;
}

export const PromotionView: FC<props> = ({ eventInfo, insertActive }) => {
  return (
    <div key={eventInfo.eventId} className="pt-[30px] border-b-2">
      <div className="flex justify-between">
        <p className="flex flex-grow flex-col mb-[50px] ">
          <span className="mb-3 mr-3 text-[16px] text-[#666666] font-bold">
            이벤트명
          </span>
          <span className="mr-10 text-[16px] font-bold">
            {eventInfo.eventName}
          </span>
        </p>

        <p className="pt-[30px] font-bold">
          <button
            type="button"
            onClick={() => insertActive("modify", eventInfo.eventId)}
            className="text-main"
          >
            수정 &gt;
          </button>
        </p>
      </div>
      <p className="flex flex-col mb-[50px] font-bold">
        <span className="mb-3 mr-3 text-[16px] text-[#666666] ">등록일</span>
        <span>{U.showDate(eventInfo.date)}</span>
      </p>
      <div>
        <span className="inline-block mb-3 font-bold">
          <span className="mr-3 text-[16px] text-[#666666]">메인배너</span>
          <span className="text-[12px] text-main">
            *가게정보 페이지에 노출됩니다.
          </span>
        </span>
        <FallbackImg
          src={eventInfo.bigBannerPath}
          fallback="defaultEvent.jpg"
          alt="이벤트 메인 배너"
          className="max-w-[70%] border rounded-xl"
        />
      </div>
      <div className="mt-10">
        <span className="inline-block mb-3 font-bold">
          <span className="mr-3 text-[16px] text-[#666666]">슬라이드배너</span>
          <span className="text-[12px] text-main">
            *가게 메인 페이지에 노출됩니다.
          </span>
        </span>
        <FallbackImg
          src={eventInfo.slideBannerPath}
          fallback="defaultEvent.jpg"
          alt="이벤트 슬라이드 배너"
          className="max-w-[70%] border rounded-xl"
        />
      </div>
      <p className="flex flex-col leading-[30px] pt-[30px] pb-[30px] text-[16px] text-[#666]">
        <span className="mb-3 mr-3 font-bold text-[16px] text-[#666666]">
          이벤트 상세
        </span>
        {eventInfo.eventDetail}
      </p>
    </div>
  );
};
