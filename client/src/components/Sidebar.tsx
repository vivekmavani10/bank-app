import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 
    ${isOpen ? "translate-x-0" : "translate-x-full"} 
    md:translate-x-0 md:static md:block shadow-lg`}
      >
        <div className="p-4 border-b flex justify-between items-center md:hidden">
          <span className="text-lg font-bold">Menu</span>
          <button onClick={onClose} className="text-xl font-bold">
            ✕
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-4">
          <Link to="/dashboard" onClick={onClose}>
            Dashboard
          </Link>
          <Link to="/dashboard/apply-account" onClick={onClose}>
            Apply For Account
          </Link>
          <Link to="/dashboard/apply-kyc" onClick={onClose}>
            Apply For KYC
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
