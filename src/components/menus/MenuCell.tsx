import { FC, useState } from "react";
import { MenuApi } from "../../service";
import { CardDraggable } from "../CardDraggable";
import { useAdminContext } from "../../context";
import { FallbackImg } from "../FallbackImg";
import * as CT from "../../constants";
import { ArrowsVertical } from "phosphor-react";
import type { Menu } from "../../type";

type MenuCellProps = {
  menu: Menu;
  popupId: string;
  addMenuActive: (active: boolean, popupId: string, menuId?: string) => void;
};

export const MenuCell: FC<MenuCellProps> = ({
  menu,
  popupId,
  addMenuActive,
}) => {
  const { useDeleteMenu } = MenuApi();
  const { deleteMenuMutate } = useDeleteMenu();
  const { loginState } = useAdminContext();

  const [slideNotice, setSlideNotice] = useState<boolean>(false);

  const visibleSlideNotice = () => {
    setSlideNotice(true);
  };

  const hiddenSlideNotice = () => {
    setSlideNotice(false);
  };

  const menuDelete = (menuId: string) => {
    // eslint-disable-next-line no-restricted-globals
    const delConfirm = confirm("선택한 메뉴가 삭제됩니다. 삭제하시겠습니까?");

    if (!delConfirm || menuId === undefined) return;
    deleteMenuMutate({ menuId, storeId: loginState.storeId });
  };

  return (
    <>
      <CardDraggable
        draggableId={menu.menuId}
        index={menu.order}
        onMouseOver={visibleSlideNotice}
        onMouseLeave={hiddenSlideNotice}
      >
        <div
          className="flex flex-col lg:flex-row justify-between relative py-[15px] max-w-[820px] min-h-[150px] border-b-2 bg-[#f2f2f2] 
        hover:bg-[#ccc] active:bg-[#ccc] active:scale-x-[98%] duration-200 overflow-hidden"
        >
          {slideNotice && (
            <div className="flex items-center justify-center absolute top-0 left-0 p-[15px] w-full h-full z-[100]">
              <ArrowsVertical
                color={"#fff"}
                size={50}
                className="animate-bounce"
              />
              <span className="font-bold text-white">드래그로 순서 변경</span>
            </div>
          )}

          <div className="flex">
            <div>
              <p className="block w-[70px] h-[70px] lg:w-[120px] lg:h-[120px] bg-white border-2 text-[#ddd] text-center leading-[120px] rounded-lg overflow-hidden">
                <FallbackImg
                  src={menu.imagePath}
                  fallback="defaultMenu.jpg"
                  alt="메뉴 이미지"
                  className="object-cover h-[70px] lg:h-[120px] overflow-hidden rounded-xl"
                />
              </p>
            </div>
            <div className="flex-grow text-[14px] lg:text-[18px] max-w-[440px] ml-3 lg:p-[10px] flex flex-col">
              <p className="font-bold">{menu.menuName}</p>
              <p className="lg:text-[16px] max-w-[310px] flex-grow">
                {menu.menuDescrip}
              </p>
              <p className="font-bold">
                {new Intl.NumberFormat().format(menu.price)}원
              </p>
            </div>
          </div>

          <div className="flex justify-end items-center py-2 lg:pb-0 z-[101]">
            <span className="text-sub p-3 text-center text-[14px] font-bold">
              <button onClick={() => addMenuActive(true, popupId, menu.menuId)}>
                메뉴수정
              </button>
            </span>
            <span className="text-main p-3 text-center text-[14px] font-bold">
              <button onClick={() => menuDelete(menu.menuId)}>메뉴삭제</button>
            </span>
            <span className="p-3 text-center text-[14px] font-bold">
              {" "}
              {CT.saleStatus[menu.saleStatus]}
            </span>
          </div>
        </div>
      </CardDraggable>
    </>
  );
};

export default MenuCell;
