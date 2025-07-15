import * as T from "./types";

const initialState: T.State = [];

export const reducer = (state: T.State = initialState, action: T.Actions) => {
  switch (action.type) {
    case "@menuGroup/add":
      return [...state, action.payload];
    case "@menuGroup/remove":
      return initialState;
    case "@menuGroup/set":
      return [...action.payload];
    case "@menuGroup/delete":
      const deletedState = state.filter((group) => {
        return group.menuGroupId !== action.payload;
      });
      return deletedState;
  }
  return state;
};
