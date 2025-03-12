import {
  Card,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { UserMinus } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";

const FriendCard = ({fullname, username, loggedInUsername}: {fullname: string, username: string, loggedInUsername: string}) => {
  console.log("FriendCard being rendered...")
  
  const [isRemoving, setIsRemoving] = useState(false);
  const { user, setUser } = useUser()
  const removeFriend = async(username: string, loggedInUsername: string) => {
    setIsRemoving(true)
    try{
      const response =  await fetch("https://checkche-backend.vercel.app/friend",{
      method: "DELETE",
      credentials: "include",
      headers: {
      "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        loggedInUsername
      })
    })


    if (!response.ok) {
      // Handle errors returned by the server
      console.error("Failed to remove friend");
    } else {
      // Optionally refresh the UI or provide feedback
      setUser(user ? { ...user, friends: user.friends.filter(friend => friend.username !== username) } : user)
      console.log("Friend removed successfully");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    setIsRemoving(false); // Reset loading state
  }
    }

  return (
    <Card className="w-full p-4 flex jusify-between items-center">
        <div className="flex-1 space-y-1">
          <CardTitle>{fullname}</CardTitle>
          <CardDescription>@{username}</CardDescription>
        </div>
        
        <UserMinus onClick={() => removeFriend(username, loggedInUsername)} className={`text-red-500 cursor-pointer ${
          isRemoving ? "opacity-50 cursor-not-allowed" : ""
        }`}/>
    </Card>
  )
}

export default FriendCard;
