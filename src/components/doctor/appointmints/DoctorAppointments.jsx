import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  DollarSign,
  UserCheck,
  Filter,
  X,
} from "lucide-react";
import { useDoctorAppointmentsStore } from "../../../store/doctor/appointmentsStore";
import { Select } from "antd";

const DoctorAppointments = () => {
  const {
    appointments,
    loading,
    error,
    filters,
    setFilters,
    clearFilters,
    fetchAllAppointments,
  } = useDoctorAppointmentsStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchAllAppointments();
  }, [fetchAllAppointments]);

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter(
      (appointment) => appointment.reservation_date === dateStr
    );
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "visited":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "visited":
        return <UserCheck className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "first time":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "checkup":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const resetFilters = () => {
    clearFilters();
  };

  const formatTime = (timeStr) => {
    return timeStr?.substring(0, 5) || "";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAllAppointments}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Calendar Section */}
      <div
        className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "mr-96" : "mr-0"
        }`}
      >
        <div className="bg-white rounded-lg shadow-sm">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={() => setFilters("showFilters", !filters.showFilters)}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {(filters.status || filters.type) && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {[filters.status ? 1 : 0, filters.type ? 1 : 0].reduce(
                      (a, b) => a + b,
                      0
                    )}
                  </span>
                )}
              </button>
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
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronLeft className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {filters.showFilters && (
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status:
                  </label>
                  <Select
                    value={filters.status}
                    onChange={(value) => setFilters("status", value)}
                    className="min-w-[140px]"
                    size="small"
                  >
                    <Select.Option value="">All Statuses</Select.Option>
                    <Select.Option value="pending">Pending</Select.Option>
                    <Select.Option value="visited">Visited</Select.Option>
                    <Select.Option value="cancelled">Cancelled</Select.Option>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Type:
                  </label>
                  <Select
                    value={filters.type}
                    onChange={(value) => setFilters("type", value)}
                    className="min-w-[140px]"
                    size="small"
                    disabled={!filters.status}
                  >
                    <Select.Option value="">All Types</Select.Option>
                    <Select.Option value="first time">First Time</Select.Option>
                    <Select.Option value="checkup">Checkup</Select.Option>
                  </Select>
                </div>

                {(filters.status || filters.type) && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                )}

                <div className="text-sm text-gray-600">
                  Showing {appointments.length} appointment
                  {appointments.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          )}

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

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[80px] p-2 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
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
                    {day.appointments.slice(0, 2).map((apt) => (
                      <div
                        key={apt.id}
                        className={`text-xs px-2 py-1 rounded-full text-center truncate ${getStatusColor(
                          apt.status
                        )}`}
                      >
                        {formatTime(apt.reservation_hour)}
                      </div>
                    ))}
                    {day.appointments.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{day.appointments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white border-l border-gray-200 p-6 transition-all duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } shadow-lg z-50`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-lg font-semibold mb-4">
          {selectedDate
            ? `Appointments - ${selectedDate.toLocaleDateString()}`
            : "Select a date"}
        </h3>

        {selectedAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {selectedDate
              ? "No appointments for this date"
              : "Click on a date to view appointments"}
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
            {selectedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-3 ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {getStatusIcon(appointment.status)}
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </div>

                {/* Appointment Type Badge */}
                <div
                  className={`inline-flex ml-4 items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-3 ${getTypeColor(
                    appointment.appointment_type
                  )}`}
                  style={{ marginBottom: 8 }}
                >
                  {appointment.appointment_type
                    ? appointment.appointment_type.charAt(0).toUpperCase() +
                      appointment.appointment_type.slice(1)
                    : "Type Unknown"}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {appointment.patient_first_name}{" "}
                        {appointment.patient_last_name}
                      </div>
                      <div className="text-sm text-gray-600">Patient</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {formatTime(appointment.reservation_hour)}
                      </div>
                      <div className="text-sm text-gray-600">Time</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {appointment.reservation_date}
                      </div>
                      <div className="text-sm text-gray-600">Date</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Payment Status
                      </div>
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                          appointment.payment_status
                        )}`}
                      >
                        {appointment.payment_status.charAt(0).toUpperCase() +
                          appointment.payment_status.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
