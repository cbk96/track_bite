import * as T from "./types";

const initialState: T.State = [];

export const reducer = (state: T.State = initialState, action: T.Actions) => {
  switch (action.type) {
    case "@option/add":
      return [...state, action.payload];
    case "@option/remove":
      return initialState;
    case "@option/set":
      return [...action.payload];
    case "@option/delete":
      const deletedState = state.filter((option) => {
        if (action.payload.condition === "optionGroupId") {
          return option.optionGroupId !== action.payload.value;
        } else if (action.payload.condition === "optionId") {
          return option.optionId !== action.payload.value;
        }
        return option;
      });
      return deletedState;
  }
  return state;
};
