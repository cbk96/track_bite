import { FC, useEffect, useState, useCallback, ChangeEvent } from "react";
import { PropsWithChildren } from "react";

export type MenuAddBlockProps = {
  setCategoryName: (cateName: string) => void;
  setCategoryState: () => void;
  cancelFunction?: () => void;
};

export const MenuAddBlock: FC<PropsWithChildren<MenuAddBlockProps>> = ({
  setCategoryName,
  setCategoryState,
  cancelFunction,
}) => {
  const changeForm = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setCategoryName(e.target.value);
    },
    [setCategoryName]
  );

  return (
    <div className="m-3 p-5 w-[276px] h-[178px] rounded-xl bg-white shadow-[0_0px_15px_rgba(0,0,0,0.1)]">
      <input
        className="w-full p-1 m-1 border-2 rounded-md outline-none"
        type="text"
        name="cateName"
        maxLength={7}
        onChange={changeForm}
        placeholder="카테고리명"
      />
      <p className="flex justify-end p-1 mt-3">
        <button
          className="inline-block p-2 m-1 bg-[#ce1224] text-white rounded-md"
          type="button"
          onClick={setCategoryState}
        >
          등록
        </button>
        <button
          className="inline-block p-2 m-1 bg-[#ba8618] text-white rounded-md"
          type="button"
          onClick={cancelFunction ? () => cancelFunction() : undefined}
        >
          취소
        </button>
      </p>
    </div>
  );
};
