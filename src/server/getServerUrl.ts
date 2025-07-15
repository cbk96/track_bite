import * as CT from "../constants";

export const getServerUrl = (path: string) => {
  const host = CT.SERVER_ROOT_URL;
  return [host, path].join("");
};
