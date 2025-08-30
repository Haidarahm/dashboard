import { Routes, Route, Navigate, Outlet } from "react-router";
import React, { Suspense, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";
import Appointments from "../pages/secretary/SecretaryAppointments";
import CancelledAppointments from "../pages/secretary/CancelledAppointments";

function SecretaryRoutes() {
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
    <Suspense
      fallback={
        <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>
      }
    >
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/appointments" replace />} />
          <Route path="appointments" element={<Appointments />} />
          <Route
            path="cancelled-appointments"
            element={<CancelledAppointments />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default SecretaryRoutes;
