import { Schema, Document } from "mongoose";
export interface NotificationType extends Document {
    userId: Schema.Types.ObjectId;
    fromUserId: Schema.Types.ObjectId;
    taskId: Schema.Types.ObjectId;
    date: Date
    type: string;
    status: string;
    message?: string;
  }
  
  export default NotificationType;
  