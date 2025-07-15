import type { Coupon } from "../type";

export const isUsableMethod = {
  true: "사용 가능",
  false: "사용 불가",
};

export const isVisibleMethod = {
  true: "노출중",
  false: "숨김",
};

export type IsUsableMethod = keyof typeof isUsableMethod;
export type IsVisibleMethod = keyof typeof isVisibleMethod;

export const IsUsableMethodKeys = Object.keys(
  isUsableMethod
) as IsUsableMethod[];

export const IsVisibleMethodKeys = Object.keys(
  isVisibleMethod
) as IsVisibleMethod[];
