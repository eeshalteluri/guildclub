import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserProvider } from '@/contexts/UserContext';
import { TaskDataProvider } from "@/contexts/TaskContext";
import { headers } from "next/headers";
import { RequestsProvider } from "@/contexts/RequestContext";

async function getUser() {
  console.log("Fetching User initiated...")
  try {
    const headersList = await headers();

    const response = await fetch('http://localhost:5000/auth/user', {
      credentials: 'include',
      headers: {
        Cookie: headersList.get('cookie') || '',
        'Cache-Control': 'no-store',  // 🚀 Prevent caching
      },
      cache: 'no-store',  // 🚀 Force fresh API call
    });

    console.log("Response fetching User: ", response)

    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

  async function fetchTasksAndTasklogs(taskIds: string[]) {
    console.log("Fetching tasklogs initiated....")
    console.log("Fetching tasklog with the respective TaskIDs: ", taskIds)
  try {
    if (taskIds.length > 0) {
      console.log("Fetching Task Logs for:", taskIds);

      const headersList = await headers();
      const cookie = headersList.get('cookie') || '';
      const response = await fetch(`http://localhost:5000/auth/task-data-and-logs?taskIds=${taskIds}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Cookie: cookie,
        },
        cache: "reload",
      });

      console.log("Response fetching Task data and logs: ", response)

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetch Logs Data: ",data)
      return data.tasksLogsData || [];
    }
  } catch (error) {
    console.error("Error fetching Tasklogs:", error);
  }

  return [];
  }

export default async function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialUser = await getUser();
  const initialTasksData = await fetchTasksAndTasklogs(initialUser?.tasks || []);

  return (
    <div className="h-full">
      <UserProvider initialUser={initialUser}>
        <TaskDataProvider initialTasksData={initialTasksData} >
          <RequestsProvider>
          <Navbar />
          {children}
          <Footer />
          </RequestsProvider>
        </TaskDataProvider>
      </UserProvider>
    </div>
  );
}
