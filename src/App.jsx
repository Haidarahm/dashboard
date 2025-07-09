import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router";
import 'leaflet/dist/leaflet.css';

import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/login/Login";
import Appointments from "./pages/appointments/Appointments";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import {
  isAuthenticated,
  isTokenValid,
  handleSessionExpired,
} from "./utils/auth";
import Pharmacies from "./pages/pharmacies/Pharmacies";
import Doctors from "./pages/doctors/Doctors";
import Clinics from "./pages/clinics/Clinics";
import Employees from "./pages/employees/Employees";
import Dashboard from "./pages/dashboard/Dashboard";

function ProtectedRoute({ children }) {
  // Check if user is authenticated and token is valid
  const userIsAuthenticated = isAuthenticated();
  const tokenIsValid = isTokenValid();

  // If user has tokens but they're invalid, clear them and redirect
  if (userIsAuthenticated && !tokenIsValid) {
    handleSessionExpired();
    return <Navigate to="/login" />;
  }

  // If user is not authenticated, redirect to login
  if (!userIsAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar at the top */}
      <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      {/* Main content area with sidebar and page content */}
      <div className="flex flex-1 overflow-hidden">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 overflow-auto">
        <Outlet /> {/* This renders nested routes */}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/appointments" replace />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="clinics" element={<Clinics />} />
          <Route path="pharmacies" element={<Pharmacies />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="employees" element={<Employees />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* Add more nested routes here */}
        </Route>
      </Routes>

      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
