import mongoose from "mongoose"
import NotificationType from "../types/notification";

const NotificationSchema = new mongoose.Schema<NotificationType>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    type:{
        type: String,
        required: true,
        enum: ["friend-request", "task-approval"]
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    },
    date: {
        type: Date,
    },
    status: {
        type: String,
        required: true,
        enum: ["request-pending", "approval-pending", "accepted", "rejected"],
    },
    message: {
        type: String,
        default: null,
    }
},
    {timestamps: true}
)

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema)

export default Notification;