import type { CategoryName } from "../constants";
import type { Review, Coupon, Purchase, CompactPurchase, Address } from ".";

export type SearchingResult<T> = {
  searchingItemList?: T[];
  searchingAllItemLength: number;
  todayItemLength: number;
};

export type SearchingPurchaseCust = {
  SearchingResult: Purchase[];
  SearchingMenus: CompactPurchase[];
};

export type SearchingReview = Omit<SearchingResult<Review[]>, ""> & {
  grade: number;
};

export type SearchingCoupon = Omit<
  SearchingResult<Coupon>,
  "todayItemLength"
> & {
  allItemLength: number;
  usableId: string[];
  visibleId: string[];
};

export type SearchingPurchList = {
  searchingPkList: Purchase[];
  searchingItems: Purchase[];
  searchingAllPkLength: number;
  todayItemLength: number;
};

export type StoreListSearchFilter = Pick<Address, "sigunguCode"> & {
  storeName: string;
  category: CategoryName;
  startItemNum: number;
  limitItemNum: number;
};

///////////기본값////////////

export const initialSearchingResult = {
  searchingItemList: [],
  searchingItemAllScore: 0,
  searchingAllItemLength: 0,
  todayItemLength: 0,
};

export const initialSearchingReview: SearchingReview = {
  searchingItemList: [],
  searchingAllItemLength: 0,
  todayItemLength: 0,
  grade: 0,
};

export const initialSearchingCoupon: SearchingCoupon = {
  searchingItemList: [],
  searchingAllItemLength: 0,
  allItemLength: 0,
  usableId: [],
  visibleId: [],
};

export const initialStoreListSearchFilter: StoreListSearchFilter = {
  storeName: "",
  category: "empty",
  sigunguCode: "",
  startItemNum: 0,
  limitItemNum: 0,
};
