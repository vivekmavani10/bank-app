import React, { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Popup from "./Popup"; // Make sure path is correct

interface AdminDashboardNavbarProps {
  onToggleSidebar: () => void;
}

const AdminDashboardNavbar: React.FC<AdminDashboardNavbarProps> = ({
  onToggleSidebar,
}) => {
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-9 w-auto" />
            <span className="text-2xl font-bold text-[#004466]">KV Bank</span>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Logout Button with Popup */}
            <button
              onClick={() => setShowLogoutPopup(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title="Logout"
            >
              <LogOut className="w-6 h-6 text-red-500" />
            </button>

            {/* Hamburger */}
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

      {/* Logout Popup */}
      {showLogoutPopup && (
        <Popup
          title="Logout Confirmation"
          message="Are you sure you want to logout?"
          onCancel={() => setShowLogoutPopup(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
};

export default AdminDashboardNavbar;
