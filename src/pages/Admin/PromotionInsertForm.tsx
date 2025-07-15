import { useState, useCallback, useEffect } from "react";
import { useAdminContext } from "../../context";
import { FC } from "react";
import ImageUploadBox from "../../components/ImageUploadBox";
import { useForm } from "react-hook-form";
import { PromotionApi } from "../../service";
import * as U from "../../utils";
import type { EventInfo } from "../../type";

type EditMode = {
  type: "add" | "modify" | "view";
  editId: string;
};

interface props {
  insertType: "add" | "modify";
  setEditMode: React.Dispatch<React.SetStateAction<EditMode>>;
  eventInfo: EventInfo;
  storeId: string;
}

export const PromotionInsertForm: FC<props> = ({
  insertType = "add",
  setEditMode,
  eventInfo,
  storeId,
}) => {
  const initialEditMode: EditMode = {
    type: "view",
    editId: "",
  };

  const { setAlertState } = useAdminContext();

  const { useAddEvent, useUpdateEvent, useDeleteEvent } = PromotionApi();
  const { addEventMutate } = useAddEvent();
  const { updateEventMutate } = useUpdateEvent();
  const { deleteEventMutate } = useDeleteEvent();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      ...eventInfo,
    },
  });

  const [uploadBigImage, setUploadBigImage] = useState<File | null>(null);
  const [uploadSlideImage, setUploadSlideImage] = useState<File | null>(null);

  const setEventInfo = (event: EventInfo) => {
    Object.entries(event).forEach(([key, value]) => {
      setValue(key as any, value);
    });
  };

  const setUploadPath =
    (key: "bigBannerPath" | "slideBannerPath") => (value: string) => {
      setValue(key, value);
    };

  const insertEventConfirm = useCallback(
    (data: EventInfo) => {
      if (
        Object.values(data).some((value) => value === "" || value === undefined)
      ) {
        setAlertState("입력되지 않은 값이 있습니다.");

        return;
      }
      insertType === "modify"
        ? updateEventMutate({ eventInfo: data })
        : addEventMutate({ eventInfo: data });
      setEditMode(initialEditMode);
      reset();
    },
    [register]
  );

  const insertCancel = () => {
    setEditMode(initialEditMode);
    reset();
  };

  const deleteEventInfo = useCallback(
    (eventId: string) => {
      deleteEventMutate({ storeId: storeId, eventId });
      setEditMode(initialEditMode);
    },
    [storeId]
  );

  useEffect(() => {
    setEventInfo(eventInfo);
  }, [insertType]);

  return (
    <form onSubmit={handleSubmit(insertEventConfirm)}>
      <div className="pt-[30px] border-b-2">
        <div className="flex justify-between mb-[50px] ">
          <p className="flex flex-col flex-grow ">
            <span className="mb-3">
              <span className="mr-3 text-[16px] text-[#666666] font-bold">
                이벤트명
              </span>
              <span className="text-red-500 ">{errors.eventName?.message}</span>
            </span>
            <span>
              <input
                type="text"
                {...register("eventName", {
                  required: "이벤트명은 필수입니다.",
                  minLength: {
                    value: 5,
                    message: "최소 5글자 이상 입력해야 합니다.",
                  },
                  maxLength: {
                    value: 20,
                    message: "20글자까지 입력 가능합니다.",
                  },
                })}
                className={`w-[80%] p-2 border-2 rounded-md ${
                  errors.eventName ? "placeholder-red-500" : ""
                }`}
              />
            </span>
          </p>

          <p className="flex pt-[30px] font-bold">
            {insertType === "modify" && deleteEventInfo && (
              <button
                type="button"
                onClick={() => deleteEventInfo(watch("eventId"))}
                className="px-3 py-2 mr-2 bg-white border-2 rounded-md hover:bg-slate-400"
              >
                삭제
              </button>
            )}

            <button
              type="button"
              onClick={insertCancel}
              className="px-3 py-2 mr-2 text-white rounded-md bg-sub hover:bg-sub-hover"
            >
              취소
            </button>

            <button className="px-3 py-2 text-white rounded-md bg-main hover:bg-main-hover">
              {insertType === "modify" ? "수정" : "등록"}
            </button>
          </p>
        </div>
        <p className="flex flex-col mb-[50px] font-bold">
          <span className="mb-3 mr-3 text-[16px] text-[#666666] ">등록일</span>
          <span>{U.showDate(watch("date"))}</span>
        </p>
        <div>
          <span className="inline-block mb-3 font-bold">
            <span className="mr-3 text-[16px] text-[#666666]">메인배너</span>
            <span className="text-[12px] text-main">
              *가게정보 페이지에 노출됩니다.
            </span>
          </span>
          <div>
            <ImageUploadBox<EventInfo>
              uploadType="promotion"
              uploadImageState={uploadBigImage}
              setUploadImageState={setUploadBigImage}
              usuallyImage={watch("bigBannerPath")}
              attribName="bigBannerPath"
              setUploadPath={setUploadPath("bigBannerPath")}
              imageBoxType="auto"
            />
          </div>
        </div>
        <div className="mt-10">
          <span className="inline-block mb-3 font-bold">
            <span className="mr-3 text-[16px] text-[#666666]">
              슬라이드배너
            </span>
            <span className="text-[12px] text-main">
              *가게 메인 페이지에 노출됩니다.
            </span>
          </span>
          <div>
            <ImageUploadBox<EventInfo>
              uploadType="promotion"
              uploadImageState={uploadSlideImage}
              setUploadImageState={setUploadSlideImage}
              usuallyImage={watch("slideBannerPath")}
              attribName="slideBannerPath"
              setUploadPath={setUploadPath("slideBannerPath")}
              imageBoxType="auto"
            />
          </div>
        </div>
        <p className="flex flex-col leading-[30px] pt-[30px] pb-[30px] text-[16px] text-[#666]">
          <span className="mb-3">
            <span className=" mr-3 font-bold text-[16px] text-[#666666]">
              이벤트 상세
            </span>
            <span className="text-red-500 ">{errors.eventDetail?.message}</span>
          </span>
          <textarea
            {...register("eventDetail", {
              required: "이벤트 설명은 필수입니다.",
              minLength: {
                value: 10,
                message: "최소 10자 이상 입력해야 합니다.",
              },
              maxLength: {
                value: 800,
                message: "800글자 이상은 입력할 수 없습니다.",
              },
            })}
            className={`w-full h-[300px] p-2 mt-4 border-2 rounded-md resize-none ${
              errors.eventDetail ? "placeholder-red-500" : ""
            }`}
          />
        </p>
      </div>
    </form>
  );
};
