import { SlideList } from "../components/sideBar/slideType";

export const CUSTOMER_LOGIN_TOKEN = "loggedInfo";
export const ADMIN_LOGIN_TOKEN = "loggedAdminInfo";
export const CUSTOMER_ACCESS_TOKEN = "CUSTOMER_TOKEN";
export const ADMIN_ACCESS_TOKEN = "ADMIN_TOKEN";
export const SUPER_ADMIN_ACCESS_TOKEN = "SUPER_ADMIN_TOKEN";

export const collapseList: SlideList[] = [
  {
    listItemText: "가게정보",
    collapse: [
      { CollapseLinkURL: "/admin", collapseText: "가게정보" },
      {
        CollapseLinkURL: "/admin/editOpHours",
        collapseText: "영업시간 관리",
      },
    ],
    phosphor: "House",
  },
  {
    listItemText: "주문, 리뷰",
    collapse: [
      { CollapseLinkURL: "/admin/purchaseList", collapseText: "주문내역" },
      { CollapseLinkURL: "/admin/reviewmanage", collapseText: "리뷰내역" },
    ],
    phosphor: "House",
  },
  {
    listItemText: "메뉴관리",
    collapse: [
      { CollapseLinkURL: "/admin/menumanage", collapseText: "메뉴설정" },
      { CollapseLinkURL: "/admin/optionmanage", collapseText: "옵션설정" },
    ],
    phosphor: "Hamburger",
  },
  {
    listItemText: "홍보, 쿠폰",
    collapse: [
      { CollapseLinkURL: "/admin/promotionmanage", collapseText: "홍보관리" },
      { CollapseLinkURL: "/admin/couponmanage", collapseText: "쿠폰관리" },
    ],
    phosphor: "Confetti",
  },
];
