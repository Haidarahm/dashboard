import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router";
import Appointments from "../pages/admin/appointments/Appointments";
import Clinics from "../pages/admin/clinics/Clinics";
import Pharmacies from "../pages/admin/pharmacies/Pharmacies";
import Employees from "../pages/admin/employees/Employees";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";
import { useState } from "react";
import DoctorsWithReviews from "../pages/admin/doctors/DoctorsWithReviews ";
import Vaccine from "../pages/admin/vaccine/Vaccine";

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

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<DashboardLayout />}>
      <Route index element={<Navigate to="/appointments" replace />} />
      <Route path="appointments" element={<Appointments />} />
      <Route path="clinics" element={<Clinics />} />
      <Route path="pharmacies" element={<Pharmacies />} />
      <Route path="doctors" element={<DoctorsWithReviews />} />
      <Route path="employees" element={<Employees />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="vaccins" element={<Vaccine />} />
      {/* Add more nested routes here */}
    </Route>
  </Routes>
);

export default AdminRoutes;
