import Link from "next/link";
import { House, CircleUser, Users, Bell } from 'lucide-react';
import AddNewTask from "./AddNewTask";


const Footer = () => {


  return (
    <div className='w-full p-4 fixed bottom-0 bg-black flex justify-around items-center'>
        <Link 
          href="/dashboard"
        >
          <House className="text-white cursor-pointer text-2xl"/>
        </Link>
        
        {/*<Link 
          href="/dashboard/groups"
        >
          <HiUserGroup className="text-white cursor-pointer text-2xl"/>
        </Link>
        */}
        
        <Link 
          href="/dashboard/friends"
        >
          <Users 
            className="text-white cursor-pointer text-2xl"
          />
        </Link>

        <AddNewTask />

        <Link href="/dashboard/notifications">
          <Bell className="text-white cursor-pointer text-2xl"/>
        </Link>

        <Link 
          href="/dashboard/profile"
        >
          <CircleUser 
            className="text-white cursor-pointer text-2xl"
          />
        </Link>
    </div>
  )
}

export default Footer