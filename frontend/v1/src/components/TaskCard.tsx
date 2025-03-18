"use client"

import { Flame, Info } from "lucide-react";
import { TaskCardHolder, CardHeader, CardTitle, CardContent } from "./TaskCardHolder";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { EllipsisVertical } from 'lucide-react';
import { FlagTriangleRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card";
import { Separator } from "../components/ui/separator";
import { useUser } from "@/contexts/UserContext";
import { useTaskData } from "@/contexts/TaskContext";

export interface TaskLog {
  _id: string;
  taskId: string;
  logs: { date: string; status: string }[];
}

export interface TaskDetails {
  _id: string;
  userId: string;
  name: string;
  description: string;
  taskFrequency: string;
  frequency: string[];
  type: string;
  accountabilityPartner: {
    name: string;
    username: string;
  };
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskLogType {
  taskLogs: TaskLog;
  taskDetails: TaskDetails;
}

interface TaskCardProps {
  task: TaskLogType;
}

const getDayOfYear = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 1); // January 1st of the same year
  const diffInMs = +date - +startOfYear; // Difference in milliseconds
  const dayOfYear = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1; // Convert ms to days
  return dayOfYear;
};

const getDateFromDayOfYear = (dayOfYear: number, year: number = new Date().getFullYear()): string => {
  const startOfYear = new Date(year, 0, 1); // January 1st of the given year
  const targetDate = new Date(startOfYear.getTime() + (dayOfYear - 1) * 24 * 60 * 60 * 1000); // Add days in milliseconds
  const day = String(targetDate.getDate()).padStart(2, '0'); // Get the day
  const month = String(targetDate.getMonth() + 1).padStart(2, '0'); // Get the month
  const formattedDate = `${day}-${month}-${year}`; // Format as "DD-MM-YYYY"
  return formattedDate;
};


const calculateStreaks = (taskLogs: TaskLog) => {
  // Sort logs by date
  const sortedLogs = taskLogs?.logs
    .map(log => ({ ...log, date: new Date(log.date) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort in ascending order

  let currentStreak = 0;
  let longestStreak = 0;
  let previousDay: number | null = null;

  for (let i = 0; i < sortedLogs?.length; i++) {
    const log = sortedLogs[i];
    const currentDay = getDayOfYear(log.date);

    if (log.status === "completed") {
      // If this is the first completed log or it's consecutive with the previous one
      if (previousDay === null || currentDay === previousDay + 1) {
        currentStreak++;
      } else {
        // Reset streak if days are not consecutive
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1; // Start a new streak
      }

      // Update previousDay to the current day
      previousDay = currentDay;
    } else {
      // Update longest streak if current streak ends
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 0; // Reset streak for non-completed status
      previousDay = null; // Reset previous day
    }
  }

  // Ensure to compare last streak with longest streak
  longestStreak = Math.max(longestStreak, currentStreak);

  return { currentStreak, longestStreak };
}

type MarkButtonValue = "Mark" | "Unmark" | "Request" | "Reject";
type TodayTempLogColorValue = "bg-green-300" | "bg-lime-300" |"bg-yellow-300" | "bg-red-300" | "bg-gray-200";

const TaskCard: React.FC<TaskCardProps> = (taskData) => {
  const { user, setUser, token } = useUser();
  const {tasksData, setTasksData} = useTaskData();
  const [ markButtonValue, setMarkButtonValue ] = useState<MarkButtonValue>();
  const [todayTempLogColor, setTodayTempLogColor] = useState<TodayTempLogColorValue>("bg-gray-200");

  console.log("rendering Task Card...")
  console.log("Task data: ", taskData);
  const taskDetails = taskData.task.taskDetails;
  const taskLogs = taskData.task.taskLogs;

    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    const isoDate = date.toISOString();

    console.log("ISO Date: ", isoDate)
    console.log("Task Logs: ", taskLogs?.logs);


    const doesTodayExist = taskLogs?.logs?.find((log) => {
      return log.date === isoDate
    });
    
    console.log("Does today exist: ", doesTodayExist)
    const todayTempLogStatus = doesTodayExist?.status
    console.log("Today Temp Log Status: ", todayTempLogStatus)

    useEffect(() => {
      if(taskDetails?.type === "NT"){
        setMarkButtonValue("Mark")
      }else if(taskDetails?.type === "NT" && doesTodayExist?.status === "completed"){
        setMarkButtonValue("Unmark")
      }else if(taskDetails?.type === "AT"){
        setMarkButtonValue("Request")
      }else if(taskDetails?.type === "AT" && doesTodayExist?.status === "approval-pending"){
        setMarkButtonValue("Reject")
      }
    }, [])

    useEffect(() => {
      if(todayTempLogStatus){
        setTodayTempLogColor(getStatusColor(todayTempLogStatus))
      }else{
        setTodayTempLogColor("bg-gray-200")
      }
    }, [])

    const getStatusColor = (status: string | undefined) => {
      switch (status) {
        case "completed":
          return "bg-green-300";
        case "task-pending":
          return "bg-yellow-300";
        case "approval-pending":
          return "bg-lime-300";
        case "missed":
          return "bg-red-300";
        default:
          return "bg-gray-200";
      }
    };

  // Step 1: Create the ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Step 2: Scroll to the end when the component is mounted
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollLeft = scrollContainer.scrollWidth; // Scroll to the end
    }
  }, []); // Empty dependency array to run this effect once

  const start = getDayOfYear(new Date(taskDetails?.startDate));
  const end = getDayOfYear(new Date(taskDetails?.endDate || new Date()))

  console.log("startDay: ", start)
  console.log("endDay: ", end)

  const streak = calculateStreaks(taskLogs)

    const handleTodayLog = async (LogStatus: string) => {
      console.log("Mark Button Value: ", markButtonValue)

      if(taskDetails?.type === "AT" && LogStatus) {
        setMarkButtonValue(prev => { const updatedValue = prev === "Request" ? "Reject" : "Request"; console.log("Updated Button Value: ", updatedValue); return updatedValue })
        console.log("Mark Button Value: ", markButtonValue)
      }else if(taskDetails?.type === "NT" && LogStatus) {
        setMarkButtonValue(prev => { const updatedValue = ( prev === "Mark" ? "Unmark" : "Mark"); console.log("Updated Button Value: ", updatedValue); return updatedValue })
        console.log("Mark Button Value: ", markButtonValue)
      }
  
      if(markButtonValue === "Mark") {
        const LogColor = "bg-green-300"
        setTodayTempLogColor(LogColor)
      }else if(markButtonValue === "Unmark") {
        const LogColor = "bg-yellow-300"
        setTodayTempLogColor(LogColor)
      }else if(markButtonValue === "Request") {
        const LogColor = "bg-lime-300"
        setTodayTempLogColor(LogColor)
      }else if(markButtonValue === "Reject") {
        const LogColor = "bg-yellow-300"
        setTodayTempLogColor(LogColor)
      }
  
      try {
          const response = await fetch(`https://guildclub-develop-backend.onrender.com/task/today-log`, {
              method: "POST",
              headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
              body: JSON.stringify({ taskId: taskDetails?._id, taskType: taskDetails?.type, todayLog: doesTodayExist, buttonValue: markButtonValue, accountabilityPartner: taskDetails?.accountabilityPartner?.username, userId: taskDetails?.userId }),
          });
  
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json(); // Assuming the response is JSON
          console.log("Today's Log Response Data: ", data)
          console.log("Task agenda successfully started:");
      }catch(error) {
          console.error("Error handling today's task:", error);
      }
  }

  const handleDelete = async (taskId: string, userId: string) => {
    try{
      const response = await fetch("https://guildclub-develop-backend.onrender.com/task", {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({taskId, userId})
      })

      if(response.ok) {
        const result = await response.json()
        console.log(result.message)
        setUser(user  ? { ...user, tasks: user.tasks.filter(task => task != taskId) } : user );
        setTasksData(tasksData ? tasksData.filter(task => task?.taskDetails?._id != taskId) : []);
        }else{
        const error = await response.json()
        console.log(`Error: ${error.message}`)
      }
    }catch(error){
      console.error("Error deleting Task: ", error)
    }
  }

  return (
    <TaskCardHolder className="mx-2 mt-2 ">
      <CardHeader className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-10 ">
        <div className="flex justify-start items-center gap-2">
          <CardTitle className="max-w-[80px] py-1 truncate" title={taskDetails?.name}>{taskDetails?.name}</CardTitle>
          {/* Use HoverCard for larger screens and Popover for smaller screens */}
          <div className="hidden sm:block">
            <HoverCard>
              <HoverCardTrigger>
                <Info className="w-4 h-4" />
              </HoverCardTrigger>
              <HoverCardContent className="p-4 space-y-2 max-w-sm">
              <div className="flex items-center">
                <span className="font-medium text-sm text-gray-500">Type:</span>
                <p className="ml-2 text-sm">{taskDetails?.description}</p>
              </div>

              <div className="flex items-center">
                <span className="font-medium text-sm text-gray-500">Task Frequency:</span>
                <p className="ml-2 text-sm">{taskDetails?.taskFrequency.charAt(0).toUpperCase() + taskDetails?.taskFrequency.slice(1)}</p>
              </div>

              <div className="flex items-center">
                <span className="font-medium text-sm text-gray-500">Frequency:</span>
                <p className="ml-2 text-sm">
                  {taskDetails?.frequency.map((freq, index) => (
                    <span key={index}>{freq.charAt(0).toUpperCase() + freq.slice(1)}{index < taskDetails?.frequency.length - 1 ? ", " : ""}</span>
                  ))}
                </p>
              </div>

              <div className="flex items-center">
                <span className="font-medium text-sm text-gray-500">Type:</span>
                <p className="ml-2 text-sm">{taskDetails?.type === "NT" ? "Normal Task" : "Accountability Task"}</p>
              </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          <div className="sm:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Info className="w-4 h-4" />
              </PopoverTrigger>
              <PopoverContent className=" max-w-[280px] xs:max-w-[350px] md:w-fit m-2 p-2">

             { 
             taskDetails?.description && 
             <>
             <div className=" flex justify-start items-start">
                <p className="w-[300px] md:w-full ml-2 text-sm">{taskDetails?.description}</p>
              </div>

              <Separator className="my-2"/>
              </>
              }

              {taskDetails?.taskFrequency && 
                <>
                  <div className="flex items-center">
                    <span className="font-medium text-sm text-gray-500">Task Frequency:</span>
                    <p className="ml-2 text-sm">{taskDetails?.taskFrequency.charAt(0).toUpperCase() + taskDetails?.taskFrequency.slice(1)}</p>
                  </div>
                </>
              }

              {taskDetails?.taskFrequency != "custom" && taskDetails?.frequency.length > 0 && (
                <>
                  <div className="flex items-start">
                    <span className="font-medium text-sm text-gray-500">Frequency:</span>
                    <p className="ml-2 text-sm">
                      {taskDetails?.frequency
                        .slice() // Make a copy of the array to avoid mutating the original
                        .sort((a, b) => {
                          // Check if both are numbers
                          const numA = parseInt(a, 10);
                          const numB = parseInt(b, 10);

                          // If both are valid numbers, sort numerically
                          if (!isNaN(numA) && !isNaN(numB)) {
                            return numA - numB;
                          }

                          // Otherwise, keep the original order
                          return 0;
                        })
                        .map((freq, index) => (
                          <span key={index}>
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                            {index < taskDetails?.frequency.length - 1 ? ", " : ""}
                          </span>
                        ))}
                    </p>
                  </div>
                </>
              )}
              {taskDetails?.taskFrequency === "custom" && taskDetails?.frequency.length > 0 && (
  <>
    <div className="flex items-start">
      <span className="font-medium text-sm text-gray-500">Frequency:</span>
      <p className="ml-2 text-sm">
        {taskDetails?.frequency
          .slice() // Make a copy of the array to avoid mutating the original
          .sort((a, b) => {
            // Convert to Date objects for comparison
            const dateA = new Date(a).getTime();
            const dateB = new Date(b).getTime();

            return dateA - dateB; // Sort numerically by date
          })
          .map((freq, index) => {
            const date = new Date(freq); // Convert string to Date object

            // Format the date as "DD MMM YYYY"
            const formattedDate = date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short", // Abbreviated month
            });

            return (
              <span key={index}>
                {formattedDate}
                {index < taskDetails?.frequency.length - 1 ? ", " : ""}
              </span>
            );
          })}
      </p>
    </div>
  </>
)}
              {taskDetails?.type && 
                <>
                <div className="flex items-center">
                  <span className="font-medium text-sm text-gray-500">Type:</span>
                  <p className="ml-2 text-sm">{taskDetails?.type === "NT" ? "Normal Task" : "Accountability Task"}</p>
                </div>
                </>}
              </PopoverContent>
            </Popover>
          </div>
          
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center text-sm">
              {streak.currentStreak ? <p>{streak.currentStreak}</p>: <p>-</p>}
              <Flame className="w-5 h-5 text-orange-500" />
            </div>

            <p className="w-fit text-xs text-gray-500">Curr.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center text-sm">
            {streak.longestStreak ? <p>{streak.longestStreak}</p>: <p>-</p>}
              <Flame className="w-5 h-5 text-orange-500" />
            </div>

            <p className="w-fit text-xs text-gray-500">Long.</p>
          </div>
        </div>
        </div>

        <div className="flex justify-center items-center">
          <Button className="" onClick={() => handleTodayLog(todayTempLogStatus!)} disabled={!doesTodayExist || (taskDetails?.type === "AT" && doesTodayExist?.status==="completed") }>{markButtonValue}</Button>
          <Popover>
            <PopoverTrigger asChild>
              <EllipsisVertical />
            </PopoverTrigger>

            <PopoverContent className="w-fit m-2 p-2">
              <div className="flex gap-2">
                <Button size={"sm"}>Edit task</Button>
                <Button size={"sm"} onClick={() => handleDelete(taskDetails?._id, taskDetails?.userId)}>Delete</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>

      <CardContent  ref={scrollContainerRef} className="w-full overflow-x-auto overflow-y-hidden">
        <div className="w-fit overflow-x-auto overflow-y-hidden grid grid-flow-col grid-rows-7 gap-x-[1px] gap-y-[1px]">
          
          {Array.from({ length: end-1 }).map((_, index) => {
                      const currentDay = index + 1;
                      const currentDate = getDateFromDayOfYear(currentDay)
                      let colorClass = "bg-gray-200"; // Default color for days before start
                      // Find log for this day
                      const logForDay = taskLogs?.logs?.find(
                        (log) => getDayOfYear(new Date(log.date)) === currentDay
                      )
          
                      if (currentDay >= start && currentDay < end) {
                        // Use log status if available
                        if (logForDay) {
                          colorClass = getStatusColor(logForDay.status)
                        }
                      }
          
                      return (
                        <HoverCard key={index}>
                          <HoverCardTrigger>
                            <div
                              className={`w-[14px] h-[14px] rounded-sm ${colorClass} relative flex justify-center items-center`}
                            >
                              {currentDay === start && (
                                
                                <FlagTriangleRight className="w-3 h-3 absolute text-center text-blue-500"/>
                              )}
                            </div>
                          </HoverCardTrigger>
          
                          <HoverCardContent>
                            <p>{currentDate}</p>
                            <p>{logForDay ? logForDay.status : "-"}</p>
                          </HoverCardContent>
                        </HoverCard>
                      );
                    })}

          <HoverCard>
            <HoverCardTrigger>
              <div
                className={`w-[14px] h-[14px] rounded-sm ${todayTempLogColor} relative flex justify-center items-center`}
              >
              </div>
            </HoverCardTrigger>

            <HoverCardContent>
              <p>12-01-2025</p>
              <p>Pending</p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </CardContent>
    </TaskCardHolder>
  );
};

export default TaskCard;
