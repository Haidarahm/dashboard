import { FaRegCalendarCheck } from "react-icons/fa6";
import { MdOutlinePayments } from "react-icons/md";
import {
  FaChartBar,
  FaUserMd,
  FaRegHospital,
  FaUsers,
  FaPills,
} from "react-icons/fa";
import { TbVaccine } from "react-icons/tb";
import { FaCalendarDay } from "react-icons/fa";
import { PiUsersThreeFill } from "react-icons/pi";

export const adminRoutes = [
  {
    key: "/appointments",
    icon: FaRegCalendarCheck,
    label: "Appointments",
    path: "/appointments",
  },
  {
    key: "/dashboard",
    icon: FaChartBar,
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
  {
    key: "/vaccins",
    icon: TbVaccine,
    label: "Vaccins",
    path: "/vaccins",
  },
];

export const doctorRoutes = [
  {
    key: "/todays-appointments",
    icon: FaCalendarDay,
    label: "Todays Appointments",
    path: "/todays-appointments",
  },
  {
    key: "/appointments",
    icon: FaRegCalendarCheck,
    label: "Appointments",
    path: "/appointments",
  },
  {
    key: "/patients",
    icon: PiUsersThreeFill,
    label: "Patients",
    path: "/patients",
  },
];
