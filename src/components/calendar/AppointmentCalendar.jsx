import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, DollarSign, UserCheck, Filter, X } from 'lucide-react';
import { getAllAppointments, getAllAppointmentsByDoctor, getAllAppointmentsByStatus } from '../../api/appointment';

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    doctor_id: '',
    status: '',
    showFilters: false
  });
  
  // Sample doctor list - you might want to fetch this from your API too
  const [doctors] = useState([
    { id: 1, name: 'Judy Omran' },
    { id: 2, name: 'John Smith' },
    { id: 3, name: 'Sarah Johnson' }
  ]);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Apply filters when filter state changes
  useEffect(() => {
    applyFilters();
  }, [filters.doctor_id, filters.status, appointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllAppointments();
      setAppointments(response.data || response);
      setFilteredAppointments(response.data || response);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentsByDoctor = async (doctorId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllAppointmentsByDoctor(doctorId);
      setFilteredAppointments(response.data || response);
    } catch (err) {
      console.error('Error fetching appointments by doctor:', err);
      setError('Failed to filter appointments by doctor');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentsByStatus = async (status) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllAppointmentsByStatus(status);
      setFilteredAppointments(response.data );
      console.log(response)
    } catch (err) {
      console.error('Error fetching appointments by status:', err);
      setError('Failed to filter appointments by status');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    const { doctor_id, status } = filters;
    
    // If both filters are empty, show all appointments
    if (!doctor_id && !status) {
      setFilteredAppointments(appointments);
      return;
    }

    // If only doctor filter is applied
    if (doctor_id && !status) {
      await fetchAppointmentsByDoctor(doctor_id);
      return;
    }

    // If only status filter is applied
    if (status && !doctor_id) {
      await fetchAppointmentsByStatus(status);
      return;
    }

    // If both filters are applied, we need to fetch all and filter locally
    // or you could create a new API endpoint that accepts both parameters
    if (doctor_id && status) {
      try {
        setLoading(true);
        const response = await getAllAppointments();
        const allAppointments = response.data || response;
        const filtered = allAppointments.filter(apt => 
          apt.doctor_id.toString() === doctor_id.toString() && 
          apt.status === status
        );
        setFilteredAppointments(filtered);
      } catch (err) {
        console.error('Error applying combined filters:', err);
        setError('Failed to apply filters');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      doctor_id: '',
      status: '',
      showFilters: false
    });
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredAppointments.filter(apt => apt.reservation_date === dateStr);
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
            onClick={fetchAppointments}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Calendar Section */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Calendar Header with Filters */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={() => setFilters(prev => ({ ...prev, showFilters: !prev.showFilters }))}
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
          {filters.showFilters && (
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Doctor:</label>
                  <select
                    value={filters.doctor_id}
                    onChange={(e) => handleFilterChange('doctor_id', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Doctors</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Status:</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="visited">Visited</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {(filters.doctor_id || filters.status) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                )}

                <div className="text-sm text-gray-600">
                  Showing {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}

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

                {/* Doctor Photo */}
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