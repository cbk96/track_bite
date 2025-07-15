import { RoundedBox, TabMenuBar } from "../../components";
import { AdminMain } from "./AdminMain";
import { useAdminContext } from "../../context";
import { PromotionApi } from "../../service";
import { ChangeEvent, useEffect, useState } from "react";
import { Plus } from "phosphor-react";
import { LoadingSpinner, useLoading } from "../../components/loading";
import { PromotionInsertForm, PromotionView } from "./";
import type { EventInfo } from "../../type";
import * as U from "../../utils";

export const PromotionManage = () => {
  const tabNames = ["홍보관리", "쿠폰관리"];
  const tabLinks = ["/admin/promotionmanage", "/admin/couponmanage"];
  const currentTab = "홍보관리";
  const eventLimitCount = 5;

  type EditMode = {
    type: "add" | "modify" | "view";
    editId: string;
  };

  const { loginState, setAlertState } = useAdminContext();
  const {
    useGetStoreNotification,
    useUpdateNotification,
    useGetStoreEventInfo,
  } = PromotionApi();
  const { isLoading, setIsLoading } = useLoading();

  const { getStoreNotiData } = useGetStoreNotification(loginState.storeId);
  const { mutateUpdateNoti, isUpdateNotiPending } = useUpdateNotification(() =>
    setAlertState("공지사항이 수정되었습니다.")
  );

  const createEventId = U.createId("EVENT", loginState.storeId);

  const initialEvent: EventInfo = {
    storeId: loginState.storeId,
    eventId: createEventId,
    eventName: "",
    slideBannerPath: "",
    bigBannerPath: "",
    eventDetail: "",
    date: new Date(),
  };

  const initialEditMode: EditMode = {
    type: "view",
    editId: "",
  };

  const [notificModiActive, setNotificModiActive] = useState<boolean>(false);
  const [notificValue, setNotificValue] = useState<string>("");
  const [editMode, setEditMode] = useState<EditMode>(initialEditMode);

  const { getStoreEventData, isGetStoreEventeLoading } = useGetStoreEventInfo(
    loginState.storeId,
    () => setIsLoading(false)
  );

  useEffect(() => {
    if (getStoreNotiData === undefined) return;
    setNotificValue(getStoreNotiData);
  }, [getStoreNotiData]);

  const inputNotific = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNotificValue(e.target.value);
  };

  const notificModifyCancel = () => {
    setNotificModiActive(false);
    if (getStoreNotiData === undefined) return;
    setNotificValue(getStoreNotiData);
  };

  const notificModifyConfirm = () => {
    if (notificValue.trim() === "") {
      setAlertState("입력된 내용이 없습니다.");
      return;
    }
    mutateUpdateNoti({
      notification: notificValue,
      storeId: loginState.storeId,
    });

    setNotificModiActive(false);
  };

  const insertActive = (type: "add" | "modify", eidtId: string) => {
    setEditMode({
      type: type,
      editId: eidtId,
    });
  };

  return (
    <>
      <LoadingSpinner isLoading={isGetStoreEventeLoading} />
      <AdminMain>
        <TabMenuBar
          tabNames={tabNames}
          tabLinks={tabLinks}
          currentTab={currentTab}
        />
        <RoundedBox
          title="공지"
          modifyType="inline"
          modifyText="수정"
          modifySetState={setNotificModiActive}
          modifyState={notificModiActive}
        >
          {notificModiActive ? (
            <>
              <textarea
                value={notificValue}
                onChange={inputNotific}
                maxLength={800}
                className="w-full h-[300px] p-2 mt-4 border-2 rounded-md resize-none"
              />
              <p className="flex justify-end mt-3 mb-3 font-bold text-white">
                <button
                  type="button"
                  onClick={notificModifyCancel}
                  className="p-4 pt-2 pb-2 mr-2 rounded-lg bg-sub hover:bg-sub-hover"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={notificModifyConfirm}
                  className="p-4 pt-2 pb-2 rounded-lg bg-main hover:bg-main-hover"
                >
                  수정
                </button>
              </p>
            </>
          ) : (
            <p className="pt-5 text-[16px] text-[#666]">
              {notificValue
                ? notificValue
                : "스토어를 소개하는 문구를 등록해주세요."}
            </p>
          )}
        </RoundedBox>
        <RoundedBox
          title={`이벤트 등록 (${
            getStoreEventData?.length ?? 0
          }/${eventLimitCount})`}
        >
          <div className="relative">
            {getStoreEventData && Array.isArray(getStoreEventData) ? (
              getStoreEventData.map((eventInfo) =>
                !(
                  editMode.type === "modify" &&
                  editMode.editId === eventInfo.eventId
                ) ? (
                  <PromotionView
                    key={"add" + eventInfo.eventId}
                    eventInfo={eventInfo}
                    insertActive={insertActive}
                  />
                ) : (
                  <PromotionInsertForm
                    key={eventInfo.eventId + "modi"}
                    insertType="modify"
                    eventInfo={eventInfo}
                    setEditMode={setEditMode}
                    storeId={loginState.storeId}
                  />
                )
              )
            ) : (
              <div className="pt-5 text-[#666] text-[16px]">
                등록된 이벤트가 없습니다.
              </div>
            )}

            {editMode.type === "add" && (
              <PromotionInsertForm
                insertType="add"
                eventInfo={initialEvent}
                setEditMode={setEditMode}
                storeId={loginState.storeId}
              />
            )}

            <div>
              {getStoreEventData &&
              Array.isArray(getStoreEventData) &&
              getStoreEventData.length >= eventLimitCount ? (
                <span className="inline-block w-full p-5 font-bold text-center">
                  이벤트는 최대 {eventLimitCount}개까지 등록 가능합니다.
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => insertActive("add", "new")}
                  className="flex items-center justify-center w-full p-5 font-bold"
                >
                  <Plus
                    color="#000"
                    weight="bold"
                    strokeWidth={3}
                    className="mr-1"
                  />
                  <span className="inline-block">이벤트 추가하기</span>
                </button>
              )}
            </div>
          </div>
        </RoundedBox>
      </AdminMain>
    </>
  );
};

export default PromotionManage;
