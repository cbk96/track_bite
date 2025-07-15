import * as T from "./types";

const initialState: T.State = [];

export const reducer = (state: T.State = initialState, action: T.Actions) => {
  switch (action.type) {
    case "@optionGroup/add":
      return [...state, action.payload];
    case "@optionGroup/remove":
      return initialState;
    case "@optionGroup/set":
      return [...action.payload];
    case "@optionGroup/delete":
      const deletedState = state.filter((group) => {
        return group.optionGroupId !== action.payload;
      });
      return deletedState;
  }
  return state;
};
