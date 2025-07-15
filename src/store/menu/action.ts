import type * as T from "./types";

export const addMenu = (payload: T.Menu): T.addMenuACtion => ({
  type: "@menu/add",
  payload,
});

export const setMenu = (payload: T.State): T.setMenuACtion => ({
  type: "@menu/set",
  payload,
});

export const deleteMenu = (payload: T.deleteType): T.delteMenuAction => ({
  type: "@menu/delete",
  payload,
});
