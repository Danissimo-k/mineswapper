import {lazy} from "react";
import {RouteObject} from "react-router-dom";

const GamePage = lazy(() => import('./pages/Game').then(module => ({default: module.GamePage})))

export const gameRoutes: RouteObject[] = [
    {
        path: '/',
        element: <GamePage />
    }
]
