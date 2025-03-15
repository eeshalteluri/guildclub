"use client";

import { Form, FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import SearchFriendCard from "@/components/SearchFriendCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import FriendCard from "@/components/FriendCard";
import RequestFriendCard from "@/components/RequestFriendCard";
import { useUser } from "@/contexts/UserContext";
import { useRequests } from "@/contexts/RequestContext";

interface FormData {
  username: string;
}

export interface requestData {
  name: string,
  username: string,
}

const FriendsPage = () => {
  const {user, setUser, token} = useUser()
  const { requests, setRequests } = useRequests();
  const [searchedUsername, setSearchedUsername] = useState("");
  const [searchedUser, setSearchedUser] = useState({ fullName: "", userName: ""});
  const form = useForm<FormData>();

  console.log("LoggedInUsername: ", user);
  const submitHandler = async (data: FormData) => {
    console.log(data);
    setSearchedUsername(data.username);

    const response = await fetch("https://guildclub-develop-backend.onrender.com/username/check-username", {
      method: "POST",
      headers: {
          Authorization: `Bearer ${token}`,
"Content-Type": "application/json",
        },
      body: JSON.stringify({
        username: data.username,
      }),
      
    });

    const userData = await response.json();
    console.log(userData);

    await setSearchedUser({
      fullName: userData.data?.name,
      userName: userData.data?.username,
    });
  };

  console.log("Total Requests: ", requests)

useEffect(() => {
  const fetchFriends = async() => {
    console.log("User friends fetching is intialized")

    if(!user?.username) return

    try{
    const response = await fetch(`https://guildclub-develop-backend.onrender.com/friend?username=${user?.username}`, {
      method: "GET",  
      headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
    })

    if (!response.ok) throw new Error("Failed to fetch friends");

    const { data } = await response.json();
    console.log("Friends Data: ", data)
   
    const fetchedFriends = data.friends

    setUser(user ? { ...user, friends: fetchedFriends } : user)

  }
  catch(error){
    console.error('Error fetching user:', error);
        return null;
  }
}
fetchFriends()
}, [])

useEffect(() => {
    const fetchRequests = async function getRequests() {
      console.log("Fetching User initiated...")
      try {    
        const response = await fetch(`https://guildclub-develop-backend.onrender.com/request`, {
            method: 'GET',
            headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
          });
    
        console.log("Response fetching Request: ", response)
    
        if (!response.ok) return null;
        
        const { requests } = await response.json();

        console.log("Requests: ", requests)
        setRequests(requests)
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    }

    fetchRequests()
}, [])

  // Render loading state while session is being fetched
  

  // If not logged in, you can handle that case (e.g., redirect or show an error message)
  if (!user) {
    return <div>You are not logged in. Please log in to access your friends.</div>;
  }

  return (
    <div className="h-full mx-2 mb-2 space-y-4">
      <div className="w-full flex justify-center items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)}>
            <FormLabel />
            <FormControl>
              <div className="flex items-center gap-2 mt-4">
                {/* Input Field */}
                <Input
                  placeholder="Search by @username"
                  className="w-64"
                  {...form.register("username")}
                />
                {/* Button Inline with Input */}
                <Button type="submit" className="flex-shrink-0">
                  <Search />
                </Button>
              </div>
            </FormControl>
          </form>
        </Form>
      </div>

      {searchedUsername && (
        <div className="space-y-2">
          <h3>Search results for &quot;{searchedUsername}&quot;</h3>
          {searchedUser.fullName ? (
            <SearchFriendCard
              loggedInUsername={user?.username}
              fullname={searchedUser.fullName}
              username={searchedUser.userName}
            />
          ) : (
            <p className="text-center bg-red-300 text-white rounded">
              User does not exist!
            </p>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Friends</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
        {
        user?.friends && user?.friends?.length > 0 ? 
          ( user?.friends.map(
            (friend) => (
              
              <FriendCard
                key={friend.username}
                fullname={friend.name}
                username={friend.username}
                loggedInUsername = {user?.username}
              />
            ))
          ) : 
          (
            <p className="text-center text-gray-500">You have no friends yet.</p>
          )
        }
          
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Friend Requests</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Requests Sent</CardTitle>
            </CardHeader>
            
            { requests?.sentRequests && requests?.sentRequests?.length > 0 ? (
              requests?.sentRequests.map((request: requestData) => (
              
              <CardContent key={request.username} className="space-y-2">
                <RequestFriendCard
                  fullname={request.name}
                  username={request.username}
                  type="sent"
                />
              </CardContent>
              ))
            ) : (
              <p className="mb-2 text-center text-gray-500">No friend requests sent.</p>
            )} 
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requests Received</CardTitle>
            </CardHeader>

            { requests?.receivedRequests && requests?.receivedRequests?.length > 0 ? (
              requests?.receivedRequests.map((request: requestData) => (
              
              <CardContent key={request.username} className="space-y-2">
                <RequestFriendCard
                  fullname={request.name}
                  username={request.username}
                  type="received"
                />
              </CardContent>
              ))
            ) : (
              <p className="mb-2 text-center text-gray-500">No friend requests received.</p>
            )} 
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendsPage;
