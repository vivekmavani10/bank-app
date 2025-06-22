import React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminDashboardNavbar from "../components/AdminDashboardNavbar";
import AdminSidebar from "../components/AdminSidebar";

const AdminDashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Navbar */}
      <AdminDashboardNavbar onToggleSidebar={() => setSidebarOpen(true)} />

      {/* Scrollable Content Area */}
      <div className="flex flex-1 overflow-hidden pt-20">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
