import { getServerUrl } from "./getServerUrl";

export const file = (
  path: string,
  file: File,
  jwtKey: string | null | undefined
) => {
  const formData = new FormData();
  formData.append("uploadImage", file);
  let accessToken = localStorage.getItem(jwtKey ?? "");
  let init: RequestInit = {
    headers: { Authorization: `Bearer ${accessToken}` },
    method: "POST",
    body: formData,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
  };

  return fetch(getServerUrl(path), init);
};
