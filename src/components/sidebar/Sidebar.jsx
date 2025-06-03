import React, { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiFileText,
  FiShoppingCart,
  FiMail,
  FiCalendar,
} from "react-icons/fi";
import { Avatar, Badge, Menu } from "antd";

// Sidebar Component
const Sidebar = ({ collapsed }) => {
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    {
      key: "dashboard",
      icon: <FiHome className="w-5 h-5" />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      key: "users",
      icon: <FiUsers className="w-5 h-5" />,
      label: "Users",
      path: "/users",
    },
    {
      key: "orders",
      icon: <FiShoppingCart className="w-5 h-5" />,
      label: "Orders",
      path: "/orders",
    },
    {
      key: "reports",
      icon: <FiFileText className="w-5 h-5" />,
      label: "Reports",
      path: "/reports",
    },
    {
      key: "messages",
      icon: <FiMail className="w-5 h-5" />,
      label: (
        <div className="flex items-center justify-between w-full">
          <span>Messages</span>
          <Badge count={5} size="small" />
        </div>
      ),
      path: "/messages",
    },
    {
      key: "calendar",
      icon: <FiCalendar className="w-5 h-5" />,
      label: "Calendar",
      path: "/calendar",
    },
    {
      key: "settings",
      icon: <FiSettings className="w-5 h-5" />,
      label: "Settings",
      path: "/settings",
    },
  ];

  const handleMenuClick = ({ key }) => {
    setActiveItem(key);
    // In a real app, you would also navigate to the route here
    // For example: navigate(menuItems.find(item => item.key === key).path);
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-gray-900 font-semibold text-lg">
                AdminPro
              </span>
              <span className="text-gray-500 text-xs">Dashboard</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-hidden">
        <Menu
          mode="inline"
          selectedKeys={[activeItem]}
          onClick={handleMenuClick}
          items={menuItems}
          inlineCollapsed={collapsed}
          className="border-none h-full"
          style={{
            backgroundColor: "transparent",
            fontSize: "14px",
          }}
          theme="light"
        />
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div
          className={`flex items-center space-x-3 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Avatar
            size={32}
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
            className="flex-shrink-0"
            alt="User profile"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                John Doe
              </div>
              <div className="text-xs text-gray-500 truncate">
                john@example.com
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
