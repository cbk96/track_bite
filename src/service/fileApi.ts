import { useCallback } from "react";
import { file } from "../server";
import { useAdminContext } from "../context";
import * as CT from "../constants";

export const FileApi = () => {
  const { setAlertState } = useAdminContext();

  const fileUpload = useCallback(
    (
      uploadType: string,
      uploadImage: File,
      callback?: (uploadedImgPath: string) => void
    ) => {
      file(
        "/file/uploadImage?type=" + uploadType,
        uploadImage,
        CT.ADMIN_ACCESS_TOKEN
      )
        .then((res) => res.json())
        .then(
          (result: {
            ok: boolean;
            uploadedImgPath: string;
            errorMsg?: string;
          }) => {
            if (result.ok) {
              callback && callback(result.uploadedImgPath);
            } else {
              setAlertState(result.errorMsg);
            }
          }
        )
        .catch((error) => {
          setAlertState("이미지를 저장하는 중 문제가 발생했습니다.");
        });
    },
    []
  );

  return { fileUpload };
};
