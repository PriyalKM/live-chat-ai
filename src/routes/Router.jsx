import { createBrowserRouter, Navigate } from "react-router";
import Error from "../pages/Error";
import MainLayout from "@/layouts/main";
import Home from "@/pages/Home";
import { BASE_PATH } from "@/lib/config";
import QuestionsPage from "@/pages/Questions";
import FollowUpsBoard from "@/pages/FollowUpsBoard";
import AlertsTimeline from "@/pages/AlertTimeLine";
import Discuss from "@/pages/Discuss";

const router = createBrowserRouter([
    {
        path: "/",
        errorElement:<Error />,
        element:<MainLayout />,
        children:[
            {
                index:true,
                element:<Navigate to="/home"/>
            },
            {
                path:'/home',
                element:<Home />
            },
            {
                path:'/discuss',
                element:<Discuss />
            },
            {
                path:'/questions',
                element:<QuestionsPage />
            },
            {
                path:'/follow_ups',
                element:<FollowUpsBoard />
            },
            {
                path:'/alerts',
                element:<AlertsTimeline />
            }
           
        ]
    }
],{
    basename:BASE_PATH
})

export default router;
