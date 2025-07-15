import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CustomerStoreProvider } from "./CustomerStoreProvier";
import { CustomerProvider } from "./context/CustomerContext";
import { AdminProvider } from "./AdminProvider"; //관리자 페이지용 상태 관리
import { AdminDBProvider, SuperAdminProvider } from "./context"; //관리자 페이지용 서버 연결 관리
import * as PAGE from "./pages";
import { SuperProvider } from "./SuperProvider";

const router = createBrowserRouter([
  { path: "*", element: <PAGE.WrongPath /> },
  {
    path: "/",
    element: (
      <CustomerStoreProvider>
        <CustomerProvider>
          <PAGE.CustomerLayout />
        </CustomerProvider>
      </CustomerStoreProvider>
    ),
    children: [
      { path: "", element: <PAGE.Home /> },
      { path: "signup", element: <PAGE.SignUP /> },
      { path: "login", element: <PAGE.Login /> },
      { path: "editCustomer", element: <PAGE.EditCustomerInfo /> },
      { path: "mypage", element: <PAGE.Mypage /> },
      { path: "mycoupons", element: <PAGE.MyCoupons /> },
      { path: "store/", element: <PAGE.StoreList /> },
      { path: "store/:storeName", element: <PAGE.StoreList /> },
      { path: "store/storeview/", element: <PAGE.WrongPath /> },
      { path: "store/storeview/:storePublicId", element: <PAGE.StoreView /> },
      {
        path: "store/purchaseSheet/:storePublicId",
        element: <PAGE.PurchaseSheet />,
      },
    ],
  },

  {
    path: "/admin",
    element: (
      <AdminProvider>
        <AdminDBProvider>
          <PAGE.AdminLayout />
        </AdminDBProvider>
      </AdminProvider>
    ),
    children: [
      { path: "", element: <PAGE.AdminHome /> },
      { path: "login", element: <PAGE.AdminLogin /> },
      { path: "signup", element: <PAGE.AdminSignUP /> },
      { path: "editAdmin", element: <PAGE.EditAdminInfo /> },
      { path: "editOpHours", element: <PAGE.EditOperatingHours /> },
      { path: "purchaseList", element: <PAGE.AdminPurchaseList /> },
      { path: "menumanage", element: <PAGE.MenuManage /> },
      { path: "optionmanage", element: <PAGE.OptionManage /> },
      { path: "reviewmanage", element: <PAGE.ReviewManage /> },
      { path: "promotionmanage", element: <PAGE.PromotionManage /> },
      { path: "couponmanage", element: <PAGE.CouponManage /> },
    ],
  },
  {
    path: "/superadmin",
    element: (
      <SuperProvider>
        <SuperAdminProvider>
          <PAGE.SuperAdminLayout />
        </SuperAdminProvider>
      </SuperProvider>
    ),
    children: [
      { path: "", element: <PAGE.SuperAdminPurchaseList /> },
      { path: "login", element: <PAGE.SuperAdminLogin /> },
      { path: "purchase", element: <PAGE.SuperAdminPurchaseList /> },
      { path: "store", element: <PAGE.SuperAdminStoreList /> },
      { path: "customer", element: <PAGE.SuperAdminCustomerList /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
