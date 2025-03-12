import {
    Card,
    CardTitle,
    CardDescription,
  } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useRequests } from "@/contexts/RequestContext";
  
  const RequestFriendCard = ({ fullname, username, type }: { fullname: string, username: string, type: string }) => {
    const { user, setUser } = useUser();
    const { requests, setRequests } = useRequests();
    const [ isClicked, setIsClicked ] = useState<boolean>(false)

    console.log("Type: ", type)
    console.log("To Username: ", username)
    console.log("From Username: ", user?.username)
    console.log("Is Clicked value: ", isClicked)

    const deleteRequest = async ( fromUsername: string, toUsername: string, type: string ) => {
      console.log("Delete Request: ", fromUsername, toUsername)

      try{
        const response = await fetch("https://guildclub-backend.vercel.app/request/friend-request",{
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fromUsername, toUsername
          })
        })

        const data = await response.json()

        if(type === "sent"){
          console.log("Before update:", requests?.sentRequests);

          setRequests( requests ? {...requests, sentRequests: requests?.sentRequests?.filter(
            (request) => request.username !== toUsername
          )} : requests);

          console.log("After Update: ", requests?.sentRequests);
        }else{
            console.log("Before update:", requests?.receivedRequests);
  
            setRequests( requests ? {...requests, receivedRequests: requests?.receivedRequests?.filter(
              (request) => request.username !== fromUsername
            )} : requests);
  
            console.log("After update:", requests?.receivedRequests);
          }

        console.log("Delete received request: ", data)
        console.log("Delete received request: ",data)
        
      }catch(error){
      console.error("Error deleting friend request:", error)
      }
      
    }

    const handleDeleteClick = async () => {
      setIsClicked(true);
      console.log("Delete Clicked")
      console.log("User.Username: ", user?.username)
      console.log("Username: ", username)

      if(user){
        await deleteRequest(
          type === "received" ? username : user?.username,
          type === "sent" ?  username : user?.username,
          type
        );
      }

      setIsClicked(false);
    }

    const addFriend = async (username: string, loggedInUsername: string | undefined , loggedInUserFullname: string | undefined) => {
      console.log("Add Friend: ", username, loggedInUsername, loggedInUserFullname)

      try{
        const response = await fetch("https://guildclub-backend.vercel.app/friend",{
          "method": "POST",
          "credentials": "include",
          "headers": {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            loggedInUsername,
            loggedInUserFullname
          })
        })

        const data = await response.json()
        console.log("Add friend response: ", data)

       if(response.ok){
        const setUsername = data.data.username
        const setName = data.data.name

        console.log("Add Friend: ",data)
        setRequests( requests ? {...requests, receivedRequests: requests?.receivedRequests?.filter(
          (request) => request.username !== setUsername
        )} : requests);
        setUser(user ? { ...user, friends: [...user.friends, {username: setUsername, name: setName }] } : user)
       }

        }catch(error){
        console.error("Error adding friend:", error)
        }
    }

    return (
      <Card className={`w-full p-4 flex ${type == "sent"? "flex-row" : "flex-col"} jusify-between items-center`}>
          <div className="flex-1 space-y-1 mb-2 text-center">
            <CardTitle>{fullname}</CardTitle>
            <CardDescription>{username}</CardDescription>
          </div>
          
          <div className="flex gap-2">
          {type == "received" && <Button onClick={() => addFriend(username, user?.username, user?.name) }>Accept</Button>}
          <Button onClick={handleDeleteClick}>Delete</Button>
          </div>
      </Card>
    );
  };
  
  export default RequestFriendCard;
  