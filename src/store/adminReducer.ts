import { combineReducers } from "redux";

import * as MG from "./menuGroup";
import * as M from "./menu";
import * as OG from "./optionGroup";
import * as O from "./option";

export const adminReducer = combineReducers({
  menuGroups: MG.reducer,
  menu: M.reducer,
  optionGroup: OG.reducer,
  option: O.reducer,
});
