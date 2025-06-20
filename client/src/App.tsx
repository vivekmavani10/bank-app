import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/About";
import ContactUs from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboardLayout from "./layouts/UserDashboardLayout";
import Dashboard from "./pages/Dashboard";
// import Profile from "./pages/dashboard/Profile";
// import Settings from "./pages/dashboard/Settings";

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

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<UserDashboardLayout />}>
          <Route index element={<Dashboard />} />
          {/* <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} /> */}
        </Route>
      </Routes>
    </>
  );
};

export default App;
