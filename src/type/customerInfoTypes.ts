import * as CT from "../constants";
import { initialAddress } from "./commonTypes";
import type { Address } from "./commonTypes";
import type { MenuPublicInfo, SortedOptions } from "./menuTypes";
import type { PurchaseStatus } from "../constants";

export type LoginId = string;

export type Customer = {
  customerId: string;
  password: string;
  name: string;
  email: string;
  tel: string;
  address: Address;
  prefer: CT.CategoryName; //선호 식품 *입력 가능한 값을 Admin.category와 동일한 값들로 제한할것
  joinDate: Date;
  inactive: boolean; //휴면여부
};

export type LoginCustomer = {
  logined: "login" | "LoggedOut" | "guest";
} & Pick<
  Customer,
  "customerId" | "name" | "prefer" | "inactive" | "tel" | "address" | "email"
>;

export type EditCustomer = Pick<
  Customer,
  "customerId" | "name" | "prefer" | "inactive" | "tel" | "address" | "email"
>;

export type Cart = {
  cartId: string;
  storePublicId: string;
  storeName: string;
  logoPath?: string;
  customerId: string;
  date: Date;
  quanti: number;
  sumPrice: number;
  menu: Omit<MenuPublicInfo, "optionGroupId" | "order" | "stock">;
  option: SortedOptions[];
};

//주문목록
export type Purchase = Omit<Cart, "cartId"> & {
  purchaseId: string;
  purchasePackageId: string;
  name: string;
  totalPrice: number;
  deliveryFee: number;
  paymentMethod: string;
  cardNumber: string;
  usedCouponIds: string[];
  couponDiscountPrice: number;
  purStatus: PurchaseStatus;
  address: Address;
  tel: string;
  deliRequest?: string;
  date: Date;
  businessFee: number;
};

export type CompactPurchase = Pick<
  Purchase,
  "purchaseId" | "purchasePackageId" | "menu"
>;

export type Review = {
  reviewId: string;
  purchasePackageId: string;
  parentId?: string;
  storePublicId: string;
  customerId: string;
  customerName: string;
  menuNames?: string[];
  score?: number;
  date: Date;
  content: string;
};

export const initialCart: Cart = {
  cartId: "",
  storePublicId: "",
  storeName: "",
  logoPath: "",
  customerId: "",
  date: new Date(),
  quanti: 1,
  sumPrice: 0,
  menu: {
    menuId: "",
    menuName: "",
    menuGroupId: "",
    price: 0,
    menuDescrip: "",
    imagePath: "",
    saleStatus: CT.saleStatusKeys[0],
  },
  option: [],
};

export const initialCustomer: Customer = {
  customerId: "",
  password: "",
  name: "",
  email: "",
  tel: "",
  address: initialAddress,
  prefer: "empty",
  joinDate: new Date(),
  inactive: false,
};

export const initialLoginCustomer: LoginCustomer = {
  customerId: "",
  name: "",
  tel: "",
  address: initialAddress,
  prefer: "empty",
  inactive: false,
  logined: "LoggedOut",
  email: "",
};

export const initialEDCustomer: EditCustomer = {
  customerId: "",
  name: "",
  tel: "",
  address: initialAddress,
  prefer: "empty",
  inactive: false,
  email: "",
};

export const initialReview: Review = {
  reviewId: "",
  purchasePackageId: "",
  parentId: "",
  storePublicId: "",
  score: 5,
  customerId: "",
  customerName: "",
  menuNames: [],
  date: new Date(),
  content: "",
};
