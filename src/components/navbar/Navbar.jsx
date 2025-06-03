import React from 'react';
import {
  FiMenu,
  FiBell,
  FiSearch,
  FiUser,
  FiLogOut,
  FiSettings,
  FiChevronDown,
} from 'react-icons/fi';
import { Avatar, Badge, Dropdown, Input } from 'antd';



// Navbar Component
const Navbar = ({ collapsed, setCollapsed }) => {
  const userMenuItems = [
    {
      key: 'profile',
      label: (
        <div className="flex items-center space-x-2 py-1">
          <FiUser className="w-4 h-4" />
          <span>Profile</span>
        </div>
      ),
    },
    {
      key: 'settings',
      label: (
        <div className="flex items-center space-x-2 py-1">
          <FiSettings className="w-4 h-4" />
          <span>Settings</span>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <div className="flex items-center space-x-2 py-1 text-red-600">
          <FiLogOut className="w-4 h-4" />
          <span>Logout</span>
        </div>
      ),
    },
  ];

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
          
          <div className="hidden md:block">
            <Input
              placeholder="Search..."
              prefix={<FiSearch className="w-4 h-4 text-gray-400" />}
              className="w-64"
              size="middle"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search Icon for Mobile */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 md:hidden">
            <FiSearch className="w-5 h-5 text-gray-600" />
          </button>

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
            menu={{ items: userMenuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <Avatar 
                size={32}
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
              />
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-900">John Doe</div>
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

export default Navbar