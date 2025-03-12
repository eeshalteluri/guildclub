import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "passport";
const checkLoggedIn = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) { 
         return res.redirect("https://guildclub.vercel.app/dashboard")
     }
    next()
  }

export default checkLoggedIn;
