import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText, Collapse } from "@mui/material";
import * as PR from "phosphor-react";
import type { CollapseList } from "./slideType";

interface SideListProps {
  openMenu: number | null;
  setOpenMenu: React.Dispatch<React.SetStateAction<number | null>>;
  listNumber: number;
  listItemText: string;
  collapse: CollapseList[];
  phosphor: keyof typeof PR;
}

export const SideList: FC<SideListProps> = ({
  openMenu,
  setOpenMenu,
  listNumber,
  listItemText,
  collapse,
  phosphor,
}) => {
  const [hoverLocation, setHoverLocation] = useState<number>(0);

  let Iconcomponent: any;

  if (phosphor !== undefined) {
    Iconcomponent = PR[phosphor];
  }

  const toggleSubMenu = (menuIndex: number) => {
    if (openMenu === menuIndex) {
      setOpenMenu(null);
    } else {
      setOpenMenu(menuIndex);
    }
  };
  return (
    <>
      <ListItem
        component="button"
        onClick={() => toggleSubMenu(listNumber)}
        onMouseOver={() => setHoverLocation(listNumber)}
        onMouseLeave={() => setHoverLocation(0)}
        className="border-b-2 "
      >
        <div className="flex items-center justify-between w-full duration-300 bg-white hover:scale-105">
          <ListItemText
            sx={{
              "& span": {
                fontWeight: "bold", // span 요소에 font-weight 적용
              },
            }}
            className="p-5 pl-0 duration-20 hover:text-main "
            primary={listItemText}
          />
          <PR.CaretUp
            className={`duration-150 ${
              openMenu === listNumber && "rotate-180"
            }`}
          />
        </div>
      </ListItem>

      <Collapse in={openMenu === listNumber} timeout="auto" unmountOnExit>
        <List component="div" disablePadding className="pl-3 bg-[#f2f2f2]">
          {collapse.map((colList) => (
            <Link
              key={colList.CollapseLinkURL}
              to={colList.CollapseLinkURL}
              className="block w-full p-5 font-bold duration-20 hover:text-main"
            >
              {colList.collapseText}
            </Link>
          ))}
        </List>
      </Collapse>
    </>
  );
};
