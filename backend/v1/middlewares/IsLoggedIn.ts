import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "passport";
const checkLoggedIn = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) { 
         return res.redirect("http://localhost:3000/dashboard")
     }
    next()
  }

export default checkLoggedIn;
