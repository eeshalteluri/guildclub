'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface TaskData {
  taskLogs: {
    _id: string;
  taskId: string;
  logs: { date: string; status: string }[]; // Array of objects with date and status properties
  },
  taskDetails: {
    _id: string;
    userId: string;
    name: string;
    description: string;
    taskFrequency: string;
    frequency: string[];
    type: string;
    accountabilityPartner: {
      name: string;
      username: string;
    };
    startDate: string;
    endDate: string | null;
    createdAt: string;
    updatedAt: string;
  }
}

interface TaskDataContextType {
  tasksData: TaskData[] | null;
  setTasksData: (data: TaskData[] | null) => void;
}

const TaskDataContext = createContext<TaskDataContextType | undefined>(undefined);

interface TaskDataProviderProps {
  children: ReactNode;
  initialTasksData: TaskData[] | null;
}

export function TaskDataProvider({ children, initialTasksData }: TaskDataProviderProps) {
  const [tasksData, setTasksData] = useState<TaskData[] | null>(() => initialTasksData)

  console.log("Task Context Data: ",tasksData)

return (
  <TaskDataContext.Provider value={{ tasksData, setTasksData }}>
    {children}
  </TaskDataContext.Provider>
);
}

export function useTaskData() {
  const context = useContext(TaskDataContext);
  if (!context) {
    throw new Error('useTaskData must be used within a TaskDataProvider');
  }
  return context;
}