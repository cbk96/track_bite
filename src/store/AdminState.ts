import * as MG from "./menuGroup";
import * as M from "./menu";
import * as OG from "./optionGroup";
import * as O from "./option";

export type AdminState = {
  menuGroups: MG.State;
  menu: M.State;
  optionGroup: OG.State;
  option: O.State;
};
