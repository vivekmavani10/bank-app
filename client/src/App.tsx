import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/About";
import ContactUs from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboardLayout from "./layouts/UserDashboardLayout";
import Dashboard from "./pages/Dashboard";
import ApplyAccount from "./pages/ApplyAccount";
import AdminDashboardLayout from "./layouts/AdminDashbaordLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AllAccounts from "./pages/AllAccounts";
import Transaction from "./pages/Transaction";
import Deposit from "./pages/Deposit";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <div className="pt-20 px-4">
                <Home />
              </div>
            </>
          }
        />
        <Route
          path="/about-us"
          element={
            <>
              <Navbar />
              <div className="pt-20 px-4">
                <AboutUs />
              </div>
            </>
          }
        />
        <Route
          path="/contact-us"
          element={
            <>
              <Navbar />
              <div className="pt-20 px-4">
                <ContactUs />
              </div>
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <div className="pt-20 px-4">
                <Login />
              </div>
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <div className="pt-20 px-4">
                <Register />
              </div>
            </>
          }
        />

        {/* User Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="apply-account" element={<ApplyAccount />} />
          <Route path="transaction" element={<Transaction />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="accounts" element={<AllAccounts />} />
          <Route path="deposit" element={<Deposit />}/>
        </Route>
      </Routes>

      {/* Toast notifications container */}
      <ToastContainer position="bottom-center" autoClose={2000} aria-label="Notification" />
    </>
  );
};

export default App;
