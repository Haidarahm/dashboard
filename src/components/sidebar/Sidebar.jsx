// File: src/components/sidebar/Sidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaClinicMedical,
  FaUserMd,
  FaRegHospital,
  FaUsers,
  FaPills,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { MdOutlinePayments } from "react-icons/md";

// Sidebar Component
const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: "/appointments",
      icon: FaRegCalendarCheck,
      label: "Appointments",
      path: "/appointments",
    },
    {
      key: "/payments",
      icon: MdOutlinePayments,
      label: "Payments",
      path: "/payments",
    },
    {
      key: "/doctors",
      icon: FaUserMd,
      label: "Doctors",
      path: "/doctors",
    },
    {
      key: "/clinics",
      icon: FaRegHospital,
      label: "Clinics",
      path: "/clinics",
    },
    {
      key: "/employees",
      icon: FaUsers,
      label: "Employees",
      path: "/employees",
    },
    {
      key: "/pharmacies",
      icon: FaPills,
      label: "Pharmacies",
      path: "/pharmacies",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`sidebar relative bg-white border-r border-gray-200 h-full flex flex-col ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300 ease-in-out shadow-sm`}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <FaClinicMedical className="text-white text-sm" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">MediCare</h1>
              <p className="text-xs text-gray-500">Clinic Management</p>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200 text-gray-400 hover:text-gray-600"
        >
          {collapsed ? (
            <FaChevronRight size={12} />
          ) : (
            <FaChevronLeft size={12} />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.key}
              to={item.path}
              className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                active
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`flex-shrink-0 ${
                  collapsed ? "w-5 h-5" : "w-4 h-4 mr-3"
                } ${
                  active
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}

              {/* Active indicator */}
              {active && (
                <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
