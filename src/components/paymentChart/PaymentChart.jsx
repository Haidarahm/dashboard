import React, { useState, useEffect } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import { usePaymentsStore } from "../../store/admin/paymentsStore";
import { useDoctorsStore } from "../../store/admin/doctorsStore";

const SummaryBox = ({ label, value }) => (
  <div className="text-center">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-lg font-semibold">{value}</div>
  </div>
);

const CalendarSelector = ({ isOpen, onClose, onSelectDate, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));
  const months = [
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
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const navigateYear = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentYear + direction);
    setCurrentDate(newDate);
  };

  const selectMonth = (monthIndex) => {
    const newDate = new Date(currentYear, monthIndex, 1);
    setCurrentDate(newDate);
    onSelectDate(newDate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Select Month & Year</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateYear(-1)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-lg font-semibold">{currentYear}</span>
        <button
          onClick={() => navigateYear(1)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => (
          <button
            key={month}
            onClick={() => selectMonth(index)}
            className={`p-2 text-sm border rounded transition-colors ${
              index === currentMonth &&
              currentYear === selectedDate.getFullYear()
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "border-gray-200 hover:bg-blue-50 hover:border-blue-300"
            }`}
          >
            {month.substring(0, 3)}
          </button>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-200">
        <button
          onClick={() => {
            const now = new Date();
            setCurrentDate(now);
            onSelectDate(now);
            onClose();
          }}
          className="w-full p-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Current Month
        </button>
      </div>
    </div>
  );
};

const DoctorSelector = ({ isOpen, onClose, onSelectDoctor, doctors }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-72">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Select Doctor</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {doctors.map((doctor) => (
          <button
            key={`${doctor.id}-${doctor.first_name}`}
            onClick={() => {
              onSelectDoctor(doctor);
              onClose();
            }}
            className="w-full text-left p-3 border border-gray-200 rounded-lg mb-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <div className="font-medium text-gray-800">
              {doctor.first_name} {doctor.last_name}
            </div>
            <div className="text-sm text-gray-500">{doctor.speciality}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default function PaymentChart() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDoctorSelector, setShowDoctorSelector] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [lastFilter, setLastFilter] = useState(null); // 'date' or 'doctor'

  const {
    paymentStats,
    fetchPayments,
    fetchPaymentsByDate,
    fetchPaymentsByDoctor,
    loading,
  } = usePaymentsStore();
  const { doctors, fetchDoctors } = useDoctorsStore();

  useEffect(() => {
    fetchDoctors();
    fetchPayments();
  }, [fetchDoctors, fetchPayments]);

  useEffect(() => {
    if (lastFilter === "date" && selectedDate) {
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = selectedDate.getFullYear();
      fetchPaymentsByDate(`${month}-${year}`);
    } else if (lastFilter === "doctor" && selectedDoctor) {
      fetchPaymentsByDoctor(selectedDoctor.id);
    } else {
      fetchPayments();
    }
  }, [
    selectedDate,
    selectedDoctor,
    lastFilter,
    fetchPaymentsByDate,
    fetchPaymentsByDoctor,
    fetchPayments,
  ]);

  const { totalRevenue, totalAppointments, averagePayment } = paymentStats;
  const percentage =
    totalRevenue > 0 ? Math.min((averagePayment / totalRevenue) * 100, 100) : 0;

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setLastFilter("date");
  };
  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setLastFilter("doctor");
  };
  const formatSelectedDate = (date) =>
    date
      ? date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
      : "All";

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl w-1/3 max-w-md shadow border border-gray-200 relative">
      {/* Header with title and buttons */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-600">
          Payments Details
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Select Month"
          >
            <Calendar size={20} />
          </button>
          <button
            onClick={() => setShowDoctorSelector(!showDoctorSelector)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Select Doctor"
          >
            <User size={20} />
          </button>
        </div>
      </div>
      {/* Selected filters display */}
      <div className="mb-4 text-sm text-gray-600">
        <div>Period: {formatSelectedDate(selectedDate)}</div>
        <div>
          Doctor:{" "}
          {selectedDoctor
            ? `${selectedDoctor.first_name} ${selectedDoctor.last_name}`
            : "All"}
        </div>
      </div>
      {/* Calendar Selector */}
      <CalendarSelector
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        onSelectDate={handleSelectDate}
        selectedDate={selectedDate}
      />
      {/* Doctor Selector */}
      <DoctorSelector
        isOpen={showDoctorSelector}
        onClose={() => setShowDoctorSelector(false)}
        onSelectDoctor={handleSelectDoctor}
        doctors={doctors}
      />
      <div className="w-40 mx-auto mb-6">
        <CircularProgressbarWithChildren
          value={percentage}
          styles={buildStyles({ pathColor: "#007bff", trailColor: "#e5e7eb" })}
        >
          <div className="text-2xl font-bold text-gray-800">
            {percentage.toFixed(1)}%
          </div>
        </CircularProgressbarWithChildren>
      </div>
      <div className="border-t border-gray-200 pt-4 flex justify-around text-sm">
        <SummaryBox
          label="Revenue"
          value={`${totalRevenue.toFixed(2)}$`}
          dollar={true}
        />
        <SummaryBox
          label="Appointments"
          value={totalAppointments}
          dollar={false}
        />
        <SummaryBox
          label="Avg. Payment"
          value={`${averagePayment}%`}
          dollar={true}
        />
      </div>
    </div>
  );
}
