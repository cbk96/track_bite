import * as PR from "phosphor-react";

export type CollapseList = { collapseText: string; CollapseLinkURL: string };

export type SlideList = {
  listItemText: string;
  collapse: CollapseList[];
  phosphor: keyof typeof PR;
};
