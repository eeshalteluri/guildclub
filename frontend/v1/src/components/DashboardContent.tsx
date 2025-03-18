"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from '@/contexts/UserContext';
import { useTaskData } from "@/contexts/TaskContext";
import ClaimUsername from "@/components/UsernameForm";
import Sidebar from "@/components/Sidebar";
import TaskCard from "@/components/TaskCard";

export default function Dashboard() {
  const { user, setUser, token, setToken } = useUser();
  const { tasksData, setTasksData } = useTaskData();
  const [isLoading, setIsLoading] = useState(true);
  const [tokenReady, setTokenReady] = useState(false); // ✅ token readiness
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromQuery = searchParams.get("token");

    if (tokenFromQuery) {
      console.log("Token from query:", tokenFromQuery);
      localStorage.setItem("token", tokenFromQuery);
      setToken(tokenFromQuery); // ✅ Set in context too
      router.replace("/dashboard"); // Clean URL
    }
  }, [searchParams]);

  useEffect(() => {
    const JWTtoken = localStorage.getItem("token");
    console.log("Token from localStorage:", JWTtoken);

    if (!JWTtoken) {
      router.push("/");
    } else {
      setToken(JWTtoken); // ✅ Set in context
      setTokenReady(true); // ✅ Mark token as ready
    }
  }, []);

  // ✅ Fetch user only when token is ready
  useEffect(() => {
    if (!tokenReady) return;

    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const { data } = await response.json();
          console.log("Fetched User:", data);
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          console.error("Failed to fetch user:", response.statusText);
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/");
      } finally {
        console.log("Fetch user done, ending loading state.");
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // ✅ Fetch tasks when user is set
  useEffect(() => {
    if (!user?.tasks || user.tasks.length === 0) return;

    async function fetchTaskLogs(taskIds: string[]) {
      try {
        const response = await fetch(`http://localhost:5000/auth/task-data-and-logs?taskIds=${taskIds}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Task Logs:", data);
          setTasksData(data.tasksLogsData);
        } else {
          console.error("Failed to fetch tasks:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    if (user?.tasks?.length) {
      fetchTaskLogs(user.tasks);
    }
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to view this page</div>;

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
              <ClaimUsername onUpdate={() => {}} />
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
