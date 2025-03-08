import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    taskFrequency: {
        type: String,
        required: true,
        enum: ["daily", "weekly", "monthly", "custom"],
        default: "daily"
    },
    frequency: {
        type: [String],
    },
    type: {
        type: String,
        required: true,
        enum: ["AT", "NT"],
        default: "AT"
    },
    accountabilityPartner: {
        type: {name: {type: String}, username: {type: String}}
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
    },

},{timestamps: true}

)

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema)
export default Task