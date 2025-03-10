import express from "express"
import authRoutes from "./Auth"
import usernameRoutes from "./Username"
import userRoutes from "./User"
import requestRoutes from "./Request"
import friendRoutes from "./Friend"
import notificationRoutes from "./Notification"
import checkLoggedIn from "../middlewares/IsLoggedIn"
import taskRoutes from "./Task"

const router = express.Router()

router.get("/", (req, res) => {
    res.send("Express server is running...!")
})


router.get("/api/v1", (req, res) => {
    try{
        res
        .status(200)
        .json({
            status: "success",
            data: [],
            message: "Welcome to version 1 of the application!"
        })
    }catch(error){
        res
        .status(500)
        .json({
            status: "error",
            data: [],
            message: "Internal server Error"
        })
    }
})

router.use("/auth", authRoutes)
router.use("/username", checkLoggedIn, usernameRoutes)
router.use("/task", checkLoggedIn, taskRoutes)
router.use("/user", checkLoggedIn, userRoutes)
router.use("/request", checkLoggedIn, requestRoutes)
router.use("/friend", checkLoggedIn, friendRoutes)
router.use("/notifications", checkLoggedIn, notificationRoutes)


export default router