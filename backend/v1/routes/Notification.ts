import { Response, Router } from "express"
import User from "../models/User"
import Notification from "../models/Notification"
import { AuthenticatedRequest } from "passport"
import { findUserId, findUserDetails } from "../helpers/findUserId"

const router: Router = Router()

router.get("/", async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const { userId } = req.query;
    console.log("Notification GET route is working...!");

    try {
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        const notifications = await Notification.find({ userId })
            .populate("fromUserId", "name")  // Populate only 'name' field from 'fromUserId'
            .populate("taskId", "name") // Populate only 'taskName' field from 'taskId'
            .select("_id fromUserId taskId status date"); // Return only _id, fromUserId, taskId, and date

        console.log("Populated Notifications: ", notifications);

        if (notifications.length === 0) {
            return res.status(404).json({ error: "No notifications found" });
        }

        return res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            data: notifications,
        });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message || error,
        });
    }
});



export default router