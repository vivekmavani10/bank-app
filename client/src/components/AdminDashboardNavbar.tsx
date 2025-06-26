import React from "react";
import Button from "./Button";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

interface AdminDashboardNavbarProps {
  onToggleSidebar: () => void;
}

const AdminDashboardNavbar: React.FC<AdminDashboardNavbarProps> = ({onToggleSidebar}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-9 w-auto" />
          <span className="text-2xl font-bold text-[#004466]">KV Bank</span>
        </div>

        {/* Logout Button */}
        <div className="flex items-center space-x-4">
          <Button type="submit" onClick={handleLogout}>
            Logout
          </Button>

          {/* Hamburger for mobile */}
          <button className="md:hidden" onClick={onToggleSidebar}>
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminDashboardNavbar;
