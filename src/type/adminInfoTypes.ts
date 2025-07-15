import type { Address } from "./commonTypes";
import { initialAddress } from "./commonTypes";
import * as CT from "../constants";

export type Store = {
  storeId: string;
  storePublicId: string;
  password: string;
  storeName: string; //가게명
  name: string; //사업주명
  address: Address; //가게주소
  tel: string;
  logoPath?: string;
  heroBannerPath?: string;
  category: CT.CategoryName; // 가게 취급 식품 카테고리
  joinDate: Date; //가입 일자
  inactive: boolean; //영업 정지 여부
  notification?: string; //공지
  businessType: string;
  businessNumber: string;
  paymentMethod: CT.PaymentMethod[];
  minOrderAmount: number;
  deliveryFee: number;
};

export type EditStore = Omit<Store, "password" | "joinDate">;

export type LoginAdmin = Omit<
  Store,
  "password" | "joinDate" | "notification"
> & {
  logined: boolean;
};

export type StorePublicInfo = Omit<Store, "storeId" | "password"> & {
  reviewCount?: number;
  reviewScore?: number;
};

export type PopularStore = {
  storePublicId: string;
  storeName: string;
  logoPath: string;
  heroBannerPath?: string;
  category: CT.CategoryName;
  reviewCount: number;
  reviewScore: number;
  totalOrdered: number;
};

export type EventInfo = {
  storeId: string;
  eventId: string;
  eventName: string;
  slideBannerPath: string;
  bigBannerPath: string;
  eventDetail: string;
  date: Date;
};

export type OperatingHours = {
  storeId?: string;
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  open: string;
  close: string;
  order: number;
};

export const initialStore: Store = {
  storeId: "",
  storePublicId: "",
  password: "",
  storeName: "",
  name: "",
  address: initialAddress,
  tel: "",
  logoPath: "",
  category: "empty",
  joinDate: new Date(),
  inactive: false,
  notification: "",
  businessType: "",
  businessNumber: "",
  paymentMethod: [],
  minOrderAmount: 0,
  deliveryFee: 0,
};

export const initialStorePublic: StorePublicInfo = {
  storePublicId: "",
  storeName: "",
  name: "",
  address: initialAddress,
  tel: "",
  logoPath: "",
  category: "empty",
  joinDate: new Date(0, 0, 0),
  inactive: true,
  notification: "",
  businessType: "",
  businessNumber: "",
  paymentMethod: [],
  minOrderAmount: 0,
  deliveryFee: 0,
  reviewCount: 0,
  reviewScore: 0,
};

export const initialLoginAdmin: LoginAdmin = {
  logined: false,
  storeId: "",
  storeName: "",
  name: "",
  address: initialAddress,
  tel: "",
  category: "empty",
  inactive: true,
  storePublicId: "",
  businessType: "",
  businessNumber: "",
  paymentMethod: [],
  minOrderAmount: 0,
  deliveryFee: 0,
};

export const initialEDStore: EditStore = {
  storeId: "",
  storeName: "",
  name: "",
  address: initialAddress,
  tel: "",
  category: "empty",
  inactive: true,
  storePublicId: "",
  notification: "",
  businessType: "",
  businessNumber: "",
  paymentMethod: [],
  minOrderAmount: 0,
  deliveryFee: 0,
};

export const initialOperatingHours: OperatingHours[] = [
  { storeId: "", day: "sunday", open: "", close: "", order: 0 },
  { storeId: "", day: "monday", open: "", close: "", order: 1 },
  { storeId: "", day: "tuesday", open: "", close: "", order: 2 },
  { storeId: "", day: "wednesday", open: "", close: "", order: 3 },
  { storeId: "", day: "thursday", open: "", close: "", order: 4 },
  { storeId: "", day: "friday", open: "", close: "", order: 5 },
  { storeId: "", day: "saturday", open: "", close: "", order: 6 },
];
