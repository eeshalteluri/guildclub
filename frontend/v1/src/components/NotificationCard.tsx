"use client";
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { useUser } from "@/contexts/UserContext";

type TaskApprovalCardProps = {
  _id: string;
  status: string;
  fullName: string;
  taskName: string;
  date: string;
};



const NotificationCard = ({ _id, fullName, taskName, date, status }: TaskApprovalCardProps) => {
  const { token } = useUser();
  
  const approveTask = async(_id: string) => {
    try{
      const response = await fetch("https://guildclub-develop-backend.onrender.com/task/approve", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
          },
        body: JSON.stringify({
          notificationId: _id
        }),
      })
  
      console.log("Task Approval response: ", response)
    }catch(error){
      console.log("Error: ",error)
    }
  }
  
  const reApproveTask = async(_id: string) => {
    const response = await fetch("https://guildclub-develop-backend.onrender.com/task/request-approval", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        notificationId: _id
      }),
    })
  
    console.log("Task Request Approval response: ", response)
  }
  
  const rejectTask = async(_id: string) => {
    const response = await fetch("https://guildclub-develop-backend.onrender.com/task/reject", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        notificationId: _id
      }),
    })
  
    console.log("Task Rejection response: ", response)
  }
  
  if(status === "approval-pending"){
    return (
      <div>
        <Card className="p-2 mb-1">
          <div className="flex justify-between gap-2">
            <p className="w-[200px]">
              <span className="font-bold">{fullName}</span> requests your approval for{" "}
              <span className="font-bold">{taskName}</span> on{" "}
              <span className="font-bold">{date}</span>.
            </p>
  
            <div className="flex flex-col justify-center items-center gap-2">
              <Button onClick={() => approveTask(_id)} className="w-full">Approve</Button>
              <Button onClick={() => rejectTask(_id)} className="w-full" variant="outline">
                Reject
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if(status === "rejected"){
    return (
      <div>
        <Card className="p-2 mb-1">
          <div className="flex justify-between gap-2">
            <p className="w-[200px]">
              <span className="font-bold">{fullName}</span> rejected your request for{" "}
              <span className="font-bold">{taskName}</span> on{" "}
              <span className="font-bold">{date}</span>.
            </p>

            <div className="flex flex-col justify-center items-center gap-2">
              <Button onClick={() => reApproveTask(_id)} className="w-full">Request Again</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
};

export default NotificationCard;
