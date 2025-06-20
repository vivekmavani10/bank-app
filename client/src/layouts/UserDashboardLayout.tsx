import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/UserDashboardNavbar";
import { Outlet } from "react-router-dom";

const UserDashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Navbar */}
      <DashboardNavbar onToggleSidebar={() => setSidebarOpen(true)} />

      {/* Scrollable Content Area */}
      <div className="flex flex-1 overflow-hidden pt-20">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
