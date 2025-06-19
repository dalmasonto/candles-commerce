// middleware/requireAuth.js

import { NextApiRequest, NextApiResponse } from "next";
import { LOCAL_STORAGE_KEYS } from "../config/constants";

const requireAuthMiddleware = (req: NextApiRequest, res: NextApiResponse, next: any) => {
    const cookies = req?.cookies
    const loginStatus: any = cookies[LOCAL_STORAGE_KEYS.login_status]
    const isAuthenticated = JSON.parse(loginStatus ?? 'false')
    if (isAuthenticated === false) {
        res.writeHead(302, {
            location: "/auth/login",
        })
        res.end()
        return;
    }

    // User is authenticated, allow them to access the page
    next();
};

export default requireAuthMiddleware;
