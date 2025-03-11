import  { Request, Response , Router } from "express";
import { findUserId, findUserDetails } from "../helpers/FindUserId";
import Notification from "../models/Notification";
import User from "../models/User";
import NotificationType from "../types/notification";
import { AuthenticatedRequest } from "passport"

const router: Router = Router();

router.get("/",async (req: AuthenticatedRequest, res: Response):Promise<any> => {
    console.log("Request route is working...")

    try{   
        const username = req.user.username

        if(username){
            const findUser =  await findUserDetails(username)
    
            if (!findUser) {
                return res.status(404).json(
                { error: "User not found" }
                );
            }

            console.log("findUser: ", findUser)
          
        const requestsReceived = await Notification.find({userId: findUser._id})
        console.log("Requests received by user:", requestsReceived)
        
        const receivedRequests = await Promise.all(requestsReceived.map( async (request: NotificationType) => {
            const user = await User.findById(request.fromUserId)

            if(user){
            return { name: user.name, username: user.username, type: "received" }
            }

            return null
        }))
    
            console.log("Requested Users: ", receivedRequests)

        //Requests that are sent by the user

        const requestsSent = await Notification.find({fromUserId: findUser._id})
        console.log("Requests sent by user:", requestsSent)
        
                const sentRequests = await Promise.all(requestsSent.map( async (request: NotificationType) => {
            const user = await User.findById(request.userId) //findUserDetails

            if(user){
            return { name: user.name, username: user.username, type: "sent" }
            }

            return null
        }))
    
            console.log("Sent Users: ", sentRequests)
            console.log("All requests: ", [...receivedRequests, ...sentRequests])
            
            return res.status(200).json({
            message: "Requests received successfully",
            requests: { receivedRequests ,sentRequests }
        })        
        }
        }catch (error) {
            console.error("Error fetching requests sent:", error)
            return res.status(500).json(
              { error: "Failed to fetch requests sent" }
            )
          }
})

router.post("/friend-request", async (req: Request, res: Response):Promise<any> => {
    console.log("friend request route is hitting...!")

    try{
        const { fromUsername, toUsername } =  req.body

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
            status: "pending",
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

router.delete("/friend-request", async (req: Request, res: Response):Promise<any> => {
        console.log("friend request route is hitting...!")

    try{
        const { fromUsername, toUsername } =  req.body
        console.log("From Username: ", fromUsername)
        console.log("To Username: ", toUsername)

        const fromUserId = await findUserId(fromUsername)
        const toUserId = await findUserId(toUsername)

        console.log("From User Id: ", fromUserId)
        console.log("To User ID: ", toUserId)

        if (!fromUserId || !toUserId) {
            return res.status(404).json({ error: "User(s) not found" });
        }

        const deletedRequest = await Notification.findOneAndDelete({
            userId: toUserId,
            fromUserId: fromUserId, 
        })
        console.log(deletedRequest)

        if (!deletedRequest) {
            return res.status(404).json(
            { message: "Friend request not found." }
            );
        }
    
        return res.status(200).json(
            { message: "Friend request deleted successfully." }
        )

    }catch(error){
        console.error("Error sending friend request:", error);
        return res.status(500).json({ error: "Failed to send friend request" })
    }
})

router.get("/requests-received", async (req: Request, res: Response):Promise<any> => {
    try{
        
        const username = (req.query.username as string) ?? ""


        if(username){
            const findUser =  await findUserDetails(username)
    
            if (!findUser) {
                return res.status(404).json(
                { error: "User not found" }
                );
            }

            console.log("findUser: ", findUser)
        
        
    
        
        const requestsReceived = await Notification.find({userId: findUser._id})
        console.log("Requests sent by user:", requestsReceived)
        
        const requestedUsers = await Promise.all(requestsReceived.map( async (request: NotificationType) => {
            const user = await User.findById(request.fromUserId)

            if(user){
            return {name: user.name, username: user.username}
            }

            return null
        }))
    
            console.log("requestedusers: ", requestedUsers)
            
            return res.status(200).json({
            message: "Requests received successfully",
            requestedUsers: requestedUsers})        
        }
        }catch (error) {
            console.error("Error fetching requests sent:", error)
            return res.status(500).json(
              { error: "Failed to fetch requests sent" }
            )
          }
})

router.get("/requests-sent", async (req: Request, res: Response):Promise<any> => {
    try{
        
        const username = (req.query.username as string) ?? ""
        console.log("Requests sent username: ", username)

        if(username){
            const findUser =  await findUserDetails(username)
    
            if (!findUser) {
                return res.status(404).json(
                { error: "User not found" }
                );
            }

            console.log("findUser: ", findUser)
        
        const requestsSent = await Notification.find({fromUserId: findUser._id})
        console.log("Requests sent by user:", requestsSent)
        
             const requestedUsers = await Promise.all(requestsSent.map( async (request: NotificationType) => {
            const user = await User.findById(request.userId) //findUserDetails

            if(user){
            return {name: user.name, username: user.username}
            }

            return null
        }))
    
            console.log("requestedusers: ", requestedUsers) 
        return res.status(200).json({message: "testing route request sent!", requestedUsers: requestedUsers}) 
        }
        }catch (error) {
            console.error("Error fetching requests sent:", error)
            return res.status(500).json(
              { error: "Failed to fetch requests sent" }
            )
          }
})



export default router