// middleware/requireAuth.js

import { NextApiRequest, NextApiResponse } from "next";
import { LOCAL_STORAGE_KEYS } from "../config/constants";

const requireAdminMiddleware = (req: NextApiRequest, res: NextApiResponse, next: any) => {
    const cookies = req?.cookies
    const user: any = cookies[LOCAL_STORAGE_KEYS.user]
    const user_ = JSON.parse(user ?? 'null')
    if (!user_?.is_superuser) {
        res.writeHead(302, {
            location: "/?admin_only=true",
        })
        res.end()
        return;
    }

    // User is authenticated, allow them to access the page
    next();
};

export default requireAdminMiddleware;
