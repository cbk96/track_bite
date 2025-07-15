import * as CT from "../constants";

export type MenuGroup = {
  storeId: string;
  menuGroupId: string;
  menuGroupName: string;
  order: number;
  menuCount: number;
};

export type Menu = {
  menuId: string;
  menuName: string;
  storeId: string;
  menuGroupId: string;
  price: number;
  menuDescrip: string;
  imagePath: string;
  optionGroupId: string[]; //OptionGroup의 optionGroupId 참조
  saleStatus: CT.SaleStatus;
  order: number;
};

export type PopularMenu = {
  menuId: string;
  menuName: string;
  imagePath: string;
  totalOrdered: number;
};

export type OptionGroup = {
  storeId: string;
  optionGroupId: string;
  optionGroupName: string;
  required: boolean; //필수 여부
  selectionType: "single" | "multi"; //단일, 복수 선택여부
  order: number;
  optionCount?: number;
};

export type Option = {
  optionId: string;
  optionGroupId: string;
  storeId: string;
  optionName: string;
  price: number;
  order: number;
};

//고객페이지용
export type MenuGroupPublicInfo = Omit<MenuGroup, "storeId">;
export type MenuPublicInfo = Omit<Menu, "storeId">;
export type OptionGroupPublicInfo = Omit<OptionGroup, "storeId">;
export type OptionPublicInfo = Omit<Option, "storeId">;

export type SortedOptions = {
  optionGroupId: string;
  groupName: string;
  required: boolean;
  selectionType: "single" | "multi"; //단일, 복수 선택여부
  optionCount: number;
  options: Option[] | OptionPublicInfo[];
};

export type Coupon = {
  couponId: string;
  storeId: string;
  couponName: string;
  storeName: string;
  registDate: Date;
  modifyDate: Date;
  discountPrice: number;
  minOrderAmount: number;
  validFrom: Date;
  validUntil: Date;
  isUsable: boolean;
  isVisible: boolean;
};

export type CouponIssue = {
  couponIssueId: string;
  couponId: string;
  purchasePackageId?: string;
  couponName: string;
  storePublicId: string;
  storeName: string;
  customerId: string;
  used: boolean;
  discountPrice: number;
  minOrderAmount: number;
  validFrom: Date;
  validUntil: Date;
};

export const initialCoupon: Coupon = {
  couponId: "",
  storeId: "",
  couponName: "",
  storeName: "",
  registDate: new Date(),
  modifyDate: new Date(),
  discountPrice: 0,
  minOrderAmount: 0,
  validFrom: new Date(Date.now()),
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  isUsable: false,
  isVisible: false,
};

export const initialCouponIssue: CouponIssue = {
  couponIssueId: "",
  couponId: "",
  couponName: "",
  storePublicId: "",
  storeName: "",
  customerId: "",
  used: false,
  discountPrice: 0,
  minOrderAmount: 0,
  validFrom: new Date(),
  validUntil: new Date(),
};
