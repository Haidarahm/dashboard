import React, { useState, useEffect } from "react";
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
import { useAppointmentStore } from "../../store/admin/appointmentStore";
import { useDoctorsStore } from "../../store/admin/doctorsStore";
import { Select, DatePicker } from "antd";
const { Option } = Select;

const AppointmentCalendar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    appointments,
    loading,
    filters,
    setFilters,
    clearFilters,
    fetchAppointmentsByMonth,
  } = useAppointmentStore();

  const { doctors, fetchDoctors } = useDoctorsStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);

  // Helper to format date as MM-YYYY
  const getMonthYearString = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${year}`;
  };

  // Fetch appointments when date changes, considering current filters
  useEffect(() => {
    const currentMonthDate = getMonthYearString(currentDate);

    if (filters.doctor_id && filters.status) {
      // Both filters are active - use combined filter
      setFilters("status", filters.status, currentMonthDate);
    } else if (filters.doctor_id) {
      // Only doctor filter is active
      setFilters("doctor_id", filters.doctor_id, currentMonthDate);
    } else if (filters.status) {
      // Only status filter is active
      setFilters("status", filters.status, currentMonthDate);
    } else {
      // No filters active - fetch appointments for current month
      fetchAppointmentsByMonth(currentMonthDate);
    }
  }, [
    currentDate,
    filters.doctor_id,
    filters.status,
    fetchAppointmentsByMonth,
    setFilters,
  ]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleFilterChange = (filterType, value) => {
    // Get current month date for filtering
    const currentMonthDate = getMonthYearString(currentDate);

    // Clear the current month filter when applying status or doctor filters
    if ((filterType === "status" || filterType === "doctor_id") && value) {
      // The setFilters function will automatically trigger the appropriate API call with date
      setFilters(filterType, value, currentMonthDate);
    } else {
      setFilters(filterType, value, currentMonthDate);
    }
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter((apt) => apt.reservation_date === dateStr);
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
    // The useEffect will automatically handle refetching data with the new date
  };

  const handleDateClick = (date, dayAppointments) => {
    setSelectedDate(date);
    setSelectedAppointments(dayAppointments);
    setSidebarOpen(true);
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
    <div className="flex  bg-gray-50 relative overflow-hidden">
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
                onClick={() => setFilters("showFilters", !filters.showFilters)}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {(filters.doctor_id || filters.status) && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {[filters.doctor_id, filters.status].filter(Boolean).length}
                  </span>
                )}
              </button>
              <DatePicker
                placeholder="Select Date"
                onChange={(date) => {
                  if (date) {
                    setCurrentDate(date.toDate());
                    setSelectedDate(date.toDate());
                    // Get appointments for the selected date
                    const dateStr = date.toDate().toISOString().split("T")[0];
                    const dayAppointments = appointments.filter(
                      (apt) => apt.reservation_date === dateStr
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
              transition:
                "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)",
              overflow: "hidden",
              maxHeight: filters.showFilters ? 500 : 0,
              opacity: filters.showFilters ? 1 : 0,
              pointerEvents: filters.showFilters ? "auto" : "none",
              visibility: filters.showFilters ? "visible" : "hidden",
            }}
          >
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Doctor Filter Dropdown */}
                <label
                  htmlFor="doctor-filter"
                  className="block text-sm font-medium mb-1"
                >
                  Doctor
                </label>
                <Select
                  id="doctor-filter"
                  value={filters.doctor_id}
                  onChange={(value) => handleFilterChange("doctor_id", value)}
                  style={{ width: "100%", marginBottom: 12 }}
                  allowClear
                  placeholder="All Doctors"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="">All Doctors</Option>
                  {doctors.map((doc) => (
                    <Option key={doc.id} value={doc.id}>
                      {doc.first_name} {doc.last_name}
                    </Option>
                  ))}
                </Select>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status:
                  </label>
                  <Select
                    value={filters.status}
                    onChange={(value) => handleFilterChange("status", value)}
                    style={{ width: "100%" }}
                    allowClear
                    placeholder="All Statuses"
                  >
                    <Option value="">All Statuses</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="visited">Visited</Option>
                    <Option value="cancelled">Cancelled</Option>
                  </Select>
                </div>

                {(filters.doctor_id || filters.status) && (
                  <button
                    onClick={() => {
                      clearFilters();
                      // After clearing filters, fetch appointments for current month
                      fetchAppointmentsByMonth(getMonthYearString(currentDate));
                    }}
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
                    className={`min-h-[100px]  p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
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
                          {apt.timeSelected.substring(0, 5)}
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
                  {/* Status Badge */}
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-3 ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {getStatusIcon(appointment.status)}
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </div>

                  {/* Appointment Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {appointment.patient}
                        </div>
                        <div className="text-sm text-gray-600">Patient</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          Dr. {appointment.doctor}
                        </div>
                        <div className="text-sm text-gray-600">Doctor</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {appointment.timeSelected}
                        </div>
                        <div className="text-sm text-gray-600">Time</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          ${appointment.visit_fee}
                        </div>
                        <div className="text-sm text-gray-600">Visit Fee</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {appointment.reservation_date}
                        </div>
                        <div className="text-sm text-gray-600">
                          Reservation Date
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Photo */}
                  {appointment.doctor_photo ? (
                    <div className="mt-3 flex items-center gap-2">
                      <img
                        src={appointment.doctor_photo}
                        alt={`Dr. ${appointment.doctor}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-600">
                        Dr. {appointment.doctor}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-600">
                        Dr. {appointment.doctor}
                      </span>
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

export default AppointmentCalendar;
