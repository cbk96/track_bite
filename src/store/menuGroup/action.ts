import type * as T from "./types";

export const addMenuGroup = (payload: T.State): T.addMenuGroupACtion => ({
  type: "@menuGroup/add",
  payload,
});

export const removeMenuGroup = (
  payload: T.menuGroupId
): T.removeMenuGroupACtion => ({
  type: "@menuGroup/remove",
  payload,
});

export const setMenuGroup = (payload: T.State): T.setMenuGroupACtion => ({
  type: "@menuGroup/set",
  payload,
});

export const deleteMenuGroup = (payload: string): T.deleteMenuGroupAction => ({
  type: "@menuGroup/delete",
  payload,
});
