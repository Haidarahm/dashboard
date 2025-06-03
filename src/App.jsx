import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import {
  isAuthenticated,
  isTokenValid,
  handleSessionExpired,
} from "./utils/auth";

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
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 overflow-auto">
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Outlet /> {/* This renders nested routes */}
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
          <Route index element={<Navigate to="/dashboard" replace />} />
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
