import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserProvider } from '@/contexts/UserContext';
import { TaskDataProvider } from "@/contexts/TaskContext";
import { RequestsProvider } from "@/contexts/RequestContext";
  
  export default async function PagesLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="h-full">
        <UserProvider >
          <TaskDataProvider >
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