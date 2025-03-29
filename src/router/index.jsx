import { createHashRouter } from "react-router-dom";
import Base from "../page/Base";
import Game_comment from "../page/Game_comment";
import Game_search from "../page/Game_search";
import About_us from "../page/About_us";
import Game_content from "../page/Game_content";
import Index from "../page/Index";
import TeamBuy from "../page/Teambuy";
import Login from "../page/Login";
import UserProfile from "../page/UserProfile";
import TeamBuyComment from "../page/TeamBuyComment";
import Register from "../page/Register";
import AdminLayout from "../page/admin/AdminLayout";
import AdminStore from "../page/admin/AdminStore";
import AdminUser from "../page/admin/AdminUser";
import AdminGame from "../page/admin/AdminGame";
import AdminGroup from "../page/admin/AdminGroup";
import StoreProfile from "../page/StoreProfile";
import AddGames from "../page/AddGames";

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
                element: <Register />,
            },
            {
                path: "/Login",
                element: <Login />,
            },
            {
                path: "/Game_comment/:state/:id",
                element: <Game_comment />,
            },
            {
                path: "/Game_search",
                element: <Game_search />,
            },
            {
                path: "/Game_content/:gameID",
                element: <Game_content />,
            },
            {
                path: "/TeamBuy",
                element: <TeamBuy />,
            },
            {
                path: "/About_us",
                element: <About_us />,
            },
            {
                path: "/User_profile/:user_id/:activedefaultTab",
                element: <UserProfile />,
            },
            {
                path: "/Store_profile/:user_id/:activedefaultTab",
                element: <StoreProfile />,
            },
            {
                path: "/TeamBuyComment/:group_id",
                element: <TeamBuyComment />,
            },
            {
                path: "/AddGames?/:game_id",
                element: <AddGames />
            },
            {
                path: "/Admin",
                element: <AdminLayout />,
                children: [
                    {
                        // index: true,
                        path: "/Admin/Store",
                        element: <AdminStore />,
                    },
                    {
                        path: "/Admin/User",
                        element: <AdminUser />,
                    },
                    {
                        path: "/Admin/Game",
                        element: <AdminGame />,
                    },
                    {
                        path: "/Admin/Group",
                        element: <AdminGroup />,
                    },
                ],
            },
        ],
    },
]);

export default Router;
