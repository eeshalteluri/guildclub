"use client"

import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,

  DialogTrigger,
  DialogClose
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useState, useEffect } from "react"
import { toast } from 'react-hot-toast'; 

import { Ban, Check, Loader } from "lucide-react"
import { useUser } from "@/contexts/UserContext"
  

const ClaimUsername = () => {

  const { user, setUser} = useUser()
  const [username, setUsername] = useState("")
  const [isLoading, setLoading ] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  
  const updateSessionUsername = async (username: string) => {
    try {
      await setUser(user ? { ...user, username } : user); // Pass only the property you want to update
    } catch (error) {
      console.error("Failed to update session:", error);
    }
  }

    useEffect(() => {
    if(username.trim() === "") {
      setIsAvailable(null)
      return
    }

    
      const checkUsername = async () => {
        setLoading(true)

        try{
          const response = await fetch("/api/check-username", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({username})
          })

          const data = await response.json()

          if(response.ok){
            setIsAvailable(data.availability)
          }else{
            console.error("Error: ", data.error)
          }
        }catch(error){
          console.log("Error:", error)
        }finally{
          setLoading(false)
        }
      }

      checkUsername()

  }, [username])

  const handleSubmit = async (e: React.FormEvent)  => {
    e.preventDefault()

    if(user?.email){
      console.error("Error: User email not available")
    }

      toast.promise(
         fetch("/api/claim-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email, 
          username
        })

      })
      .then( async (response) => {
        const receivedResponse = await response.json()
        console.log("receivedResponse: ",receivedResponse)

        
        // Handle success and return the message for the toast
        if (response.ok) {
          await updateSessionUsername(receivedResponse.data.username)
          return receivedResponse.message; // return success message for toast
        } else {
          throw new Error(receivedResponse.error || "Error claiming username");
        }
      })
      .catch((error)=>{
        throw new Error(error.message || "Failed to update username")
      }),
    {
      loading: 'Updating username...',
      success:(message: string) => message,
      error: (error: Error) => error.message
    }   
  )
  }
  

  return (
    <div className="max-w-2xl m-2 p-4 bg-red-100 rounded flex justify-between items-center gap-4">
        <p>Add <span className="bold">username</span> to be discovered by your friends.</p>
        
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="bg-red-500 text-white">Claim Username</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Claim Username</DialogTitle>
                    
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 pt-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                            Username
                            </Label>
                            
                              <Input 
                              id="username"
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}  
                              placeholder="@michaeljackson" 
                              className="col-span-3" />
                            
                        </div>
                    </div>
                      {isLoading && <p className="flex gap-2 text-gray-400"><Loader/>Checking Availibility...</p>}
                      {!isLoading && isAvailable == false && <p className="text-red-400 flex gap-2"><Ban/> Username already taken</p>}
                      {!isLoading && isAvailable == true && <p className="text-green-400 flex gap-2"><Check/> Username available</p>}
                    <DialogFooter>
                    <DialogClose>
                        <Button 
                      type="submit"
                      disabled={isLoading || isAvailable == false}
                      className="bg-red-500 text-white"
                      >
                        Claim
                      </Button>
                    </DialogClose>
                    </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

    </div>
  )
}

export default ClaimUsername