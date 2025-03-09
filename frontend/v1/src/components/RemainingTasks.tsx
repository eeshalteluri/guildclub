import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "../components/ui/card"

import { ScrollArea } from "../components/ui/scroll-area"
import { Separator } from "../components/ui/separator"
import { Checkbox } from "../components/ui/checkbox";


import { IoChevronForward } from "react-icons/io5";

const tasks: Array<String> = [
    "Task 11",
    "Task 12",
    "Task 13",
    "Task 14",
    "Task 15",
    "Task 16",
    "Task 1",
    "Task 17",
    "Task 18",
    "Task 19",
    
  ];

const RemainingTasks = () => {
  return (
    <Card className="w-1/2 flex flex-col justify-between items-center">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">Remaining Tasks <IoChevronForward /></CardTitle>
            </CardHeader>
            <CardContent className="w-full">
                <ScrollArea className="w-[100%] h-[100px] xs:h-[130px]">
                    {tasks.map((task, index) => (
                        <div key={index}>
                        <div  className="text-xl flex items-center gap-2">
                          <Checkbox />
                          <p>{task}</p>  
                        </div>
                        <Separator />
                        </div>
                    ))}
                </ScrollArea>
            </CardContent>

    </Card>
  )
}

export default RemainingTasks