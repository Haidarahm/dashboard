import React, { Suspense } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router";
// Lazy imports for admin pages
const Appointments = React.lazy(() =>
  import("../pages/admin/appointments/Appointments")
);
const Clinics = React.lazy(() => import("../pages/admin/clinics/Clinics"));
const Pharmacies = React.lazy(() =>
  import("../pages/admin/pharmacies/Pharmacies")
);
const Employees = React.lazy(() =>
  import("../pages/admin/employees/Employees")
);
const Dashboard = React.lazy(() =>
  import("../pages/admin/dashboard/Dashboard")
);
const DoctorsWithReviews = React.lazy(() =>
  import("../pages/admin/doctors/DoctorsWithReviews ")
);
const Vaccine = React.lazy(() => import("../pages/admin/vaccine/Vaccine"));
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";
import { useState } from "react";

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
  <Suspense
    fallback={
      <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>
    }
  >
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
  </Suspense>
);

export default AdminRoutes;
