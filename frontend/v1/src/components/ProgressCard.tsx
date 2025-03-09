import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../components/ui/card"
import {CircularProgress} from "@heroui/progress";
import { IoChevronForward } from "react-icons/io5";
  

const ProgressCard = () => {
  return (
    
        <Card className="w-1/2 flex flex-col justify-between items-center">
            <CardHeader>
                <CardTitle className="flex justify-between gap-2">Progress <IoChevronForward /></CardTitle>
                
            </CardHeader>
            <CardContent>
                <CircularProgress
                color="success"
                formatOptions={{style: "percent"}}
                showValueLabel={true}
                value={67}
                classNames={{
                    svg: "w-20 h-20 xs:w-32 xs:h-32 drop-shadow-md text-center",
                    indicator: "green",
                    track: "black",
                    value: "text-2xl font-semibold text-black",
                }}
                />
            </CardContent>
            <CardFooter>
                <p className="w-full text-center">10 out of 15</p>
            </CardFooter>
        </Card>
  )
}

export default ProgressCard