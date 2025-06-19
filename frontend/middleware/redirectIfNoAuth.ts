import { NextApiRequest, NextApiResponse } from "next";
import { globalLogout } from "../providers/appProvider";

function customRedirect(req: NextApiRequest, res: NextApiResponse) {
    globalLogout()
    res.writeHead(302, {
        location: "/auth/login/?message=no-auth",
    })
    res.end()
}

export default customRedirect