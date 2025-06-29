// File: src/components/sidebar/Sidebar.jsx
import React, { useState } from "react";
import {  FiShoppingCart, FiMail } from "react-icons/fi";
import { BiClinic } from "react-icons/bi";
import { FaUserNurse } from "react-icons/fa6";

// import { FaUserDoctor } from "react-icons/fa6";
import { PiHospital  } from "react-icons/pi";
import { Avatar, Badge, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaUserMd, FaRegHospital, FaUsers, FaPills, FaEnvelope } from "react-icons/fa";

// Sidebar Component
const Sidebar = ({ collapsed }) => {
  const location = useLocation();

  return (
    <div
      className={`sidebar bg-white shadow-lg ${
        collapsed ? "w-20" : "w-64"
      } transition-width duration-300 ease-in-out`}
    >
     
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        className="border-r-0"
        theme="light"
        inlineIndent={collapsed ? 0 : 24}
      >
        <Menu.Item key="/" icon={<FaTachometerAlt />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="/doctors" icon={<FaUserMd />}>
          <Link to="/doctors">Doctors</Link>
        </Menu.Item>
        <Menu.Item key="/clinics" icon={<FaRegHospital />}>
          <Link to="/clinics">Clinics</Link>
        </Menu.Item>
        <Menu.Item key="/employees" icon={<FaUsers />}>
          <Link to="/employees">Employees</Link>
        </Menu.Item>
        <Menu.Item key="/pharmacies" icon={<FaPills />}>
          <Link to="/pharmacies">Pharmacies</Link>
        </Menu.Item>
       
      </Menu>
    </div>
  );
};

export default Sidebar;
