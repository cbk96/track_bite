import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import type { Store } from "../../type";
import * as T from "../../type";
import * as CT from "../../constants";
import { useAdminContext } from "../../context";
import { ChangeEvent, useEffect, useState } from "react";
import { StoreApi } from "../../service";
import { FetchButton } from "../../components";
import { AdminMain } from "./AdminMain";
import { RoundedBox } from "../../components";
import { TabMenuBar } from "../../components";

export const EditOperatingHours = () => {
  const tabNames = ["스토어 정보 수정", "영업시간 수정"];
  const tabLinks = ["/admin/editAdmin", "/admin/editOpHours"];
  const currentTab = "영업시간 수정";

  const { loginState, setAlertState } = useAdminContext();

  const [operatingHours, setOperatingHours] = useState<T.OperatingHours[]>({
    ...T.initialOperatingHours,
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<{ operatingHours: T.OperatingHours[] }>({
    defaultValues: { operatingHours: [...T.initialOperatingHours] },
    mode: "onChange",
  });

  const { useGetOperatingHours, useUpdateOperatingHours } = StoreApi();

  const setOPdata = (data: T.OperatingHours[]) => {
    data.map((day) => {
      setValue(`operatingHours.${day.order}`, day);
    });
  };

  useGetOperatingHours(loginState.storePublicId ?? "", setOPdata);

  const { mutateUpdateOPHours, isUpdateOPHoursPending } =
    useUpdateOperatingHours();

  const insertClosedDay =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const checked: boolean = e.target.checked;
      if (checked) {
        setValue(`operatingHours.${index}.open`, "");
        setValue(`operatingHours.${index}.close`, "");
      }
    };

  const editOPHours = useCallback(
    (data: { operatingHours: T.OperatingHours[] }) => {
      console.log(data.operatingHours);
      mutateUpdateOPHours({
        operatingHours: data.operatingHours,
        storeId: loginState.storeId,
      });
    },
    [operatingHours, loginState]
  );

  return (
    <>
      <AdminMain>
        <TabMenuBar
          tabNames={tabNames}
          tabLinks={tabLinks}
          currentTab={currentTab}
        />
        <section className="items-center justify-center min-h-screen bg-[#f2f2f2]">
          <form
            onSubmit={handleSubmit(editOPHours)}
            className="w-full text-center "
          >
            <RoundedBox
              title="영업시간 관리"
              underLine={false}
              className="pb-10"
            >
              <div>
                <ul className="text-[#666666] mt-3">
                  {T.initialOperatingHours.map((day) => (
                    <li
                      key={day.day}
                      className="flex flex-col items-start mb-2 font-bold leading-10 lg:items-center lg:flex-row"
                    >
                      <legend className="inline-block mb-1 w-[130px] font-bold text-left">
                        {CT.weekName[day.day]}
                      </legend>
                      <div className="flex w-full pt-3 lg:w-auto">
                        <div className="relative mr-[20px] lg:mr-0 w-[45%] max-w-[150px]">
                          <legend className="absolute px-[5px] top-[-10px] left-[12px] h-[16px] leading-[16px] text-[11px] bg-white">
                            개장
                          </legend>
                          <input
                            type="time"
                            {...register(`operatingHours.${day.order}.open`, {
                              validate: (value) => {
                                const close = watch(
                                  `operatingHours.${day.order}.close`
                                );
                                if (!close) return true;
                                return (
                                  value < close ||
                                  "개장 시간은 종료 시간보다 빨라야 합니다."
                                );
                              },
                            })}
                            className="w-full px-3 py-2 mr-3 bg-white border-2 lg:py-0 rounded-xl"
                          />

                          <p className="text-[10px] text-red-500 leading-[14px] text-start">
                            {errors.operatingHours?.[day.order]?.open
                              ?.message ?? ""}
                          </p>
                        </div>
                        <span className="hidden lg:inline-block w-[30px] text-center ">
                          ~
                        </span>
                        <div className="relative w-[45%] max-w-[150px]">
                          <legend className="absolute px-[5px] top-[-10px] left-[12px] h-[16px] leading-[16px] text-[11px] bg-white">
                            종료
                          </legend>
                          <input
                            type="time"
                            {...register(`operatingHours.${day.order}.close`, {
                              validate: (value) => {
                                const open = watch(
                                  `operatingHours.${day.order}.open`
                                );
                                if (!open) return true;
                                return (
                                  value > open ||
                                  "종료 시간은 개장 시간보다 빨라야 합니다."
                                );
                              },
                            })}
                            className="w-full px-3 py-2 mr-3 bg-white border-2 lg:py-0 rounded-xl"
                          />
                          <p className="px-1 text-[10px] text-left w-full text-red-500 leading-[14px]">
                            {errors.operatingHours?.[day.order]?.close
                              ?.message ?? ""}
                          </p>
                        </div>
                      </div>
                      <label
                        htmlFor={day.day + "Id"}
                        className="flex mt-2 mb-5 cursor-pointer lg:mt-0 lg:mb-0 lg:ml-5 itmes-center"
                      >
                        <span className="flex items-center align-middle my-auto w-[30px] h-[30px] border-[2px] bg-white border-main rounded-full">
                          <input
                            type="checkbox"
                            id={day.day + "Id"}
                            onChange={insertClosedDay(day.order)}
                            checked={
                              watch(`operatingHours.${day.order}.open`) ===
                                "" &&
                              watch(`operatingHours.${day.order}.close`) === ""
                            }
                            className="hidden peer"
                          />
                          <span className="inline-block m-[3px] w-[20px] h-[20px] rounded-full bg-white peer-checked:bg-main"></span>
                        </span>
                        <span className="inline-block ml-2 align-middle text-[14px]">
                          휴무일
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <FetchButton
                type="submit"
                className="p-4 mt-10 font-bold text-white bg-main rounded-xl"
                isFetching={isUpdateOPHoursPending}
              >
                영업시간 수정
              </FetchButton>
            </RoundedBox>
          </form>
        </section>
      </AdminMain>
    </>
  );
};
