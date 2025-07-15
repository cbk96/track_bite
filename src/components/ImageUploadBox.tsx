import { useCallback, useEffect, useState, useRef } from "react";
import { useAdminContext } from "../context";
import { FileApi } from "../service";
import { FallbackImg } from "./FallbackImg";
import * as CT from "../constants";

interface ImageUploadBoxProps<T> {
  uploadType: "storeInfo" | "menu" | "promotion";
  uploadImageState: File | null;
  setUploadImageState: React.Dispatch<React.SetStateAction<File | null>>;
  setUploadPath: (imagePath: string) => void;
  attribName: string;
  usuallyImage: string;
  imageBoxType?: "square" | "auto";
  width?: number;
  height?: number;
}

const ImageUploadBox = <T,>({
  uploadType,
  uploadImageState,
  setUploadImageState,
  setUploadPath,
  attribName = "",
  usuallyImage,
  imageBoxType = "square",
  width = 190,
  height = 190,
}: ImageUploadBoxProps<T>) => {
  const { fileUpload } = FileApi();
  const [imagePrev, setImagePrev] = useState<string>("");
  const inputFileRef = useRef<HTMLInputElement>(null);

  const { setAlertState } = useAdminContext();

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file) {
        setUploadImageState(file);
        setImagePrev(URL.createObjectURL(file));
      }
    },
    []
  );

  //미리보기 이미지 값의 변경을 감지하여 input의 선택된 파일값을 제거
  useEffect(() => {
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  }, [imagePrev, inputFileRef]);

  //파일 입력폼의 이미지 파일 선택을 감지하여 서버에 업로드 후 이미지 경로를 메뉴 입력 정보에 반영
  useEffect(() => {
    if (uploadImageState != null) {
      fileUpload(uploadType, uploadImageState, (uploadedImgPath) => {
        if (uploadedImgPath) {
          setUploadPath && setUploadPath(uploadedImgPath);
          setUploadImageState(null);
        } else {
          setAlertState("메뉴 이미지가 등록 중 문제가 발생했습니다.");
        }
      });
    }
  }, [uploadImageState]);

  return (
    <div className="overflow-hidden">
      {usuallyImage !== "" &&
      usuallyImage !== null &&
      usuallyImage !== undefined ? (
        <label
          htmlFor={`menuImageUpload` + attribName}
          className={` ${
            imageBoxType === "square" && "block  border-2"
          } bg-white  rounded-xl text-[80px] text-[#ddd] text-center leading-[190px] overflow-hidden cursor-pointer`}
          style={{ width: width + "px", height: height + "px" }}
        >
          <FallbackImg
            src={usuallyImage}
            alt="(업로드)미리보기"
            className="object-cover h-full overflow-hidden border rounded-xl"
          />
        </label>
      ) : imagePrev !== "" && uploadImageState !== null ? (
        <label
          htmlFor={`menuImageUpload` + attribName}
          className="block bg-white border-2 rounded-xl text-[80px] text-[#ddd] text-center leading-[190px] overflow-hidden cursor-pointer"
          style={{ width: width + "px", height: height + "px" }}
        >
          <FallbackImg
            src={imagePrev}
            alt="(prev)미리보기"
            className="h-full"
          />
        </label>
      ) : (
        <label
          htmlFor={`menuImageUpload` + attribName}
          className="block bg-white border-2 rounded-xl material-icons text-[80px] text-[#ddd] text-center leading-[190px] overflow-hidden cursor-pointer"
          style={{ width: width + "px", height: height + "px" }}
        >
          photo_camera
        </label>
      )}

      <input
        type="file"
        ref={inputFileRef}
        className="hidden"
        onChange={handleFileChange}
        id={`menuImageUpload` + attribName}
        accept="image/*"
      />
    </div>
  );
};

export default ImageUploadBox;
