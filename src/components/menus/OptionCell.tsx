import { FC, useState } from "react";
import { OptionInsertCell } from "./OptionInsertCell";
import { CardDraggable } from "../CardDraggable";
import { OptionApi } from "../../service";
import { useAdminContext } from "../../context";
import { ArrowsVertical } from "phosphor-react";
import type { Option, OptionGroup } from "../../type";

interface OptoinsCellProps {
  selectedOption: Option;
  setSelectedOption: (option: Option | undefined) => void;
  selectedGroup: OptionGroup | undefined;
  setSelectedGroup: (menuGroup: OptionGroup) => void;
}

export const OptoinsCell: FC<OptoinsCellProps> = ({
  selectedOption,
  setSelectedOption,
  selectedGroup,
  setSelectedGroup,
}) => {
  const { loginState } = useAdminContext();
  const { useDeleteOption } = OptionApi();
  const { deleteOptionMutate } = useDeleteOption();

  const [modifyActive, setModifyActive] = useState<boolean>(false);
  const [slideNotice, setSlideNotice] = useState<boolean>(false);

  const visibleSlideNotice = () => {
    setSlideNotice(true);
  };

  const hiddenSlideNotice = () => {
    setSlideNotice(false);
  };

  const optionDelete = (optionId: string) => {
    const delConfirm = window.confirm(
      "선택한 옵션이 삭제됩니다. 삭제하시겠습니까?"
    );

    if (delConfirm && optionId !== undefined) {
      deleteOptionMutate({ optionId, storeId: loginState.storeId });
    }
  };

  return (
    <>
      <OptionInsertCell
        visibleActive={modifyActive}
        setVisibleActive={setModifyActive}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        usuallyOption={selectedOption}
        setUsuallyOption={setSelectedOption}
      />
      <div className={`${!modifyActive ? "block" : "hidden"}`}>
        <CardDraggable
          draggableId={selectedOption.optionId}
          index={selectedOption.order}
          onMouseOver={visibleSlideNotice}
          onMouseLeave={hiddenSlideNotice}
        >
          <div className="flex flex-col py-3 lg:flex-row relative w-full lg:h-[65px] border-b-2 bg-[#f2f2f2] leading-9 lg:leading-[65px] hover:bg-[#ccc] active:bg-[#ccc] active:scale-x-[95%] duration-150">
            {slideNotice && (
              <div className="flex items-center justify-center absolute top-0 left-0 p-[15px] w-full h-full z-[100]">
                <ArrowsVertical
                  color={"#fff"}
                  size={40}
                  className="animate-bounce"
                />
                <span className="font-bold text-white">드래그로 순서 변경</span>
              </div>
            )}
            <div className="lg:pr-10 flex justify-between items-center flex-grow text-[16px] w-full lg:w-[80%] lg:ml-3 font-bold">
              <p>{selectedOption.optionName}</p>
              <p>+{new Intl.NumberFormat().format(selectedOption.price)}원</p>
            </div>
            <div className="flex items-center justify-end lg:w-[20%] z-[101] text-left lg:text-center">
              <span className="lg:flex-1 h-10 lg:h-auto leading-10 lg:leading-none text-sub lg:pl-3 pr-3 text-[14px] font-bold">
                <button
                  onClick={() => setModifyActive(true)}
                  className="h-full"
                >
                  항목수정
                </button>
              </span>
              <span className="lg:flex-1 h-10 lg:h-auto leading-10 lg:leading-none text-main lg:pl-3 lg:pr-3 text-[14px] font-bold">
                <button
                  onClick={() => optionDelete(selectedOption.optionId)}
                  className="h-full"
                >
                  항목삭제
                </button>
              </span>
            </div>
          </div>
        </CardDraggable>
      </div>
    </>
  );
};
