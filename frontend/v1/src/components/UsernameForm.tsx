"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useUser } from "@/contexts/UserContext"
import { toast } from 'react-hot-toast'
import { Ban, Check, Loader } from "lucide-react"
  

const ClaimUsername = ({ onUpdate }: { onUpdate: () => void }) => {
  const {user, setUser, token} = useUser()
  const [username, setUsername] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isOpen, setIsOpen] = useState(false)  // Add this for dialog control
  
  const checkUsername = async () => {
    if (username.trim() === "") {
      setIsAvailable(null);
      return;
    }

    setLoading(true);
    try {
      console.log("Checking username:", username.trim())
      const response = await fetch("http://localhost:5000/username/check-username", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.trim() })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setIsAvailable(data.availability);
    } catch (error) {
      console.error("Error checking username:", error);
      toast.error("Failed to check username availability");
      setIsAvailable(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (username) checkUsername();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/username/claim-username", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json()
      console.log("Response:", data)
      
      if (!response.ok) {
        toast.error(data.message || "Failed to update username")
        return;
      }

      toast.success("Username updated successfully!")
      onUpdate();
      setUser(user ? { ...user, username} : user);
      setIsOpen(false);  // Close dialog after success
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl m-2 p-4 bg-red-100 rounded flex justify-between items-center gap-4">
      <p>Add <span className="font-bold">username</span> to be discovered by your friends.</p>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-red-500 text-white">
            Claim Username
          </Button>
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
                  className="col-span-3" 
                />
              </div>
            </div>
            {isLoading && <p className="flex gap-2 text-gray-400"><Loader className="animate-spin"/>Checking availability...</p>}
            {!isLoading && isAvailable === false && <p className="text-red-400 flex gap-2"><Ban/> Username already taken</p>}
            {!isLoading && isAvailable === true && <p className="text-green-400 flex gap-2"><Check/> Username available</p>}
            <DialogFooter className="pt-2 flex justify-end">
              <Button 
                type="submit"
                disabled={isLoading || !isAvailable}
                className="bg-red-500 text-white"
              >
                {isLoading ? 'Claiming...' : 'Claim'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ClaimUsername