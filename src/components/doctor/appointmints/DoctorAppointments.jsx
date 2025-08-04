import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  DollarSign,
  UserCheck,
  X,
} from "lucide-react";
import { useAppointmentsStore } from "../../../store/doctor/appointmentsStore";
import { Select, DatePicker } from "antd";
const { Option } = Select;

const DoctorAppointments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    allAppointments,
    filteredAppointments,
    loading,
    error,
    currentMonthYear,
    fetchAllByDate,
    fetchByStatus,
    fetchByType,
    clearFilters,
    setCurrentMonthYear,
  } = useAppointmentsStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null); // 'status' or 'type'
  const [filterValue, setFilterValue] = useState(null); // The selected filter value

  // Helper to format date as MM-YYYY
  const getMonthYearString = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${year}`;
  };

  // Fetch appointments when month changes
  useEffect(() => {
    const monthYear = getMonthYearString(currentDate);
    
    if (activeFilter === "status" && filterValue) {
      fetchByStatus(filterValue, monthYear);
    } else if (activeFilter === "type" && filterValue) {
      fetchByType(filterValue, monthYear);
    } else {
      fetchAllByDate(monthYear);
    }
    
    setCurrentMonthYear(monthYear);
  }, [currentDate, activeFilter, filterValue, fetchAllByDate, fetchByStatus, fetchByType, setCurrentMonthYear]);

  // Get the appointments to display (filtered or all)
  const getDisplayAppointments = () => {
    return filterValue && filteredAppointments.length > 0
      ? filteredAppointments
      : allAppointments;
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const appointments = getDisplayAppointments();
    return Array.isArray(appointments)
      ? appointments.filter((apt) => apt?.reservation_date === dateStr)
      : [];
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDateObj = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dayAppointments = getAppointmentsForDate(currentDateObj);
      days.push({
        date: new Date(currentDateObj),
        isCurrentMonth: currentDateObj.getMonth() === month,
        appointments: dayAppointments,
      });
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (date, dayAppointments) => {
    setSelectedDate(date);
    setSelectedAppointments(dayAppointments);
    setSidebarOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "visited":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "today":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "visited":
        return <UserCheck className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "today":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "first time":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "check up":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleStatusFilterChange = (value) => {
    const monthYear = getMonthYearString(currentDate);
    
    if (!value) {
      clearFilters();
      setActiveFilter(null);
      setFilterValue(null);
      return;
    }

    setActiveFilter("status");
    setFilterValue(value);
    fetchByStatus(value, monthYear);
  };

  const handleTypeFilterChange = (value) => {
    const monthYear = getMonthYearString(currentDate);
    
    if (!value) {
      // If clearing type filter but status is still active
      if (activeFilter === "status" && filterValue) {
        fetchByStatus(filterValue, monthYear);
      } else {
        clearFilters();
      }
      setActiveFilter("status"); // Revert to status filter if it exists
      setFilterValue(filterValue); // Keep the status filter value
      return;
    }

    setActiveFilter("type");
    setFilterValue(value);
    fetchByType(value, monthYear);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = generateCalendarDays();

  // Loading placeholder squares for the grid only
  const loadingGridSquares = (
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 42 }).map((_, idx) => (
        <div
          key={idx}
          className="min-h-[100px] p-4 border rounded-lg bg-gray-100 animate-pulse"
        ></div>
      ))}
    </div>
  );

  return (
    <div className="flex bg-gray-50 relative overflow-hidden">
      {/* Calendar Section */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out p-6 ${
          sidebarOpen && !loading ? "mr-96" : "mr-0"
        }`}
      >
        <div className="bg-white rounded-lg shadow-sm">
          {/* Calendar Header with Filters */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <DatePicker
                placeholder="Select Date"
                onChange={(date) => {
                  if (date) {
                    const newDate = date.toDate();
                    setCurrentDate(newDate);
                    setSelectedDate(newDate);
                    const dateStr = newDate.toISOString().split("T")[0];
                    const dayAppointments = getDisplayAppointments().filter(
                      (apt) => apt?.reservation_date === dateStr
                    );
                    setSelectedAppointments(dayAppointments);
                    setSidebarOpen(true);
                  }
                }}
                format="YYYY-MM-DD"
                style={{ width: 140 }}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                suffixIcon={
                  <Calendar className="w-4 h-4" style={{ color: "#6B7280" }} />
                }
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Status:
                </label>
                <Select
                  value={activeFilter === "status" ? filterValue : undefined}
                  onChange={handleStatusFilterChange}
                  style={{ width: 150 }}
                  allowClear
                  placeholder="Filter by status"
                >
                  <Option value="today">Today</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="visited">Visited</Option>
                </Select>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Type:
                </label>
                <Select
                  value={activeFilter === "type" ? filterValue : undefined}
                  onChange={handleTypeFilterChange}
                  style={{ width: 150 }}
                  allowClear
                  placeholder="Filter by type"
                  disabled={!filterValue || activeFilter !== "status"}
                >
                  <Option value="first time">First Time</Option>
                  <Option value="check up">Check Up</Option>
                </Select>
              </div>

              {(activeFilter && filterValue) && (
                <button
                  onClick={() => {
                    clearFilters();
                    setActiveFilter(null);
                    setFilterValue(null);
                  }}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}

              <div className="text-sm text-gray-600">
                Showing {getDisplayAppointments().length} appointment
                {getDisplayAppointments().length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-gray-600"
                >
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar Days or Loading Placeholders */}
            {loading ? (
              loadingGridSquares
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[100px] p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                    } ${
                      selectedDate &&
                      selectedDate.toDateString() === day.date.toDateString()
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : ""
                    }`}
                    onClick={() => handleDateClick(day.date, day.appointments)}
                  >
                    <div
                      className={`text-sm font-medium ${
                        day.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {day.date.getDate()}
                    </div>

                    {/* Appointment Indicators */}
                    <div className="mt-1 space-y-1">
                      {day.appointments?.slice(0, 2).map((apt) => (
                        <div
                          key={apt?.id}
                          className={`text-xs px-2 py-1 rounded-full text-center truncate ${
                            activeFilter === "type"
                              ? getTypeColor(apt?.appointment_type)
                              : getStatusColor(apt?.status)
                          }`}
                        >
                          {apt?.reservation_hour?.substring(0, 5)}
                        </div>
                      ))}
                      {day.appointments?.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{day.appointments.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {!loading && (
        <div
          className={`fixed top-0 right-0 h-full w-96 bg-white border-l border-gray-200 p-6 transition-all duration-300 ease-in-out transform ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          } shadow-lg z-50`}
        >
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <h3 className="text-lg font-semibold mb-4">
            {selectedDate
              ? `Appointments - ${selectedDate.toLocaleDateString()}`
              : "Select a date"}
          </h3>

          {selectedAppointments?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {selectedDate
                ? "No appointments for this date"
                : "Click on a date to view appointments"}
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
              {selectedAppointments?.map((appointment) => (
                <div
                  key={appointment?.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Status Badge */}
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-3 ${getStatusColor(
                      appointment?.status
                    )}`}
                  >
                    {getStatusIcon(appointment?.status)}
                    {appointment?.status?.charAt(0)?.toUpperCase() +
                      appointment?.status?.slice(1)}
                  </div>

                  {/* Type Badge */}
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-3 ml-2 ${getTypeColor(
                      appointment?.appointment_type
                    )}`}
                  >
                    {appointment?.appointment_type?.charAt(0)?.toUpperCase() +
                      appointment?.appointment_type?.slice(1)}
                  </div>

                  {/* Appointment Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {appointment?.patient_first_name}{" "}
                          {appointment.patient_last_name}
                        </div>
                        <div className="text-sm text-gray-600">Patient</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {appointment?.reservation_hour}
                        </div>
                        <div className="text-sm text-gray-600">Time</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {appointment?.reservation_date}
                        </div>
                        <div className="text-sm text-gray-600">
                          Reservation Date
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Patient Notes */}
                  {appointment?.notes && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Notes:
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;