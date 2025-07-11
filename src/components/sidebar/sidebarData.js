import { FaRegCalendarCheck } from "react-icons/fa6";
import { MdOutlinePayments } from "react-icons/md";
import { FaUserMd, FaRegHospital, FaUsers, FaPills } from "react-icons/fa";

export const adminRoutes = [
  {
    key: "/appointments",
    icon: FaRegCalendarCheck,
    label: "Appointments",
    path: "/appointments",
  },
  {
    key: "/dashboard",
    icon: MdOutlinePayments,
    label: "Dashboard",
    path: "/dashboard",
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

export const doctorRoutes = [
  {
    key: "/appointments",
    icon: FaRegCalendarCheck,
    label: "Appointments",
    path: "/appointments",
  },
  {
    key: "/patients",
    icon: FaRegCalendarCheck,
    label: "Patients",
    path: "/patients",
  },
];
