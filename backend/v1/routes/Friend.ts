import { Response, Router } from "express"
import User from "../models/User"
import Notification from "../models/Notification"
import { AuthenticatedRequest } from "passport";

import { findUserId, findUserDetails } from "../helpers/FindUserId"

const router: Router = Router()

router.get("/", async (req: AuthenticatedRequest, res: Response):Promise<any> => {
    const {username} = req.query
    console.log("Friend get route is working...!")

    try{
        if (!username) {
            return res.status(400).json(
            { error: "Username is required" }
            );
        }

        const user = await findUserDetails(username)
        console.log("User: ", user)

        if (!user) {
            return res.status(404).json(
            { error: "User with the provided username not found" }
            );
        }

        const populatedUser = await User.findById(user._id)
        .populate({
            path: "friends",
            select: "username name -_id", // Only get username and name, omit _id
        })
        .lean()
        console.log("Populated User: ", populatedUser)


        if (!populatedUser) {
            return res.status(404).json(
            { error: "User with the provided username not found" }
            );
        }

        return res.status(200).json(
            {
                success: true,
                message: "Friends fetched successfully",
                data: populatedUser,
            }
        )

    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error
        })
    }

})

router.post("/", async (req: AuthenticatedRequest, res: Response):Promise<any> => {
    console.log("Friend post route is working...!")

    try{
        const { username, loggedInUsername} = req.body
        console.log(username, loggedInUsername)

        if (!username || !loggedInUsername) {
            return res.status(400).json(
            { error: "Username and LoggedInUsername are required" }
            );
        }

        const user = await findUserDetails(username)
        console.log("User: ", user)

        const loggedInUser = await findUserDetails(loggedInUsername)
        console.log("User: ", user)
        

        if (!user) {
            return res.status(404).json(
            { error: "User with the provided username not found" }
            );
        }

        const isAlreadyFriend = user.friends.some(friend => friend.username === loggedInUsername);

        if (isAlreadyFriend) {
            
            console.log("User is already a friend!");
            console.log("Already Friend: ", isAlreadyFriend)

            return res.status(400).json({
                message: "Already friends"
            })
        }

        const addedToLoggedInUserDocument = await User.findOneAndUpdate(
            {username: loggedInUsername}, 
            {
                $addToSet: { friends: { username: user.username, name: user.name } }, // Add to friends array without duplication
                $set: { updatedAt: new Date() }, // Optionally update the timestamp
            },
            { returnDocument: "after" } // Return the updated document
        )
        const addedToUserDocument = await User.findOneAndUpdate(
            {username: username}, 
            {
                $addToSet: { friends: { username: loggedInUser.username, name: loggedInUser.name } }, // Add to friends array without duplication
                $set: { updatedAt: new Date() }, // Optionally update the timestamp
            },
            { returnDocument: "after" } // Return the updated document
        )

        const deleteTheNotification = await Notification.findOneAndDelete({
            userId: loggedInUser._id.toString() ,
            fromUserId: user._id.toString()
        })
        console.log(deleteTheNotification)

        if(!deleteTheNotification)
            {
                return res.status(400).json({
                    message: "Unable to delete the notifications"
                })
            }
        

        if (!addedToLoggedInUserDocument || !addedToUserDocument) {
            return res.status(500).json(
              { error: "Failed to update the user's friends list" }
            );
          }

        return res.status(200).json(
            { 
                message: "Friend added successfully",
                data: { username: user.username, name: user.name }
             }
          )
    }catch(error){
        console.error("Error updating user's friends list:", error);
        
        return res.status(500).json(
        { error: "An internal server error occurred" }
        )
    }
})

router.delete("/", async (req: AuthenticatedRequest, res: Response):Promise<any> => {
    try {
        const { username, loggedInUsername }: {username: string, loggedInUsername: string} = req.body
    
        if (!username || !loggedInUsername) {
          return res.status(400).json(
            { error: "Username and LoggedInUsername are required" }
          );
        }

        const user = await findUserDetails(username)
        const loggedInUser = await findUserDetails(loggedInUsername)

        console.log("Delete Request User ID: ", user)
        console.log("Delete Request Logged in User ID: ", loggedInUser)

    
        // Remove the friend object from the logged-in user's friends list
        const deletedFromLoggedInUserDocument = await User.findOneAndUpdate(
            { username: loggedInUsername },
            { 
                $pull: { friends: { username: user.username } },
                $set: { updatedAt: new Date() },
            }, // Ensure ObjectId
            { new: true } // Return the updated document
          );


    
        // Remove the logged-in user object from the friend's friends list
        const deletedFromUserDocument = await User.findOneAndUpdate(
          { username: username },
          {
            $pull: { friends: { username: loggedInUser.username } }, // Remove the object with matching username
            $set: { updatedAt: new Date() },
          },
          { returnDocument: "after" }
        );
    
        if (!deletedFromLoggedInUserDocument || !deletedFromUserDocument) {
          return res.status(500).json(
            { error: "Failed to update the user's friends list" }
          );
        }

        req.user.friends = req.user.friends.filter((friend) => friend.username !== username);
    
        return res.status(200).json({ message: "Friend deleted successfully" });
      } catch (error) {
        console.error("Error updating user's friends list:", error);
        return res.status(500).json(
          { error: "An internal server error occurred" }
        );
      }
})

router.post("/send-request", async (req: AuthenticatedRequest, res: Response):Promise<any> => {
    console.log("Friend's send request route is working...!")

    try{
        const { fromUsername, toUsername } = req.body

        const user = await findUserDetails(fromUsername)
        console.log("User: ", user)

        const isAlreadyFriend = user.friends.some(friend => friend.username === toUsername);

        if (isAlreadyFriend) {
            
            console.log("User is already a friend!");
            console.log("Already Friend: ", isAlreadyFriend)

            return res.status(400).json({
                message: "Already friends"
            })
        }

        const fromUserId = await findUserId(fromUsername)
        const toUserId = await findUserId(toUsername)

        if (!fromUserId || !toUserId) {
            return res.status(404).json({ error: "User(s) not found" });
        }

        

        const requestAlreadySentByYou = await Notification.findOne({
                userId: toUserId.toString(), // Convert to hex string
                fromUserId: fromUserId.toString(), // Convert to hex string
        })
        console.log(toUserId)
        console.log(requestAlreadySentByYou)

        if(requestAlreadySentByYou){
            return res.status(400).json(
            { message: "Friend request already sent." }
          )
        }

        
        const requestAlreadySentByThem = await Notification.findOne({
            userId: fromUserId.toString() ,
            fromUserId: toUserId.toString()
        })
        console.log(requestAlreadySentByThem)

        if(requestAlreadySentByThem){
            return res.status(400).json(
            { message: "The same person already sent you a request." }
          )
        }

        const newFriendRequest = new Notification({
            userId: toUserId,
            fromUserId: fromUserId,
            type: "friend-request",
            status: "request-pending",
            message:"",
        })

        await newFriendRequest.save()

        return res.status(201).json(
            { message: "Friend request sent successfully" }
          )

    }catch(error){
        console.error("Error sending friend request:", error);
    return res.status(500).json({ error: "Failed to send friend request" })
    }
})

export default router