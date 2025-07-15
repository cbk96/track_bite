import type * as T from "./types";

export const addMenuGroup = (payload: T.State): T.addOptionGroupACtion => ({
  type: "@optionGroup/add",
  payload,
});

export const removeOptionGroup = (
  payload: T.optionGroupId
): T.removeOptionGroupACtion => ({
  type: "@optionGroup/remove",
  payload,
});

export const setOptionGroup = (payload: T.State): T.setOptionGroupACtion => ({
  type: "@optionGroup/set",
  payload,
});

export const deleteOptionGroup = (
  payload: string
): T.deleteOptionGroupAction => ({
  type: "@optionGroup/delete",
  payload,
});
