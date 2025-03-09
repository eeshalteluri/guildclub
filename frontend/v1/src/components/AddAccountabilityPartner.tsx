"use client"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";
import { ChevronRight } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";

import { Merge, FieldErrorsImpl } from "react-hook-form";

import {
  Card,
  CardTitle,
  CardDescription,
  } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { FieldError } from "react-hook-form";
import { useUser } from "@/contexts/UserContext";


interface AddAccountabilityPartnerProps {
  selectedPartner: {name: string, username: string}
  onPartnerSelect: (partner: {name: string, username: string}) => void;
  error?:  FieldError | Merge<FieldError, FieldErrorsImpl<{ name: string; username: string }>>
}

const AddAccountabilityPartner = ({ selectedPartner, onPartnerSelect, error }: AddAccountabilityPartnerProps) => {
  const { user } = useUser()
  const friends = user?.friends
  const [searchedPartner, setSearchedPartner] = useState<string>("");

  console.log("Friends: ", friends)

  const filteredFriends = friends?.filter(
    (friend: any) =>
      friend.name.toLowerCase().includes(searchedPartner.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchedPartner.toLowerCase())
  );

  const handleSelectPartner = (friend: any) => {
    onPartnerSelect(friend)
    console.log("Selected Partner:", friend); // You can send this data to an API or handle it as needed
  };

  return (
    <Drawer>
      <DrawerTrigger className= " w-full">
        <div className={`flex items-center justify-between p-2 border rounded ${!selectedPartner.username && error ? "border-red-500":""}`}>
          <Label htmlFor="title" className="text-right">
            Accountability Partner
          </Label>

          {selectedPartner.username ? <Badge className="max-w-25">{selectedPartner?.username}</Badge>: <ChevronRight /> }
        </div>
      </DrawerTrigger>
      <DrawerContent className="">
        <DrawerHeader>
          <DrawerTitle>Select your Partner</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>

        <div className="mx-4">
          <Input
            value={searchedPartner}
            onChange={(e) => setSearchedPartner(e.target.value)}
            placeholder="Add from your friends"
          />

          <div className="max-h-[250px] overflow-scroll mt-2">
            {Array.isArray(filteredFriends) && filteredFriends.length > 0 ? (
              filteredFriends.map((friend: any) => (
                <Card
                  key={friend._id}
                  className="w-full p-4 mb-1 flex justify-between items-center"
                >
                  <div className="flex-1 space-y-1">
                    <CardTitle>{friend.name}</CardTitle>
                    <CardDescription>@{friend.username}</CardDescription>
                  </div>

                  <DrawerClose>
                    <div  className="bg-primary text-secondary px-4 py-2 rounded-md" onClick={() => handleSelectPartner(friend)}>
                      Add
                    </div>
                  </DrawerClose>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">No friends available</p>
            )}
          </div>
        </div>

        <DrawerFooter>
          {selectedPartner.username && (
            <div className="text-sm text-gray-600">
              Selected Partner: {selectedPartner.name} (@{selectedPartner.username})
            </div>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddAccountabilityPartner;
