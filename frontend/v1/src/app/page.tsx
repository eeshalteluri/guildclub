import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IoMdCheckboxOutline } from "react-icons/io";

const HomePage = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6">
      <div className="max-w-[1400px] mx-auto flex flex-col justify-center items-center">
        <div className="text-center flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold break-words">No more <span className="bg-red-300 py-1 px-2 rounded line-through block sm:inline">Cheating</span> on your <span className="bg-green-300 py-1 px-2 rounded block sm:inline"><IoMdCheckboxOutline className="inline"/> Checklist</span></h1>
          <p className="mt-8 mx-4 w-fit font-normal">Complete your tasks, and stay productive.</p>
          <p className="mx-4 w-fit">Stay on track with <span className="underline">accountability</span><span className="block sm:inline"></span>.</p>
        </div>
      </div>
    
      <div className="flex gap-2">
        <Button 
          asChild>
          <Link href="/signin">
            Sign In
          </Link>
        </Button> 
        <Button asChild>
          <Link href="/signup">
            Sign Up
          </Link>
        </Button> 
      </div>
    </div>
  )
}

export default HomePage