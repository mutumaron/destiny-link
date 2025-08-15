import NavBar from "@/components/DashBoard/Navbar";
import DashBoardSideBar from "@/components/DashBoard/Sidebar";

import { SidebarProvider } from "@/components/ui/sidebar";

import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <DashBoardSideBar />
      <main className="w-full">
        <NavBar />
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Dashboard;
