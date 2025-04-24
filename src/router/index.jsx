import { createHashRouter } from "react-router-dom";

// 設定讓每個頁面進入時再載入，而非剛開始就全部載入
import { lazy, Suspense } from "react";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Base from "../page/Base";
import Index from "../page/Index";

const lazyLoad = (importFunc, message = "頁面載入中") => {
  const Component = lazy(importFunc);
  return (
    <Suspense fallback={<LoadingSpinner message={message} />}>
      <Component />
    </Suspense>
  );
};



const Router = createHashRouter([
  {
    path: "/",
    element: <Base />,
    children: [
      {
        path: "/",
        element: <Index />
      },
      {
        path: "/Register",
        element: lazyLoad(() => import("../page/Register"), "註冊頁面載入中")
      },
      {
        path: "/Login",
        element: lazyLoad(() => import("../page/Login"), "登入頁面載入中"),
      },
      {
        path: "/Game_comment/:state/:id",
        element: lazyLoad(() => import("../page/Game_comment"), "評論頁面載入中")
      },
      {
        path: "/Game_search",
        element: lazyLoad(() => import("../page/Game_search"), "搜尋頁面載入中")
      },
      {
        path: "/Game_content/:gameID",
        element: lazyLoad(() => import("../page/Game_content"), "遊戲介紹載入中")
      },
      {
        path: "/TeamBuy",
        element: lazyLoad(() => import("../page/TeamBuy"), "揪團總覽載入中")
      },
      {
        path: "/About_us",
        element: lazyLoad(() => import("../page/About_us"), "關於我們載入中")
      },
      {
        path: "/User_profile/:user_id/:activedefaultTab",
        element: lazyLoad(() => import("../page/UserProfile"), "基本資料載入中")
      },
      {
        path: "/Store_profile/:user_id/:activedefaultTab",
        element: lazyLoad(() => import("../page/StoreProfile"), "基本資料載入中")
      },
      {
        path: "/TeamBuyComment/:group_id",
        element: lazyLoad(() => import("../page/TeamBuyComment"), "揪團詳細載入中")
      },
      {
        path: "/AddGames/:game_id?",
        element: lazyLoad(() => import("../page/AddGames"), "新增遊戲表單載入中")
      },
      {
        path: "/Admin",
        element: lazyLoad(() => import("../page/admin/AdminLayout"), ""),
        children: [
          {
            path: "/Admin/Store",
            element: lazyLoad(() => import("../page/admin/AdminStore"), "店家列表載入中")
          },
          {
            path: "/Admin/User",
            element: lazyLoad(() => import("../page/admin/AdminUser"), "會員列表載入中")
          },
          {
            path: "/Admin/Game",
            element: lazyLoad(() => import("../page/admin/AdminGame"), "遊戲列表載入中")
          },
          {
            path: "/Admin/Group",
            element: lazyLoad(() => import("../page/admin/AdminGroup"), "揪團列表載入中")
          },
        ],
      }
    ],
  },
  // ⚠️ 加在最後，所有未命中路由都會被導向首頁
  {
    path: "*",
    element: lazyLoad(() => import("../page/NotFound"), "")
  },

]);

export default Router;
