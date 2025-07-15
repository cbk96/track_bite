import { FC } from "react";
import * as CT from "../../constants";
import { FallbackImg } from "../FallbackImg";
import type { Purchase, Cart } from "../../type";
import * as U from "../../utils";

interface MenuListDisplayProps {
  menuList: Purchase[] | Cart[];
}

export const MenuListDisplay: FC<MenuListDisplayProps> = ({ menuList }) => {
  return (
    <ul>
      {menuList.map((item, index) => {
        return (
          <li
            key={index + item.menu.menuId}
            className={`flex items-center justify-between pt-5 pb-5 ${
              menuList.length - 1 !== index ? "border-b-2" : ""
            }`}
          >
            <div>
              <p className="flex py-5">
                <span className="text-[14px] lg:text-[16px] font-bold">
                  {item.menu.menuName}
                </span>
                <span className="inline-block ml-2  w-[50px] h-[24px] rounded-sm">
                  {item.quanti + "개"}
                </span>
              </p>
              <p className="py-3 ">
                <span className="mr-2">가격 : </span>
                <span>{U.accounting(item.menu.price * item.quanti)}원</span>
              </p>
              <div>
                {item.option.length > 0 &&
                  item.option.map((optionGroup, index) => {
                    return (
                      optionGroup.options.length > 0 && (
                        <div key={index}>
                          {optionGroup.options.length > 0 &&
                            optionGroup.options.map((option, index) => {
                              return (
                                <div key={index} className="flex pt-2">
                                  <span className="mr-2">
                                    {optionGroup.groupName + " : "}
                                  </span>
                                  <span className="pr-5">
                                    {option.optionName}
                                  </span>
                                  <span>
                                    {"(" +
                                      U.accounting(option.price * item.quanti) +
                                      "원)"}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      )
                    );
                  })}
              </div>
              <p className="text-[18px] font-bold leading-[65px]">
                {U.accounting(item.sumPrice * item.quanti)}원
              </p>
            </div>
            <div>
              <p className="block w-[50px] h-[50px] lg:w-[120px] lg:h-[120px] bg-white border-2 text-[#ddd] text-center leading-[120px] rounded-lg overflow-hidden">
                <FallbackImg
                  src={item.menu.imagePath}
                  fallback="defaultMenu.jpg"
                  alt="메뉴 이미지"
                  className="object-cover h-[50px] lg:h-[120px] overflow-hidden rounded-xl"
                />
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
