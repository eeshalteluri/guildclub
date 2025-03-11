import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { headers } from 'next/headers';
import { UserProvider } from '@/contexts/UserContext';
  
  async function getUser() {
    try {
      const headersList = await headers();
      const response = await fetch('http://localhost:5000/auth/user', {
        credentials: 'include',
        headers: {
          Cookie: headersList.get('cookie') || '',
        },
      });
      
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async function fetchTaskLogs(taskIds: string[]) {
    try {
    if (taskIds.length > 0) {
      console.log("User Tasks: ", taskIds);
      
        if (taskIds.length > 0) {
          console.log("User Tasks: ", taskIds);
            const headersList = await headers();
            const response = await fetch("http://localhost:5000/task/tasklogs", {
              method: "POST",
              credentials: 'include',
              headers: {
                "Content-Type": "application/json",
                Cookie: headersList.get('cookie') || '',
              },
              body: JSON.stringify({ taskIds }), // Send the array of task IDs
            });
      
            if (!response.ok) {
              throw new Error(`Failed to fetch tasks: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Tasklogs: ", data);
             return data.taskLogs
          } 
        }
        return null
      }catch (error) {
        console.error("Error fetching Tasklogs: ", error)
        return null
      }
}
  
  export default async function PagesLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const initialUser = await getUser();
    const tasks = await fetchTaskLogs(initialUser?.tasks || [])
  
    return (
      <div className="h-full">
        <UserProvider initialUser={initialUser}>
          <Navbar />
          {children}
          <Footer />
        </UserProvider>
      </div>
    );
  }