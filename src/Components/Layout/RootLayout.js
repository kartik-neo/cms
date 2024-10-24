import React, { useState } from "react";
import "./custom.css"
import Navbar from "../Common/Navbar";
import Sidebar from "../Common/Sidebar";
import { Outlet, useLocation, useParams } from "react-router-dom";

const RootLayout = ({ sessionData }) => {
  const location = useLocation();
  const { emergency_id, emp_code } = useParams();
  const [sidebarClose, setSidebarClose] = useState(false)
  const toggleSidebar = () => {
    setSidebarClose(!sidebarClose)
  }
  return (
    <>
      {location.pathname ===
      `/emergency-response/${emergency_id}/${emp_code}` ? (
        <div className="w-full pt-6 px-8 bg-gray-100 min-h-screen">
          <Outlet />
        </div>
      ) : (
        <div className={`w-full relative min-h-screen bg-gray-100 ${sidebarClose ? 'sidebar-toggled' : ''}`}>
          <Navbar sessionData={sessionData} toggleSidebar={toggleSidebar} sidebarClose={sidebarClose} />
          <div className="flex flex-row">
            <Sidebar sidebarClose={sidebarClose} toggleSidebar={toggleSidebar} />
            <div className={`w-full pt-6 px-5 md:px-8 main-content-wrapper`}>
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RootLayout;
