
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Settlement from "../pages/settlement/page";
import Sending from "../pages/sending/page";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/settlement",
        element: <Settlement />,
    },
    {
        path: "/sending",
        element: <Sending />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
];

export default routes;
