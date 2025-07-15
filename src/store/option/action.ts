import type * as T from "./types";

export const addOption = (payload: T.Option): T.addOptionACtion => ({
  type: "@option/add",
  payload,
});

export const removeOption = (payload: T.optionId): T.removeOptionACtion => ({
  type: "@option/remove",
  payload,
});

export const setOption = (payload: T.State): T.setOptionACtion => ({
  type: "@option/set",
  payload,
});

export const deleteOption = (payload: T.deleteType): T.delteOptionAction => ({
  type: "@option/delete",
  payload,
});
