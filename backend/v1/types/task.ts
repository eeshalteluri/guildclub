interface LogType {
    date: string,
    status: string
}

export interface TaskLogType {
    _id: String,
    taskId: String,
    logs: LogType[]
  }
  
  export default TaskLogType;