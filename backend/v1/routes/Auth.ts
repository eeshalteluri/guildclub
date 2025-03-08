import passport from "passport";

import { isAuthenticated } from "../middlewares/Auth";
import  { Router, Response } from "express";
import { AuthenticatedRequest } from "passport";

import Task from "../models/Task";
import TaskLog from "../models/Tasklog";

import mongoose from "mongoose";


const router = Router();

router.get("/google", passport.authenticate("google", {
    scope: ["email", "profile"]
}));

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:3000/dashboard",
    failureRedirect: "http://localhost:3000"
}));

router.get("/user", isAuthenticated, (req: AuthenticatedRequest, res: Response) => {
    console.log("User being fetched....")
    console.log("User Details: ", req.user)
    
    if (req.isAuthenticated() && req.user) {
        res.status(200).json(req.user);
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

router.get("/logout", (req: AuthenticatedRequest, res: Response, next) => {
    req
    .logout((err) => {
        if (err) {
            return next(err)
        }
    }),
    res.status(200)
    .json({ 
        status: "success",
        message: "Successfully logged out" 
    });
})



export default router;

 
