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
import { FaUserDoctor } from "react-icons/fa6";

import { PiHospital } from "react-icons/pi";

import { Avatar, Badge, Menu } from "antd";

// Sidebar Component
const Sidebar = ({ collapsed }) => {
  const [activeItem, setActiveItem] = useState("pharmacies");

  const menuItems = [
    {
      key: "pharmacies",
      icon: <PiHospital className="sidebar-menu-icon w-5 h-5" />,
      label: "Pharmacies",
      path: "/pharmacies",
    },
    {
      key: "doctors",
      icon: <FaUserDoctor className="sidebar-menu-icon w-5 h-5" />,
      label: "Doctors",
      path: "/doctors",
    },
    {
      key: "orders",
      icon: <FiShoppingCart className="sidebar-menu-icon w-5 h-5" />,
      label: "Orders",
      path: "/orders",
    },
    {
      key: "reports",
      icon: <FiFileText className="sidebar-menu-icon w-5 h-5" />,
      label: "Reports",
      path: "/reports",
    },
    {
      key: "messages",
      icon: (
        <div className="sidebar-menu-icon-container relative">
          <FiMail className="sidebar-menu-icon w-5 h-5" />
          {collapsed && (
            <Badge
              count={5}
              size="small"
              className="sidebar-badge absolute -top-1 -right-1"
              style={{ fontSize: "10px" }}
            />
          )}
        </div>
      ),
      label: collapsed ? null : (
        <div className="sidebar-menu-label flex items-center justify-between w-full">
          <span>Messages</span>
          <Badge count={5} size="small" className="sidebar-badge" />
        </div>
      ),
      path: "/messages",
    },
    {
      key: "calendar",
      icon: <FiCalendar className="sidebar-menu-icon w-5 h-5" />,
      label: "Calendar",
      path: "/calendar",
    },
    {
      key: "settings",
      icon: <FiSettings className="sidebar-menu-icon w-5 h-5" />,
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
      className={`sidebar-container bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col`}
    >
      {/* Logo Section */}
      <div
        className={`sidebar-header p-4 border-b border-gray-200 ${
          collapsed ? "flex justify-center" : ""
        }`}
      >
        <div
          className={`sidebar-brand flex items-center ${
            collapsed ? "justify-center" : "space-x-3"
          }`}
        >
          <div className="sidebar-logo w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer">
            <span className="sidebar-logo-text text-white font-bold text-sm">
              A
            </span>
          </div>
          {!collapsed && (
            <div className="sidebar-brand-text flex flex-col transition-opacity duration-300">
              <span className="sidebar-title text-gray-900 font-semibold text-lg">
                AdminPro
              </span>
              <span className="sidebar-subtitle text-gray-500 text-xs">
                Dashboard
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="sidebar-menu-container flex-1 overflow-hidden">
        <Menu
          mode="inline"
          selectedKeys={[activeItem]}
          onClick={handleMenuClick}
          items={menuItems}
          inlineCollapsed={collapsed}
          className="sidebar-menu border-none h-full"
          style={{
            backgroundColor: "transparent",
            fontSize: "14px",
          }}
          theme="light"
          inlineIndent={collapsed ? 0 : 24}
        />
      </div>

      {/* User Profile Section */}
      <div
        className={`sidebar-footer p-4 border-t border-gray-200 ${
          collapsed ? "flex justify-center" : ""
        }`}
      >
        <div
          className={`sidebar-user flex items-center ${
            collapsed ? "justify-center" : "space-x-3"
          }`}
        >
          <Avatar
            size={32}
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
            className="sidebar-user-avatar flex-shrink-0 cursor-pointer"
            alt="User profile"
          />
          {!collapsed && (
            <div className="sidebar-user-info flex-1 min-w-0 transition-opacity duration-300">
              <div className="sidebar-user-name text-sm font-medium text-gray-900 truncate">
                John Doe
              </div>
              <div className="sidebar-user-phone text-xs text-gray-500 truncate">
                +1 (555) 123-4567
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
