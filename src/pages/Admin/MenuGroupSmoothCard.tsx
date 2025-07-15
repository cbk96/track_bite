import { FC } from "react";

export type MenuSmoothCardProps = {
  menuGroupId: string;
  menuGroupName: string;
  menuGroupQuanti: number;
  selectedMenuGroup: number;
  index: number;
  openInFull: (index: number) => void;
};

export const MenuGroupSmoothCard: FC<MenuSmoothCardProps> = ({
  menuGroupId,
  menuGroupName,
  menuGroupQuanti,
  selectedMenuGroup,
  index,
  openInFull,
}) => {
  return (
    <div
      className={`relative overflow-hidden top-0 m-3 p-5 w-[276px] h-[178px] rounded-xl bg-white font-bold shadow-[0_0px_15px_rgba(0,0,0,0.1)] transition-all 
                          ${selectedMenuGroup === index ? "" : ""}`}
    >
      <p className="text-[20px]">{menuGroupName}</p>
      <p className="mt-[10px] text-[14px]">등록메뉴 {menuGroupQuanti}개</p>
      <p>
        <button
          className="mt-[10px] flex text-[14px] text-[#ce1224]"
          type="button"
        >
          카테고리 수정
        </button>
      </p>
      <p>
        <button
          className="w-full mt-[20px] text-[25px] text-[#666666] text-right material-icons"
          onClick={() => openInFull(index)}
        >
          open_in_full
        </button>
      </p>
      <div
        className={`absolute top-0 left-0 cursor-pointer duration-300 ${
          selectedMenuGroup === index
            ? "w-full h-full bg-[#ce1224] opacity-50"
            : "w-0 h-0"
        }
                          `}
        onClick={() => openInFull(-1)}
      ></div>
    </div>
  );
};

export default MenuGroupSmoothCard;
