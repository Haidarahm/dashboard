import React from "react";
import {
  FiMenu,
  FiBell,
  FiUser,
  FiLogOut,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";
import { Avatar, Badge, Dropdown } from "antd";
import { logoutUser } from "../../utils/auth";
import { logout } from "../../api/admin/auth";

// Navbar Component
const Navbar = ({ collapsed, setCollapsed }) => {
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout(); // Call API logout
      logoutUser(); // Clear data and redirect
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API fails, still logout locally
      logoutUser();
    }
  };

  const userMenuItems = [
    {
      key: "logout",
      label: (
        <div className="flex items-center space-x-2 py-1 text-red-600">
          <FiLogOut className="w-4 h-4" />
          <span>Logout</span>
        </div>
      ),
    },
  ];

  // Handle menu item clicks
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    }
    // Add other menu item handlers here as needed
  };
  // Get user name from localStorage first, then sessionStorage as fallback
  const getUserName = () => {
    const localName = localStorage.getItem("name");
    if (localName) {
      return localName;
    }
    const sessionName = sessionStorage.getItem("name");
    return sessionName || "Administrator"; 
  };

  const userName = getUserName();
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 h-16 flex items-center">
      <div className="flex items-center justify-between w-full">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
          >
            <FiMenu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Clinic Dashboard Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600 hidden sm:block">
              Clinic Dashboard
            </h1>
            <div className="w-1 h-6 bg-blue-600 rounded-full mx-4 hidden sm:block"></div>
            <span className="text-sm text-gray-500 hidden md:block">
              Management System
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center">
              <Badge count={3} size="small" className="text-xs">
                <FiBell className="w-5 h-5 text-gray-600" />
              </Badge>
            </button>
          </div>

          {/* User Menu */}
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleMenuClick }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold text-gray-900">
                  {userName}
                </div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
              <FiChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
