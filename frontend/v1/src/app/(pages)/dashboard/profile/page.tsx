"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/UserContext"

const ProfilePage = () => {
  const {user, setUser} = useUser()
  const [ name , setName] = useState<string>(user?.name ?? "")
  const [username, setUsername] = useState<string>(user?.username ?? "")
  const [loading, setLoading] = useState<{ name: boolean; username: boolean, logout: boolean }>({
    name: false,
    username: false,
    logout: false
  })

  const router = useRouter()

  const handleChangeName = async () => {
    try{
      setLoading((prev) => ({ ...prev, name: true }))
    
        const response = await fetch("https://checkche-backend.vercel.app/user/update-name", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
        })

        if (response.ok) {
          console.log("Change name: ", name)
          setLoading((prev) => ({ ...prev, name: false }))
        } else {
          console.log("Change username failed")
        }

        const data = await response.json()
        console.log("Data of user from server after changing name: ",data)

        setUser(user ? { ...user, name} : user);

        console.log("User after changing name: ",user)
    }catch (error) {
      console.error("Change username error: ", error)
    }
  }
  
  const handleChangeUsername = async () => {
    
    try{
      setLoading((prev) => ({ ...prev, username: true }))
    
        const response = await fetch("https://checkche-backend.vercel.app/username/update-username", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
        })

        if (response.ok) {
          console.log("Change username: ", username)
          setLoading((prev) => ({ ...prev, username: false }))
        } else {
          console.log("Change username failed")
        }

        const data = await response.json()
        console.log("Data of user from server after changing username: ",data)

        setUser(user ? { ...user, username} : user);

        console.log("User after changing username: ",user)
    }catch (error) {
      console.error("Change username error: ", error)
    }

  }

  const handleLogout = async () => {
    try {
        const response = await fetch("https://checkche-backend.vercel.app/auth/logout", {
            method: "GET",
            credentials: "include", // Ensure cookies are sent with the request
        });

        console.log("Logout response: ", response);

        if (response.ok) {
            console.log("Logout successful")
           router.push("/") // Redirect manually in the frontend
        } else {
            console.log("Logout failed")
        }
    } catch (error) {
        console.error("Logout error: ", error)
    }
};

  return (
    <Card className="w-[350px] mt-4 mx-auto">
      <CardHeader>
        <CardTitle>Your Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <div className="flex gap-2 ">
              <Input 
                id="fullName" 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="Full Name"
                />
              <Button onClick={handleChangeName} disabled={loading.name}>Change Name</Button>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Username</Label>
              <div className="flex gap-2 ">
              <Input 
                id="userName" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                placeholder="@username" />
              <Button onClick={handleChangeUsername} disabled={loading.username}>Change Username</Button>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Email</Label>
              <div className="flex gap-2 ">
              <Input id="email" value={user?.email ?? ""} placeholder="email@example.com" disabled={true} readOnly/>

              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <Separator />
      <CardFooter className="mt-4 flex justify-between">
        <p>Looking to Log Out?</p>
        <Button 
        onClick={
          async ()=>
            { 
              console.log("Logout Initiated")
            handleLogout()
            }
        } >Log Out</Button>
      </CardFooter>
    </Card>
  )
}

export default ProfilePage