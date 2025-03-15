import express from "express"
import authRoutes from "./Auth"
import usernameRoutes from "./Username"
import userRoutes from "./User"
import requestRoutes from "./Request"
import friendRoutes from "./Friend"
import notificationRoutes from "./Notification"

import taskRoutes from "./Task"
import { isAuthenticated } from "../middlewares/Auth"

const router = express.Router()

router.get("/", (req, res) => {
    res.send("Express server is running...!")
})

router.get('/test-cookie', (req, res) => {
    res.cookie('testcookie', 'hello', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    }).send('Cookie set!');
});

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
router.use("/username", isAuthenticated, usernameRoutes)
router.use("/task", isAuthenticated, taskRoutes)
router.use("/user", isAuthenticated, userRoutes)
router.use("/request", isAuthenticated, requestRoutes)
router.use("/friend", isAuthenticated, friendRoutes)
router.use("/notifications", isAuthenticated, notificationRoutes)


export default router