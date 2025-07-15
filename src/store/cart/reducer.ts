import * as T from "./types";

const initialState: T.State = [];

export const reducer = (state: T.State = initialState, action: T.Actions) => {
  switch (action.type) {
    case "@cart/add":
      return [...state, action.payload];
    case "@cart/set":
      return action.payload;
  }
  return state;
};
