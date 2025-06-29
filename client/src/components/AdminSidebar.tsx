import React from "react";
import { Link } from "react-router-dom";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 text-white z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        md:translate-x-0 md:static md:block shadow-lg bg-white`}
      >
        {/* Mobile header */}
        <div className="p-4 border-b border-white/30 flex justify-between items-center md:hidden">
          <span className="text-lg font-bold text-black">Menu</span>
          {/* Close button */}
          <button onClick={onClose} className="text-xl font-bold text-black">
            ✕
          </button>
        </div>

        <div className="border-b border-black-100 md:hidden" />

        {/* Links */}
        <div className="flex flex-col p-4 space-y-2 text-black font-medium">
          <Link
            to="/admin-dashboard"
            onClick={onClose}
            className="hover:bg-[#d7555e] text-[#004466] hover:text-white rounded-md px-3 py-2 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/admin-dashboard/accounts"
            onClick={onClose}
            className="hover:bg-[#d7555e] text-[#004466] hover:text-white rounded-md px-3 py-2 transition"
          >
            All Accounts
          </Link>
          <Link
            to="/admin-dashboard/deposit"
            onClick={onClose}
            className="hover:bg-[#d7555e] text-[#004466] hover:text-white rounded-md px-3 py-2 transition"
          >
            Deposit Money
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
