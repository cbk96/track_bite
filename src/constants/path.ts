export const SERVER_ROOT_URL =
  process.env.REACT_APP_BACKEND_URL ?? "https://track-bite-server.onrender.com";

export const IMAGE_ROOT_URL = process.env.REACT_APP_IMAGE_URL ?? "/";

export const LOCAL_IMAGE_PATH = "/images";

export const categoryImgName = {
  empty: "",
  fastfood: LOCAL_IMAGE_PATH + "/category_img_fastfood.jpg",
  bunsik: LOCAL_IMAGE_PATH + "/category_img_bunsik.jpg",
  korean: LOCAL_IMAGE_PATH + "/category_img_korean.jpg",
  japanese: LOCAL_IMAGE_PATH + "/category_img_japanese.jpg",
  dessert: LOCAL_IMAGE_PATH + "/category_img_dessert.jpg",
  western: LOCAL_IMAGE_PATH + "/category_img_western.jpg",
  chinese: LOCAL_IMAGE_PATH + "/category_img_chinese.jpg",
};

export const categorySquareImgName = {
  empty: "",
  fastfood: LOCAL_IMAGE_PATH + "/category_square_img_fastfood.jpg",
  bunsik: LOCAL_IMAGE_PATH + "/category_square_img_bunsik.jpg",
  korean: LOCAL_IMAGE_PATH + "/category_square_img_korean.jpg",
  japanese: LOCAL_IMAGE_PATH + "/category_square_img_japanese.jpg",
  dessert: LOCAL_IMAGE_PATH + "/category_square_img_dessert.jpg",
  western: LOCAL_IMAGE_PATH + "/category_square_img_western.jpg",
  chinese: LOCAL_IMAGE_PATH + "/category_square_img_chinese.jpg",
};
