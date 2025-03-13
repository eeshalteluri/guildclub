"use client"

import {
    Card,
    CardTitle,
    CardDescription,
  } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useRequests } from "@/contexts/RequestContext";

  
  const FriendCard = ({fullname, username, loggedInUsername}: {fullname: string, username: string, loggedInUsername: string}) => {
    const {user} = useUser()
    const { requests, setRequests } = useRequests()
    console.log(username, loggedInUsername)

    const sendFriendRequest = async () => {
      const response = await fetch("https://checkche-backend.onrender.com/friend/send-request", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          toUsername: username,
          fromUsername: loggedInUsername,
          }) 
        })

        if(response.ok){
          setRequests(
            requests
              ? { ...requests, sentRequests: [...requests.sentRequests, { name: fullname, username: username }] }
              : requests
          );
        }
        
        
      console.log("Friend Request Response: ",response)
    }

    const searchedThemself = () => {
      if(username == loggedInUsername) return true
      else return false
    }

    const isAlreadyFriend = () => {
      const isFriend = user?.friends.some(friend => friend.username === username)
      console.log("Is already friend: ", isFriend)
      return isFriend
    }

    return (
      <Card className="w-full p-4 flex jusify-between items-center">
          <div className="flex-1 space-y-1">
            <CardTitle>{fullname}</CardTitle>
            <CardDescription className="font-italic">@{username}</CardDescription>
          </div>
          
          <Button onClick={() =>{sendFriendRequest()}} disabled={searchedThemself() || isAlreadyFriend()}>Send Request</Button>
      </Card>
    );
  };
  
  export default FriendCard;
  