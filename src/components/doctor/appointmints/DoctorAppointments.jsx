import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  UserCheck,
  Filter,
  X,
} from "lucide-react";
import { useAppointmentsStore } from "../../../store/doctor/appointmentsStore";
import { Select, DatePicker } from "antd";
const { Option } = Select;

const DoctorAppointments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const {
    allAppointments,
    filteredAppointments,
    loading,
    fetchAllByDate,
    fetchByStatus,
    fetchByType,
    cancelAppointment,
    clearFilters,
    setCurrentMonthYear,
  } = useAppointmentsStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);

  // Helper to format date as MM-YYYY
  const getMonthYearString = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${year}`;
  };

  // Fetch appointments when month or filters change
  useEffect(() => {
    const monthYear = getMonthYearString(currentDate);

    if (!statusFilter && !typeFilter) {
      fetchAllByDate(monthYear);
      return;
    }

    if (statusFilter && typeFilter) {
      fetchByType(statusFilter, typeFilter, monthYear);
    } else if (statusFilter) {
      fetchByStatus(statusFilter, monthYear);
    } else if (typeFilter) {
      fetchByType("pending", typeFilter, monthYear);
    }

    setCurrentMonthYear(monthYear);
  }, [
    currentDate,
    statusFilter,
    typeFilter,
    fetchAllByDate,
    fetchByStatus,
    fetchByType,
    setCurrentMonthYear,
  ]);

  // Get the appointments to display (filtered or all)
  const getDisplayAppointments = () => {
    if (statusFilter || typeFilter) {
      return filteredAppointments || [];
    }
    return allAppointments;
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

  const handleCancelClick = (appointment) => {
    setAppointmentToCancel(appointment);
    setShowCancelConfirm(true);
    setSidebarOpen(false);
  };

  const handleConfirmCancel = async () => {
    if (!appointmentToCancel) return;

    setIsCancelling(true);

    try {
      const success = await cancelAppointment(appointmentToCancel.id);
      if (success) {
        const monthYear = getMonthYearString(currentDate);

        if (statusFilter && typeFilter) {
          await fetchByType(statusFilter, typeFilter, monthYear);
        } else if (statusFilter) {
          await fetchByStatus(statusFilter, monthYear);
        } else if (typeFilter) {
          await fetchByType("pending", typeFilter, monthYear);
        } else {
          await fetchAllByDate(monthYear);
        }
      }
    } finally {
      setIsCancelling(false);
      setShowCancelConfirm(false);
      setAppointmentToCancel(null);
    }
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
    setStatusFilter(value);
  };

  const handleTypeFilterChange = (value) => {
    setTypeFilter(value);
  };

  const handleClearFilters = () => {
    setStatusFilter(null);
    setTypeFilter(null);
    clearFilters();
    const monthYear = getMonthYearString(currentDate);
    fetchAllByDate(monthYear);
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
      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Cancellation</h3>
            <p className="mb-6">
              Are you sure you want to cancel this appointment?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                No, Keep It
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className={`px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md flex items-center justify-center gap-2 ${
                  isCancelling ? "opacity-75" : ""
                }`}
              >
                {isCancelling && (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {isCancelling ? "Cancelling..." : "Yes, Cancel Appointment"}
              </button>
            </div>
          </div>
        </div>
      )}

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
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {(statusFilter || typeFilter) && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {[statusFilter, typeFilter].filter(Boolean).length}
                  </span>
                )}
              </button>
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
          <div
            style={{
              transition: "max-height 0.3s ease, opacity 0.3s ease",
              overflow: "hidden",
              maxHeight: showFilters ? "200px" : "0",
              opacity: showFilters ? 1 : 0,
            }}
          >
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status:
                  </label>
                  <Select
                    value={statusFilter}
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
                    value={typeFilter}
                    onChange={handleTypeFilterChange}
                    style={{ width: 150 }}
                    allowClear
                    placeholder="Filter by type"
                    disabled={!statusFilter}
                  >
                    <Option value="first time">First Time</Option>
                    <Option value="check up">Check Up</Option>
                  </Select>
                </div>

                {(statusFilter || typeFilter) && (
                  <button
                    onClick={handleClearFilters}
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
                            typeFilter
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

                  {/* Cancel Button */}
                  {(appointment.status === "pending" ||
                    appointment.status === "today") && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleCancelClick(appointment)}
                        className="px-3 py-1 text-sm text-red-600 border border-red-200 hover:bg-red-50 rounded-md transition-colors"
                      >
                        Cancel Appointment
                      </button>
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