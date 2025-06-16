import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-9 w-auto" />
            <span className="text-xl font-semibold text-black">KV Bank</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="text-black hover:text-gray-500">Home</Link>
            <Link to="/about-us" className="text-black hover:text-gray-500">About Us</Link>
            <Link to="/contact-us" className="text-black hover:text-gray-500">Contact Us</Link>
            <Link to="/login" className="text-black hover:text-gray-500">Login</Link>
            <Link to="/register" className="text-black hover:text-gray-500">Register</Link>
          </div>

          {/* Mobile Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={() => setMenuOpen(false)} className="text-gray-900 hover:text-red-500">
            ✕
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-indigo-600">Home</Link>
          <Link to="/about-us" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-indigo-600">About Us</Link>
          <Link to="/contact-us" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-indigo-600">Contact Us</Link>
          <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-indigo-600">Login</Link>
          <Link to="/register" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-indigo-600">Register</Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
