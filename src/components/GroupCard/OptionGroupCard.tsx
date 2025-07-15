import { FC } from "react";
import { CardDraggable } from "..";

type MenuInputCardProps = {
  optionGroupId: string;
  optionGroupName: string;
  optionCount: number;
  selectedOptionGroupId: string | undefined;
  index: number;
  openInFull: (optionGroupId: string) => void;
};

export const OptionGroupCard: FC<MenuInputCardProps> = ({
  optionGroupId,
  optionGroupName,
  optionCount,
  selectedOptionGroupId,
  index,
  openInFull,
}) => {
  return (
    <CardDraggable draggableId={optionGroupId} index={index}>
      <div
        onClick={() => openInFull(optionGroupId)}
        className={`relative overflow-hidden ml-2 mr-2 p-5 border w-[100px] lg:w-[200px] h-[130px] rounded-xl bg-white 
          font-bold shadow-[0_0px_15px_rgba(0,0,0,0.1)] transition-all hover:scale-105 duration-200
          active:rotate-6`}
      >
        <p className="text-[14px] lg:text-[20px] text-sub">{optionGroupName}</p>
        <p className="mt-[10px] text-[14px]">등록항목 {optionCount}개</p>

        <div
          className={`absolute top-0 left-0 cursor-pointer duration-300 ${
            selectedOptionGroupId === optionGroupId
              ? "w-full h-full bg-sub opacity-50"
              : "w-0 h-0"
          }
                          `}
        ></div>
      </div>
    </CardDraggable>
  );
};

export default OptionGroupCard;
