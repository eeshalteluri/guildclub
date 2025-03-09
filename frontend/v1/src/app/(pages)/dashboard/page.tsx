"use client";

import ClaimUsername from "@/components/UsernameForm";
import Sidebar from "@/components/Sidebar";
import TaskCard from "@/components/TaskCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from '@/contexts/UserContext';
import { useTaskData } from "@/contexts/TaskContext";

export default function Dashboard() {
  const { user, setUser } = useUser();
  const {tasksData} = useTaskData();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  console.log("Dashboard Page User Data: ", user)
  console.log("Dashboard Page Task Data: ", tasksData)

  const checkCookieExpiration = () => {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('connect.sid='));
    
    console.log('Checking cookie expiration');
    
    if (!authCookie) {
      router.push('/');
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
  
    const fetchUser = async () => {
      try {
        if(!user){
          console.log('Fetching user...');
          const response = await fetch("http://localhost:5000/auth/user", {
            credentials: 'include',
          });
          
  
          if (response.ok) {
            const data = await response.json();
            console.log('User data after fetching from server:', data);
            setUser(user? {...user as object, ...data}: data);
          } else {
            router.push('/');
          }
  
        intervalId = setInterval(checkCookieExpiration, 1800000);
        }
      } catch (error) {
        console.error('Error:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUser();
  
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []); // Dependency added to avoid refetching when user is already available
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view this page</div>;
  }

  // Pass this function to any component that updates user details
  const handleUserUpdate = () => {
    // This function is no longer needed as the user is fetched automatically
  };

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

      {/*<div className="flex justify-between align-center px-2 gap-2 h-[200px] xs:h-[250px]">
        <ProgressCard />
        <RemainingTasks />
      </div>*/}

      {/* Render TaskCard for each task */}
      {Array.isArray(tasksData) && tasksData.length === 0 ? (
        <p className="text-center">no tasks found</p>
      ) : (
        tasksData?.map((taskData) => <TaskCard key={taskData?.taskDetails._id} task={taskData} />)
      )}
    </div>
  );
}
