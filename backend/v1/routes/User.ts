import { Response, Router } from "express"
import User from "../models/User"
import { AuthenticatedRequest } from "passport"

const router: Router = Router()

router.put("/update-name", async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
      const { name } = req.body;  
      const user = (req as any).user;
  
      if (!user || !user.email) {
        console.log("Session user:", user);
        return res.status(401).json({ message: "User not authenticated" }); 
      }
  
      if(!name || name.trim() === ""){
        return res
        .status(405)
        .json({ 
          error: "Name is required" 
      })
      }
  
      const updatedUser = await User.findOneAndUpdate(
        { email: user.email },
        { name: name },
        { new: true }  
      )

      req.user.name = name
  
      res.status(200).json({
        success: true,
        message: "Name updated successfully",
        user: updatedUser
      })
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Failed to update name" });
    }
  })

export default router