import {
    Card,
    CardContent,
  } from "../components/ui/card"
import { ScrollArea } from "../components/ui/scroll-area"
import { Separator } from "../components/ui/separator"
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";


import { IoFilter } from "react-icons/io5";
import { MdCardTravel } from "react-icons/md";

const tasks: Array<string> = [
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

const TasksCard = () => {
  return (
    <Card className="mx-2 mt-2 flex flex-col justify-between items-center">
                
               
                    <CardContent className="w-full">  
                        
                        <div className="m-2 flex items-center gap-2 ">
                            <Input></Input>
                            <IoFilter />
                        </div>
                        <ScrollArea className="w-[100%] h-[100px] xs:h-[130px]">
                        {tasks.map((task, index) => (
                            <div key={index}>
                            <div  className="text-xl flex justify-between items-center gap-2">
                            
                            <div className="flex items-center gap-2 ">
                                <MdCardTravel/>
                                <p>{task}</p>
                            </div> 


                            <div className="flex gap-2">
                             <Checkbox />
                             <Checkbox />
                             <Checkbox />
                             <Checkbox />
                             <Checkbox />
                             <Checkbox />
                             <Checkbox />
                             </div>
                            </div>
                            <Separator />
                            </div>
                        ))}
                    </ScrollArea>
                </CardContent>
    
        </Card>
  )
}

export default TasksCard