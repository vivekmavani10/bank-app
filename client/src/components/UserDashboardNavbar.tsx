import React from "react";
import logo from "../assets/logo.png";
import Button from "./Button";

interface DashboardNavbarProps {
  onToggleSidebar: () => void;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  onToggleSidebar,
}) => {
  return (
    <nav className="bg-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-9 w-auto" />
          <span className="text-xl font-semibold text-black">KV Bank</span>
        </div>

        {/* Logout Button */}
        <Button type="submit">Logout</Button>

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
    </nav>
  );
};

export default DashboardNavbar;
