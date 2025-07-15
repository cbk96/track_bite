import { FC, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaretLeft, CaretRight } from "phosphor-react";
import { MenuApi } from "../service";
import { CartListLayout, FallbackImg, RoundedPublicBox } from "../components";
import * as CT from "../constants";
import { useCustomerPublic } from "../context";
import { ReactComponent as NoMenus } from "../svg/noMenus.svg";
import type {
  MenuPublicInfo,
  MenuGroupPublicInfo,
  StorePublicInfo,
} from "../type";
import type { PopupStatus } from "../components";

interface MenuIntroduceProps {
  setSelectMenu: (menu: MenuPublicInfo) => void;
  setSelectGroup: (menuGroup: MenuGroupPublicInfo) => void;
  setPopupActive: (popupStatus: PopupStatus) => void;
  popupId: string;
  selectGroup: MenuGroupPublicInfo | undefined;
  storeInfo: StorePublicInfo;
}

export const MenuIntroduce: FC<MenuIntroduceProps> = ({
  setSelectMenu,
  setSelectGroup,
  setPopupActive,
  popupId,
  selectGroup,
  storeInfo,
}) => {
  const navigate = useNavigate();
  const groupTabRef = useRef<HTMLDivElement>(null);

  const { setAlertState: setCUSAlertState } = useCustomerPublic();
  const { useGetMenuGroupPublicInfo, useGetMenuPublicInfo } = MenuApi();
  const { menuGroupPublicData, refetchMenuGP } = useGetMenuGroupPublicInfo(
    storeInfo.storePublicId
  );
  const { menuPublicData, refetchMenuP } = useGetMenuPublicInfo(
    storeInfo.storePublicId
  );

  const [menuGroups, setMenuGroups] = useState<MenuGroupPublicInfo[]>([]);
  const [menus, setMenus] = useState<MenuPublicInfo[]>([]);

  const groupTabScroll = (moveRange: number) => {
    const groupTab = groupTabRef.current;
    if (groupTab) {
      groupTab.scrollLeft += moveRange;
    }
  };

  const addCartActive = (menu: MenuPublicInfo) => {
    setSelectMenu(menu);
    setPopupActive({ active: true, popupId });
  };

  useEffect(() => {
    if (menuGroupPublicData && Array.isArray(menuGroupPublicData)) {
      setMenuGroups(menuGroupPublicData);
    }
  }, [menuGroupPublicData]);

  useEffect(() => {
    if (menuPublicData && Array.isArray(menuPublicData)) {
      setMenus(menuPublicData);
    }
  }, [menuPublicData]);

  return (
    <RoundedPublicBox className="flex justify-between pt-10 pb-10 min-h-[200px] lg:min-h-[400px] bg-white">
      <div className="lg:w-[690px] w-full mx-5 lg:mx-0 lg:pl-[50px]">
        <div className="flex items-center">
          {menuGroups.length > 0 && (
            <>
              <CaretLeft
                className="cursor-pointer"
                weight="bold"
                size={25}
                onClick={() => groupTabScroll(-100)}
              />
              <div className="relative pl-3 pr-3 w-[calc(100%-50px)] h-[37px] overflow-hidden">
                <div
                  ref={groupTabRef}
                  className="w-full h-full overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide"
                >
                  {menuGroups
                    .filter((menuGroup) => menuGroup.menuCount > 0)
                    .map((menuGroup) => {
                      return (
                        <span
                          key={menuGroup.menuGroupId}
                          className={`inline-block pl-4 pr-4 mr-4 text-center leading-[37px] rounded-full font-bold cursor-pointer ${
                            selectGroup?.menuGroupId === menuGroup.menuGroupId
                              ? "bg-[#020410] text-white"
                              : "text-[#020410]"
                          }`}
                          onClick={() => setSelectGroup(menuGroup)}
                        >
                          {menuGroup.menuGroupName}
                        </span>
                      );
                    })}
                </div>
              </div>
              <CaretRight
                className="cursor-pointer"
                weight="bold"
                size={25}
                onClick={() => groupTabScroll(100)}
              />
            </>
          )}
        </div>
        <div>
          {menus.length > 0 ? (
            <>
              <p className="text-[22px] pt-8 pb-5 font-bold border-b-2">
                {selectGroup?.menuGroupName}
              </p>
              {menus
                .filter((menu) => menu.menuGroupId === selectGroup?.menuGroupId)
                .map((menu) => {
                  return (
                    <button
                      key={menu.menuId}
                      className={`flex py-5 justify-between w-full min-h-[150px] items-center border-b cursor-pointer  hover:bg-[#ccc] active:bg-[#ccc] active:scale-x-[98%] duration-200
                        ${menu.saleStatus === "soldout" && "opacity-50"}`}
                      onClick={() => addCartActive(menu)}
                      disabled={menu.saleStatus === "soldout"}
                    >
                      <div className="flex-grow text-left">
                        <p className="font-bold text-[18px]">{menu.menuName}</p>
                        <p className="max-w-[200px] lg:max-w-[480px] text-[12px] lg:text-[14px] mb-5">
                          {menu.menuDescrip}
                        </p>
                        <p className=" text-[18px]">
                          {new Intl.NumberFormat().format(menu.price)}원
                        </p>
                      </div>
                      <div className="relative lg:mr-6 lg:w-[110px] w-[80px] h-[80px] lg:h-[110px] overflow-hidden rounded-lg shadow-[0px_2px_7px_rgba(0,0,0,0.2)]">
                        {menu.saleStatus === "soldout" && (
                          <p className="absolute w-full h-full text-[20px] text-white leading-[80px] lg:leading-[110px] bg-[rgba(0,0,0,0.8)]">
                            품절
                          </p>
                        )}
                        <FallbackImg
                          src={menu.imagePath}
                          alt="메뉴 이미지"
                          fallback="defaultMenu.jpg"
                          className="object-cover h-[80px] lg:h-[110px] overflow-hidden rounded-xl"
                        />
                      </div>
                    </button>
                  );
                })}
            </>
          ) : (
            <div className="relative text-center py-[100px] font-bold">
              <NoMenus className="mx-auto w-[70%] max-w-[300px]" />
              <span className="text-[#aaa]">등록된 메뉴가 없습니다.</span>
            </div>
          )}
        </div>
      </div>
      <div className="hidden lg:block ml-[10px] w-[310px]">
        <CartListLayout storeInfo={storeInfo} />
      </div>
    </RoundedPublicBox>
  );
};

export default MenuIntroduce;
