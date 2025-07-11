import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router";
import "leaflet/dist/leaflet.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/login/Login";
import AdminRoutes from "./routes/AdminRoutes";
import DoctorRoutes from "./routes/DoctorRoutes";

function getRoleFromStorage() {
  // Try both localStorage and sessionStorage
  return (
    localStorage.getItem("role") || 
    sessionStorage.getItem("role") || 
    null
  );
}

function App() {
  const role = getRoleFromStorage();
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            role === "doctor" ? (
              <DoctorRoutes />
            ) : role === "admin" ? (
              <AdminRoutes />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
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