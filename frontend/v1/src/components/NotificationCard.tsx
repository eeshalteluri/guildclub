import { Card } from "./ui/card"
import { Button } from "./ui/button"

type TaskApprovalCardProps = {
  _id: string;
  status: string;
  fullName: string;
  taskName: string;
  date: string;
};

const approveTask = async(_id: string) => {
  try{
    const repsonse = await fetch("http://localhost:5000/task/approve", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationId: _id
      }),
    })
  }catch(error){
    console.log("Error: ",error)
  }
}

const reApproveTask = async(_id: string) => {
  const repsonse = await fetch("http://localhost:5000/task/request-approval", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      notificationId: _id
    }),
  })
}

const rejectTask = async(_id: string) => {
  const repsonse = await fetch("http://localhost:5000/task/reject", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      notificationId: _id
    }),
  })
}

const NotificationCard = ({ _id, fullName, taskName, date, status }: TaskApprovalCardProps) => {
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
