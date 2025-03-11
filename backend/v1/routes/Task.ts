import express, { Request, Response , Router } from "express";
import Task from "../models/Task";
import TaskLog from "../models/Tasklog";
import taskSchema from "../zod/TaskSchema";
import { ObjectId } from "mongodb";
import { generateDailyLogs, generateWeeklyLogs, generateMonthlyLogs, generateCustomDateLogs } from "../helpers/GenerateLogs";
import User from "../models/User";

import { findUserId } from "../helpers/FindUserId";
import Notification from "../models/Notification";

const router: Router = Router()

router.get("/", async (req: Request, res: Response):Promise<any> => {
    res.send("Task route is working...!")
})

router.delete("/", async (req: Request, res: Response): Promise<any> => {
  try{
    const {taskId, userId} = req.body

    if(!taskId) {
        return res
              .status(400)
              .json(
                  { 
                    success: false,
                    data: [],
                    message: "Task ID is required.",
                  }
              )
    }

    const [ deletedTaskDetails, deletedTaskLogs ] = await Promise.all([
        Task.deleteOne({_id: taskId}),
        TaskLog.deleteOne({taskId})
    ])

    const updatedUserDetails = await User.updateOne({_id: userId}, {$pull: {tasks: taskId}})
    console.log("Updated user details: ",updatedUserDetails) //updatedUserDetails

    if( deletedTaskDetails.deletedCount === 0 && deletedTaskLogs.deletedCount === 0 ) {
        return res
              .status(404)
              .json(
                  { 
                    success: false,
                    data: [],
                    message : "No task or task logs found to delete. "
                  }
              )
    }

    if( deletedTaskLogs.deletedCount === 0) {
        return res
              .status(404)
              .json(
                  { 
                    success: false,
                    data: [],
                    message : "Task Log deleted, but Task was not found. "
                  }
              )
    }

    if( deletedTaskDetails.deletedCount === 0 ) {
        return res
              .status(404)
              .json(
                  { 
                    success: false,
                    data: [], 
                    message : "Task deleted, but Task Log was not found. "
                  }
        )
    }

    return res
          .status(200)
          .json(
              { 
                success: true,
                data: [],
                message: "Task deleted successfully" 
              })

}catch(error){
    console.error("Error deleting task:", error);
    
    return res
    .status(500).json(
    { message: "An error occurred while deleting the task." }
    )
}
})

router.post("/new-task", async (req: Request, res: Response):Promise<any> => {
        try {
            const {userId, taskName, taskDescription, frequencyType, frequency, from, end, taskType, accountabilityPartner} = req.body;
            console.log("body: ", userId, taskName, taskDescription, frequencyType, frequency, from, end, taskType, accountabilityPartner)
    
    
        const parsedFrom = new Date(from)
        const parsedEnd = end ? new Date(end) : null
    
        const validatedData = taskSchema.parse({
          taskName, 
          taskDescription, 
          frequencyType, 
          frequency, 
          from: parsedFrom, 
          end: parsedEnd, 
          taskType, 
          accountabilityPartner
        });
        console.log("validated Data: ", validatedData)
    
        const newTask = await new Task({
          userId,
          name: validatedData.taskName,
          description: validatedData.taskDescription,
          taskFrequency: validatedData.frequencyType,
          frequency: validatedData.frequency,
          type: validatedData.taskType,
          accountabilityPartner: validatedData.accountabilityPartner,
          startDate: validatedData.from,
          endDate: validatedData.end
        })
        const savedNewTask = await newTask.save() 

        // ✅ Schedule the task
        //await agenda.create("taskLog", { taskName: savedNewTask.name, taskId: savedNewTask._id }).repeatEvery("3 minutes").save();
    
        let logs: {date: string, status: string}[] = [] ;
        const currentDate = new Date();
        const startDate = new Date(validatedData.from);
        const endDate = validatedData.end ? new Date(validatedData.end) : null;
        
        if (validatedData.frequencyType === "daily") {
            logs = generateDailyLogs(startDate, endDate || currentDate )
            console.log("Logs to database: ", logs)
        }else if(validatedData.frequencyType === "weekly") {
            logs = generateWeeklyLogs(startDate, endDate || currentDate, validatedData.frequency as string[] )
            console.log("Logs to database (weekly): ", logs)
        }else if(validatedData.frequencyType === "monthly") {
            logs = generateMonthlyLogs( startDate, endDate || currentDate, validatedData.frequency as string[] )
            console.log("Logs to database (monthly): ", logs)
        }else if(validatedData.frequencyType === "custom") {
            logs = generateCustomDateLogs(validatedData.frequency as string[] )
            console.log("Logs to database (custom): ", logs)
        }
    
        
        const addedToLoggedInUserDocument = await User.findOneAndUpdate(
            {_id: new ObjectId(userId)}, 
            {
                $addToSet: { tasks: savedNewTask._id }, // Add to friends array without duplication
                $set: { updatedAt: new Date() }, // Optionally update the timestamp
            },
            { returnDocument: "after" } // Return the updated document
        )
        await addedToLoggedInUserDocument.save()
    
    
        const newTaskLog = await new TaskLog({
            taskId: savedNewTask._id,
            type: savedNewTask.taskFrequency,
            logs
         })
    
         await newTaskLog.save() 

         console.log("Intial logs added to task log: ", newTaskLog)
         
          
        return res.status(200).json({ success: true, data: {taskDetails: savedNewTask, taskLogs: newTaskLog} });
      } catch (error) {
        if (error) {
          return res.status(400).json({
            success: false,
            errors: error.errors
          });
        }
    
        console.error("Unhandled Error: ", error);
        return res.status(500).json({
          success: false,
          error: error,
          message: "Something went wrong."
        })
      }
})

router.post("/today-log", async (req: Request, res: Response):Promise<any> => {

  try {
    const { taskId, taskType, todayLog, buttonValue, accountabilityPartner, userId } = req.body;
    
    console.log("User ID: ", userId)
    console.log("Task ID: ", taskId);
    console.log("Button Value: ", buttonValue);
    console.log("Task Type: ", taskType);
    console.log("Today Log: ", todayLog);
    console.log("Accountability Partner: ", accountabilityPartner)

    const toUserId = await findUserId(accountabilityPartner)
    console.log("Logged In User ID: ", toUserId)

    let newLogStatus = ""

    if(buttonValue === "Mark") {
      newLogStatus = "completed"
    } else if(buttonValue === "Unmark") {
      newLogStatus = "task-pending"
    } else if(buttonValue === "Request") {
      newLogStatus = "approval-pending"
    } else if(buttonValue === "Reject") {
      newLogStatus = "task-pending"
    }

    if(!taskId || !taskType || !todayLog || !buttonValue || !userId ) {
      return res.status(400).json(
        { success: false, message: "No valid details provided." }
      );
    }

    if(taskType === "AT" && buttonValue === "Request") {
      const todayTaskApprovalRequest = new Notification({
        userId: toUserId,
        fromUserId: userId,
        taskId: taskId,
        date: todayLog.date,
        type: "task-approval",
        status: newLogStatus,
        message:"",
      })
      console.log("todayTaskApprovalRequest: ", todayTaskApprovalRequest)

      await todayTaskApprovalRequest.save()
    }
    
    if(taskType === "AT" && buttonValue === "Reject") {
      const removeTodayTaskApprovalRequest = await Notification.findOneAndDelete({
        userId: toUserId,
        fromUserId: userId,
        type: "task-approval", 
      })
    }

    const updatedTask = await TaskLog.findOneAndUpdate(
      { taskId: taskId },
        { $set: { "logs.$[log].status": newLogStatus } },
        {
          arrayFilters: [{ "log.date": todayLog.date }],
          new: true,
        } 
    )
    console.log("Updated Task: ", updatedTask)

    await updatedTask.save()


    
    return res.status(200).json({ success: true, data: updatedTask });

    
      
}catch (error) {
  console.error("Unhandled Error:", error instanceof Error ? error.message : error);

  return res.status(500).json(
    {
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : String(error),
    }
  );
}
})

router.post("/reject", async (req: Request, res: Response):Promise<any> => {
  try {
    const { notificationId } = req.body
    console.log("Notification ID: ", notificationId)

    const notification = await Notification.findOne({
      _id: notificationId
    })
    console.log("Notification: ", notification)

    if (!notification) {
      return res.status(404).json(
      { message: "Friend request not found." }
      );
    }

    const { taskId, date, fromUserId, userId } = notification

    const updatedTaskLog = await TaskLog.findOneAndUpdate(
      { taskId },
      { $set: { "logs.$[log].status": "task-pending" } },
        {
          arrayFilters: [{ "log.date": date }],
          new: true,
        } 
    )
    console.log("Updated Task: ", updatedTaskLog)

    if (!updatedTaskLog) {
      return res.status(404).json(
      { message: "Unable to update tasklog successfully." }
      );
    }

    await updatedTaskLog.save()

    console.log("From User ID: ", fromUserId)
    console.log("To User ID: ", userId)

    const updatedNotification = await Notification.findOneAndUpdate({
      _id: notificationId
    }, {
      $set: {
        userId: fromUserId,
        fromUserId: userId,
        status: "rejected"
      }
    })

    if (!updatedNotification) {
      return res.status(404).json(
      { message: "Unable to update notification after rejected." }
      );
    }

    await updatedNotification.save()

    return res.status(200).json(
      { message: "Friend request deleted successfully" }
    );
  } catch (error) {
    console.error("Error updating user's friends list:", error);
    return res.status(500).json(
      { error: "An internal server error occurred" }
    );
  }
})

router.post("/request-approval", async (req: Request, res: Response):Promise<any> => {
  try {
    const { notificationId } = req.body
    console.log("Notification ID: ", notificationId)

    const notification = await Notification.findOne({
      _id: notificationId
    })
    console.log("Notification: ", notification)

    if (!notification) {
      return res.status(404).json(
      { message: "Friend request not found." }
      );
    }

    const fromUserId = notification?.userId
    const toUserId = notification?.fromUserId
    console.log("From User ID: ", fromUserId)
    console.log("To User ID: ", toUserId)

    const updatedNotification = await Notification.findOneAndUpdate({
      _id: notificationId
    }, {
      $set: {
        userId: toUserId,
        fromUserId: fromUserId,
        status: "approval-pending"
      }
    })

    if (!updatedNotification) {
      return res.status(404).json(
      { message: "Unable to update notification after rejected." }
      );
    }

    await updatedNotification.save()

    return res.status(200).json(
      { message: "Task requested for approval successfully" }
    );
  } catch (error) {
    console.error("Error updating user's friends list:", error);
    return res.status(500).json(
      { error: "An internal server error occurred" }
    );
  }
})

router.post("/approve", async (req: Request, res: Response):Promise<any> => {  
  try {
    const { notificationId } = req.body
    console.log("Notification ID: ", notificationId)

    const notification = await Notification.findOne(
      { _id: notificationId }
    )

    if (!notification) {
      return res.status(404).json(
      { message: "Notification not found." }
      );
    }

    const { taskId, date } = notification

    const updatedTaskLog = await TaskLog.findOneAndUpdate(
      { taskId },
      { $set: { "logs.$[log].status": "completed" } },
        {
          arrayFilters: [{ "log.date": date }],
          new: true,
        } 
    )
    console.log("Updated Task: ", updatedTaskLog)

    if (!updatedTaskLog) {
      return res.status(404).json(
      { message: "Unable to update tasklog successfully." }
      );
    }

    await updatedTaskLog.save()

    await Notification.findOneAndDelete({ _id: notificationId })

    return res.status(200).json(
      { message: "Log approved successfully" }
    );
  } catch (error) {
    console.error("Error updating user's friends list:", error);
    return res.status(500).json(
      { error: "An internal server error occurred" }
    );
  }
})




export default router;

