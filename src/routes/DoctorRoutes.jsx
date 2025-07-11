import { Routes, Route, Navigate, Outlet } from "react-router";
import Appointments from '../pages/doctor/appoinments/Appoinments';
import Patients from '../pages/doctor/patients/Patients';
import React, { useState } from 'react'
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";
function DoctorRoutes() {
    function DashboardLayout() {
        const [collapsed, setCollapsed] = useState(false);
        return (
          <div className="flex flex-col h-screen">
            <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar collapsed={collapsed} />
              <div className="flex-1 overflow-auto">
                <Outlet />
              </div>
            </div>
          </div>
        );
      }
      
  return (
    <Routes>
    <Route path="/" element={<DashboardLayout />}>
      <Route index element={<Navigate to="/appointments" replace />} />
      <Route path="appointments" element={<Appointments />} />
      <Route path="patients" element={<Patients />} />
      {/* Add more nested routes here */}
    </Route>
  </Routes>
  )
}

export default DoctorRoutes