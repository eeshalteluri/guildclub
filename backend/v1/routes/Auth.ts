import passport from "passport";

import { isAuthenticated } from "../middlewares/Auth";
import  { Router, Response } from "express";
import { AuthenticatedRequest } from "passport";

import Task from "../models/Task";
import TaskLog from "../models/Tasklog";

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import User from "../models/User";


const router = Router();

router.get("/google", passport.authenticate("google", {
    scope: ["email", "profile"]
}));

// Google OAuth Callback
router.get("/google/callback", passport.authenticate("google", { session: false }), (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
      res.status(401).json({ message: "Authentication failed" });
      return;
  }

  // Generate a JWT token
  const token = jwt.sign(
      { id: (req.user as any)._id, email: (req.user as any).email },
      JWT_SECRET,
      { expiresIn: "1h" }
  );


  // Redirect with token in query param
  res.redirect(`http://localhost:3000/dashboard?token=${token}`);
});

router.get("/user", isAuthenticated, async(req: AuthenticatedRequest, res: Response) => {
    console.log("User being fetched....")
    console.log("User Details: ", req.user)
    
    if (req.isAuthenticated() && req.user) {
        
      const user = await User.findById(req.user.id);

      console.log("User details: ", user)
      res.status(200).json({
        status: "success",
        data: user,
        message: "User details fetched successfully"
      });
    } else {
        res.status(401).json({ 
            status: "error",
            message: "Not authenticated" 
        });
    }
});

router.get("/task-data-and-logs", isAuthenticated, async (req: AuthenticatedRequest, res: Response):Promise<any> => {
    console.log("Request Query: ", req.query)
    try {
      const { taskIds } = req.query;
      console.log("Task IDs: ", taskIds);

      const taskIdsArray = typeof taskIds === "string" ? taskIds.split(",") : [];
      console.log("Task IDs (Array):", taskIdsArray);
  
      // Validate input
      if (!Array.isArray(taskIdsArray) || taskIdsArray.length === 0) {
        return res.status(400).json(
          { success: false, message: "No valid task IDs provided." }
        );
      }
  
      // Fetch task logs and details concurrently using Promise.all
      const tasksLogsData = await Promise.all(
        taskIdsArray.map(async (taskId) => {
          try {
            const taskObjectId = new mongoose.Types.ObjectId(taskId);
            const taskLogs = await TaskLog.findOne({ taskId: taskObjectId });
            const taskDetails = await Task.findById(taskObjectId);
  
            console.log("Task Logs: ", taskLogs)
            console.log("Task Details: ", taskDetails)
  
            if (taskLogs) {
              return { taskLogs, taskDetails };
            }
            else return [];
          } catch (error) {
            console.error(`Error fetching data for task ID ${taskId}:`, error);
            return null; // Skip tasks with errors
          }
        })
      );
  
      // Filter out null results (cases where task logs were not found)
      const filteredTasksLogsData = tasksLogsData.filter((data) => data !== null);
  
      console.log("Total tasks logs:", filteredTasksLogsData);
  
      return res.json({ success: true, tasksLogsData: filteredTasksLogsData });
    } catch (error) {
      console.error("Unhandled Error:", error instanceof Error ? error.message : error);
  
      return res.status(500).json(
        {
          success: false,
          message: "Something went wrong.",
          error: error instanceof Error ? error.message : String(error),
        }
      );
    }
  })

  router.get('/logout', (req, res) => {
    // Just tell client to delete token
    res.json({ message: 'Successfully logged out.' });
  });



export default router;

 
