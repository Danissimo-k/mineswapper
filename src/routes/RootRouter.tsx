import {Navigate, RouteObject, useRoutes} from "react-router-dom";
import {FC} from "react";
import {gameRoutes} from "../features/game/routes";

const routes: RouteObject[] = [
    ...gameRoutes,
    {
        path: '*',
        element: <Navigate to="/"/>,
    },
]

export const RootRouter: FC = () => useRoutes(routes)