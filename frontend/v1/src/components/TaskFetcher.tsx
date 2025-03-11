"use client"; // Client component for periodic fetching

import { useEffect, useState } from "react";
import { useTaskData } from "@/contexts/TaskContext";

async function fetchTaskLogs(taskIds: string[]) {
    console.log("Fetching tasklogs initiated....")
    console.log("Fetching tasklog with the respective TaskIDs: ", taskIds)
  try {
    if (taskIds.length > 0) {
      console.log("Fetching Task Logs for:", taskIds);
      const response = await fetch("http://localhost:5000/task/tasklogs", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskIds }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetch Logs Data: ",data)
      return data.tasksLogsData || [];
    }
  } catch (error) {
    console.error("Error fetching Tasklogs:", error);
  }
  return [];
}

export default function TaskFetcher({ taskIds }: { taskIds: string[] }) {
  const { setTasksData } = useTaskData();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    async function updateTasks() {
      setIsFetching(true);
      const tasks = await fetchTaskLogs(taskIds);
      setTasksData(tasks);
      setIsFetching(false);
    }

    // Fetch initially
    updateTasks();

    // Set interval to fetch every 5 minutes (300,000 ms)
    const intervalId = setInterval(updateTasks, 300000);

    return () => clearInterval(intervalId);
  }, [taskIds, setTasksData]);

  return (
    <div>
      {isFetching ? <p>Updating tasks...</p> : <p></p>}
    </div>
  );
}
