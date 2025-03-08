import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["completed", "missed", "task-pending", "approval-pending"],
    required: true,
  },
});

const TaskLogSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Task",
  },
  logs: {
    type: [LogSchema], 
    required: true
  },
});

const TaskLog = mongoose.models.TaskLog || mongoose.model("TaskLog", TaskLogSchema);
export default TaskLog;
