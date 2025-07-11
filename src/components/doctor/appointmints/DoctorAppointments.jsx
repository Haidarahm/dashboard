import React, { useState, useMemo } from 'react';
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

const appointmentsData = {
  "message": "Appointments retrieved successfully",
  "data": [
    {
      "id": 4,
      "patient_first_name": "Sara",
      "patient_last_name": "Salha",
      "reservation_date": "2025-07-30",
      "reservation_hour": "12:00:00",
      "status": "cancelled",
      "appointment_type": "first time",
      "payment_status": "cancelled"
    },
    {
      "id": 5,
      "patient_first_name": "Naya",
      "patient_last_name": "Salha",
      "reservation_date": "2025-07-30",
      "reservation_hour": "14:00:00",
      "status": "visited",
      "appointment_type": "first time",
      "payment_status": "paid"
    },
    {
      "id": 6,
      "patient_first_name": "Naya",
      "patient_last_name": "Salha",
      "reservation_date": "2025-07-14",
      "reservation_hour": "15:00:00",
      "status": "pending",
      "appointment_type": "first time",
      "payment_status": "paid"
    },
    {
      "id": 7,
      "patient_first_name": "John",
      "patient_last_name": "Doe",
      "reservation_date": "2025-07-16",
      "reservation_hour": "09:00:00",
      "status": "pending",
      "appointment_type": "checkup",
      "payment_status": "pending"
    },
    {
      "id": 8,
      "patient_first_name": "Emily",
      "patient_last_name": "Johnson",
      "reservation_date": "2025-07-16",
      "reservation_hour": "11:00:00",
      "status": "visited",
      "appointment_type": "checkup",
      "payment_status": "paid"
    },
    {
      "id": 9,
      "patient_first_name": "Michael",
      "patient_last_name": "Brown",
      "reservation_date": "2025-07-16",
      "reservation_hour": "13:00:00",
      "status": "cancelled",
      "appointment_type": "first time",
      "payment_status": "cancelled"
    },
    {
      "id": 10,
      "patient_first_name": "Lisa",
      "patient_last_name": "Davis",
      "reservation_date": "2025-07-17",
      "reservation_hour": "10:00:00",
      "status": "pending",
      "appointment_type": "checkup",
      "payment_status": "pending"
    },
    {
      "id": 11,
      "patient_first_name": "Robert",
      "patient_last_name": "Wilson",
      "reservation_date": "2025-07-17",
      "reservation_hour": "14:00:00",
      "status": "visited",
      "appointment_type": "first time",
      "payment_status": "paid"
    },
    {
      "id": 12,
      "patient_first_name": "Amanda",
      "patient_last_name": "Garcia",
      "reservation_date": "2025-07-18",
      "reservation_hour": "09:30:00",
      "status": "pending",
      "appointment_type": "checkup",
      "payment_status": "paid"
    },
    {
      "id": 13,
      "patient_first_name": "David",
      "patient_last_name": "Martinez",
      "reservation_date": "2025-07-18",
      "reservation_hour": "16:00:00",
      "status": "cancelled",
      "appointment_type": "first time",
      "payment_status": "cancelled"
    }
  ]
};

const DoctorAppointments = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredAppointments = useMemo(() => {
    return appointmentsData.data.filter(appointment => {
      const statusMatch = statusFilter === 'all' || appointment.status === statusFilter;
      const typeMatch = typeFilter === 'all' || appointment.appointment_type === typeFilter;
      return statusMatch && typeMatch;
    });
  }, [statusFilter, typeFilter]);

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return filteredAppointments.filter(
      appointment => appointment.reservation_date === dateStr
    );
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
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
      case 'first time':
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 'checkup':
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return "bg-green-100 text-green-800 border-green-200";
      case 'pending':
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'cancelled':
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const formatTime = (timeStr) => {
    return timeStr.substring(0, 5);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = generateCalendarDays();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Calendar Section */}
      <div className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'mr-96' : 'mr-0'
      }`}>
        <div className="bg-white rounded-lg shadow-sm">
          {/* Calendar Header */}
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
                {(statusFilter !== 'all' || typeFilter !== 'all') && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {[statusFilter !== 'all' ? 1 : 0, typeFilter !== 'all' ? 1 : 0].reduce((a, b) => a + b, 0)}
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
          {showFilters && (
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Status:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="visited">Visited</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Type:</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="first time">First Time</option>
                    <option value="checkup">Checkup</option>
                  </select>
                </div>

                {(statusFilter !== 'all' || typeFilter !== 'all') && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                )}

                <div className="text-sm text-gray-600">
                  Showing {filteredAppointments.length} appointment
                  {filteredAppointments.length !== 1 ? "s" : ""}
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
      <div className={`fixed top-0 right-0 h-full w-96 bg-white border-l border-gray-200 p-6 transition-all duration-300 ease-in-out transform ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      } shadow-lg z-50`}>
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

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {appointment.patient_first_name} {appointment.patient_last_name}
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

                <div className="mt-3 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-600">
                    ID: #{appointment.id}
                  </span>
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