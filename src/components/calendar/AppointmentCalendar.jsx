import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, DollarSign, UserCheck } from 'lucide-react';

const AppointmentCalendar = () => {
  // Sample data from your backend
  const [appointments] = useState([
    {
      id: 1,
      patient: "Naya Salha",
      doctor: "Judy Omran",
      doctor_id: 1,
      doctor_photo: null,
      visit_fee: 50.5,
      reservation_date: "2025-07-02",
      timeSelected: "12:00:00",
      status: "visited"
    },
    {
      id: 2,
      patient: "Naya Salha",
      doctor: "Judy Omran",
      doctor_id: 1,
      doctor_photo: null,
      visit_fee: 50.5,
      reservation_date: "2025-07-09",
      timeSelected: "12:00:00",
      status: "pending"
    }
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.reservation_date === dateStr);
  };

  // Generate calendar days
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
        appointments: dayAppointments
      });
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (date, dayAppointments) => {
    setSelectedDate(date);
    setSelectedAppointments(dayAppointments);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'visited':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'visited':
        return <UserCheck className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = generateCalendarDays();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Calendar Section */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
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

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
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
                    day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${
                    selectedDate && selectedDate.toDateString() === day.date.toDateString()
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : ''
                  }`}
                  onClick={() => handleDateClick(day.date, day.appointments)}
                >
                  <div className={`text-sm font-medium ${
                    day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {day.date.getDate()}
                  </div>
                  
                  {/* Appointment Indicators */}
                  <div className="mt-1 space-y-1">
                    {day.appointments.slice(0, 2).map(apt => (
                      <div
                        key={apt.id}
                        className={`text-xs px-2 py-1 rounded-full text-center truncate ${getStatusColor(apt.status)}`}
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
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-96 bg-white border-l border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {selectedDate ? `Appointments - ${selectedDate.toLocaleDateString()}` : 'Select a date'}
        </h3>

        {selectedAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {selectedDate ? 'No appointments for this date' : 'Click on a date to view appointments'}
          </div>
        ) : (
          <div className="space-y-4">
            {selectedAppointments.map(appointment => (
              <div
                key={appointment.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Status Badge */}
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-3 ${getStatusColor(appointment.status)}`}>
                  {getStatusIcon(appointment.status)}
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </div>

                {/* Appointment Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">{appointment.patient}</div>
                      <div className="text-sm text-gray-600">Patient</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">Dr. {appointment.doctor}</div>
                      <div className="text-sm text-gray-600">Doctor</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">{appointment.timeSelected}</div>
                      <div className="text-sm text-gray-600">Time</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">${appointment.visit_fee}</div>
                      <div className="text-sm text-gray-600">Visit Fee</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">{appointment.reservation_date}</div>
                      <div className="text-sm text-gray-600">Reservation Date</div>
                    </div>
                  </div>
                </div>

                {/* Doctor Photo Placeholder */}
                {appointment.doctor_photo ? (
                  <div className="mt-3 flex items-center gap-2">
                    <img
                      src={appointment.doctor_photo}
                      alt={`Dr. ${appointment.doctor}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600">Dr. {appointment.doctor}</span>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-600">Dr. {appointment.doctor}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCalendar;