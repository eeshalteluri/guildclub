"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // for query params
import { useUser } from '@/contexts/UserContext';
import { useTaskData } from "@/contexts/TaskContext";
import ClaimUsername from "@/components/UsernameForm";
import Sidebar from "@/components/Sidebar";
import TaskCard from "@/components/TaskCard";

export default function Dashboard() {
  const { user, setUser, setToken } = useUser();
  const { tasksData, setTasksData } = useTaskData();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook for reading query params

  console.log("Dashboard Page User Data: ", user);

  useEffect(() => {
    // Get token from URL query params
    const tokenFromQuery = searchParams.get("token");

    if (tokenFromQuery) {
      console.log("Token from URL: ", tokenFromQuery);
      localStorage.setItem("token", tokenFromQuery);
      router.replace("/dashboard"); // clean the URL (remove token param)
    }

    const JWTtoken = localStorage.getItem("token");
    

    if (!JWTtoken) {
      router.push("/");
    }

    if (JWTtoken) {
      setToken(JWTtoken); // Update token in context
    }

      const fetchUser = async () => {
        try {
          const response = await fetch("https://guildclub-develop-backend.onrender.com/auth/user", {
            headers: {
              Authorization: `Bearer ${JWTtoken}`,
            },
          });
  
          if (response.ok) {
            const { data } = await response.json();
            console.log('Fetched User: ', data);
            setUser(data);
          } else {
            console.error("Failed to fetch user", response.statusText);
            router.push("/");
          }
        } catch (error) {
          console.error("Error fetching user", error);
          router.push("/");
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchUser();
    }, []);

  // Fetch task logs based on user tasks
  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchTaskLogs(taskIds: string[]) {
      try {
        if (taskIds && taskIds.length > 0) {
          const response = await fetch(`https://guildclub-develop-backend.onrender.com/auth/task-data-and-logs?taskIds=${taskIds}`, {
            headers: {
          Authorization: `Bearer ${token}`,
"Content-Type": "application/json",
        },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Fetched Task Logs: ", data);
            setTasksData(data.tasksLogsData);
          } else {
            console.error("Failed to fetch tasks", response.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching tasks", error);
      }
    }

    if (user?.tasks?.length) {
      fetchTaskLogs(user.tasks);
    }

  }, [user]);

  if (isLoading) return <div>Loading...</div>;

  if (!user) return <div>Please log in to view this page</div>;

  const handleUserUpdate = () => { /* if needed in the future */ };

  return (
    <div>
      <h1 className="mx-2 mt-1">Welcome {user.name}!</h1>
      <div className="mx-2 flex">
        <Sidebar />
        <div className="flex-1">
          {user?.username ? (
            <p className="font-italic text-sm text-gray-500">@{user.username}</p>
          ) : (
            <div className="flex justify-center">
              <ClaimUsername onUpdate={handleUserUpdate} />
            </div>
          )}
        </div>
      </div>
      {Array.isArray(tasksData) && tasksData.length === 0 ? (
        <p className="text-center">no tasks found</p>
      ) : (
        tasksData?.map((taskData) => <TaskCard key={taskData?.taskDetails?._id} task={taskData} />)
      )}
    </div>
  );
}
