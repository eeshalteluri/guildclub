import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "passport";

export const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if(req.isAuthenticated()){
        console.log("Authenticated")
        console.log("Authenticated Request: ", req)

        return next()
    }
    console.log("Unauthorized")
    res
    .status(404)
    .json({
        status: "error",
        data: null,
        message: "Unauthorized",
    })
}