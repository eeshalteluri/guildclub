import { Response, Router } from "express"
import User from "../models/User"
import { AuthenticatedRequest } from "passport"


const router: Router = Router()

router.post("/check-username", async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  const { username } = req.body
  console.log("Checking username: ", username)

  try{
    if(!username || username.trim() === ""){
      return res
      .status(405)
      .json({ 
        error: "Username is required" 
    })
    }

    const existingUser = await User.findOne({ username })
    console.log("Existing user: ", existingUser)

    if(existingUser){
      return res
      .status(200)
      .json({
        availability: false,
        data: existingUser,
        error: "Username already taken" 
        })
    }
    
    res.json({ 
      availability: true,
      data: null
    })
  }catch(error){
    console.error("Error checking username: ", error)
    res
    .status(500)
    .json({ 
      success: false,
      data: null,
      error: "Internal server error" 
    })
  }
})

router.post("/claim-username", async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { username } = req.body;
    const user = (req as any).user;
    
    if (!user || !user.email) {
      console.log("Session user:", user);
      return res.status(401).json({ message: "User not authenticated" });
    }

    if(!username || username.trim() === ""){
      return res
      .status(405)
      .json({ 
        error: "Username is required" 
    })
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      { username: username },
      { new: true }
    );
    
    if (req.session) {
      (req.session as any).passport.user = updatedUser;
    }

    res.status(200).json({ 
      success: true, 
      message: "Username claimed successfully" 
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to claim username" });
  }
})

router.put("/update-username", async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { username } = req.body;  
    const user = (req as any).user;

    if (!user || !user.email) {
      console.log("Session user:", user);
      return res.status(401).json({ message: "User not authenticated" }); 
    }

    if(!username || username.trim() === ""){
      return res
      .status(405)
      .json({ 
        error: "Username is required" 
    })
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      { username: username },
      { new: true }  
    )

    console.log("Req.user (before update): ", req.user)
    req.user.username = username
    console.log("Req.user (after update): ", req.user)

    res.status(200).json({
      success: true,
      message: "Username updated successfully",
      user: updatedUser
    })
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to update username" });
  }
})

export default router

