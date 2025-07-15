import * as T from "./types";

const initialState: T.State = [];

export const reducer = (state: T.State = initialState, action: T.Actions) => {
  switch (action.type) {
    case "@menu/add":
      return [...state, action.payload];
    case "@menu/set":
      return [...action.payload];
    case "@menu/delete":
      const deletedState = state.filter((menu) => {
        if (action.payload.condition === "menuGroupId") {
          return menu.menuGroupId !== action.payload.value;
        } else if (action.payload.condition === "menuId") {
          return menu.menuId !== action.payload.value;
        }
        return menu;
      });
      return deletedState;
  }
  return state;
};
