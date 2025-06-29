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
import { logout } from "../../api/auth";

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
      key: "profile",
      label: (
        <div className="flex items-center space-x-2 py-1">
          <FiUser className="w-4 h-4" />
          <span>Profile</span>
        </div>
      ),
    },
    {
      key: "settings",
      label: (
        <div className="flex items-center space-x-2 py-1">
          <FiSettings className="w-4 h-4" />
          <span>Settings</span>
        </div>
      ),
    },
    {
      type: "divider",
    },
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

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <FiMenu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Clinic Dashboard Title */}
          <h1 className="text-xl font-semibold text-blue-600 hidden sm:block">
            Clinic Dashboard
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <Badge count={3} size="small">
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
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
             
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  John Doe
                </div>
                <div className="text-xs text-gray-500">Admin</div>
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
