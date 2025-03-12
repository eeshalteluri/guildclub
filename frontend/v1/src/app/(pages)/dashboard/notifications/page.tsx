"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import NotificationCard from "@/components/NotificationCard";

interface NotificationResponseType {
  _id: string,
  status: string,
  fullName: string,
  taskName: string,
  date: string,
  userId: string,
  type: string,
  fromUserId: {_id: string, name: string},
  taskId: {_id: string, name: string},
  message: string,
}

interface NotificationType {
  _id: string,
  status: string,
  fullName: string,
  taskName: string,
  date: string
}

const NotificationPage = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const fetchNotifications = async () => {
    if (!user?._id) return; // Prevent API call if userId is missing
  
    try {
      const response = await fetch(`https://checkche-backend.vercel.app/notifications?userId=${user._id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      console.log("Notification Data: ", data)
  
      if (data.success) {
        // ✅ Transform notifications to required format
        const formattedNotifications = data.data.map((notification: NotificationResponseType) => ({
          _id: notification._id,
          fullName: notification.fromUserId?.name || "Unknown User", // ✅ Extract name
          taskName: notification.taskId?.name || "Unknown Task", // ✅ Extract task name (make sure taskId includes name in backend)
          date: new Date(notification.date).toLocaleDateString(), // ✅ Format date
          status: notification.status
        }));

        console.log("Fetched Notifications: ", formattedNotifications)
        setNotifications(formattedNotifications); // ✅ Update state
      } else {
        console.error("Error fetching notifications:", data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    console.log("Notification Page User:", user);
    fetchNotifications();
  }, [user]);

  return (
    <div>
      {notifications?.length > 0 ? (
        notifications?.map((notification, index) => (
          <NotificationCard
            key={index}
            _id = {notification._id}
            fullName={ notification.fullName }
            taskName={ notification.taskName }
            date={ notification.date }
            status={notification.status}
          />
        ))
      ) : (
        <p>No notifications found.</p>
      )}
    </div>
  );
};

export default NotificationPage;
