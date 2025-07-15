import { FC } from "react";
import { CardDraggable } from "..";

type MenuInputCardProps = {
  menuGroupId: string;
  menuGroupName: string;
  menuCount: number;
  selectedMenuGroupId: string | undefined;
  index: number;
  selectableList?: [];
  openInFull: (menuGroupId: string) => void;
};

export const MenuGroupCard: FC<MenuInputCardProps> = ({
  menuGroupId,
  menuGroupName,
  menuCount,
  selectedMenuGroupId,
  index,
  selectableList,
  openInFull,
}) => {
  return (
    <CardDraggable draggableId={menuGroupId} index={index}>
      <div
        onClick={() => openInFull(menuGroupId)}
        className={`relative overflow-hidden ml-2 mr-2 p-5 border w-[100px] lg:w-[200px] h-[130px] rounded-xl bg-white 
          font-bold shadow-[0_0px_15px_rgba(0,0,0,0.1)] transition-all hover:scale-105 duration-100
          active:rotate-6`}
      >
        <p className="text-[14px] lg:text-[20px] text-main">{menuGroupName}</p>
        <p className="mt-[10px] text-[14px]">등록메뉴 {menuCount}개</p>

        <div
          className={`absolute top-0 left-0 cursor-pointer duration-300 ${
            selectedMenuGroupId === menuGroupId
              ? "w-full h-full bg-main opacity-50"
              : "w-0 h-0"
          }
                          `}
        ></div>
      </div>
    </CardDraggable>
  );
};

export default MenuGroupCard;
