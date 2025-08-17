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
import useSecretaryAppointmentsStore from "../../store/secretary/appointmentsStore";
import {
  Select,
  DatePicker,
  message,
  Modal,
  Card,
  Descriptions,
  Avatar,
  Tag,
  Button,
  Space,
  Divider,
  Row,
  Col,
  Typography,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  IdcardOutlined,
  FileTextOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

const SecretaryAppointments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [selectedAppointmentModal, setSelectedAppointmentModal] =
    useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320); // Default width in pixels
  const [isResizing, setIsResizing] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'

  const {
    allAppointments,
    filteredAppointments,
    loading,
    fetchAllByDate,
    fetchByDoctor,
    fetchByStatus,
    fetchByDoctorStatus,
    fetchByClinic,
    cancelAppointment,
    cancelDoctorsAppointments,
    clearFilters,
    setCurrentMonthYear,
  } = useSecretaryAppointmentsStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [doctorFilter, setDoctorFilter] = useState(null);
  const [clinicFilter, setClinicFilter] = useState(null);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(null);

  // Helper to format date as MM-YYYY
  const getMonthYearString = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${year}`;
  };

  // Fetch appointments when month or filters change
  useEffect(() => {
    const monthYear = getMonthYearString(currentDate);
    if (!statusFilter && !doctorFilter && !clinicFilter) {
      fetchAllByDate(monthYear);
      return;
    }
    if (doctorFilter && statusFilter) {
      fetchByDoctorStatus(monthYear, statusFilter, doctorFilter);
    } else if (doctorFilter) {
      fetchByDoctor(doctorFilter, monthYear);
    } else if (statusFilter) {
      fetchByStatus(statusFilter, monthYear);
    } else if (clinicFilter) {
      fetchByClinic(monthYear, clinicFilter);
    }
    setCurrentMonthYear(monthYear);
  }, [
    currentDate,
    statusFilter,
    doctorFilter,
    clinicFilter,
    fetchAllByDate,
    fetchByDoctor,
    fetchByStatus,
    fetchByDoctorStatus,
    fetchByClinic,
    setCurrentMonthYear,
  ]);

  // Get the appointments to display (filtered or all)
  const getDisplayAppointments = () => {
    let appointments =
      statusFilter || doctorFilter || clinicFilter
        ? filteredAppointments || []
        : allAppointments;
    // Filter by payment status if selected
    if (paymentStatusFilter) {
      appointments = appointments.filter(
        (apt) => apt?.payment_status === paymentStatusFilter
      );
    }
    return appointments;
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

  const handleCardClick = (appointment) => {
    setSelectedAppointmentModal(appointment);
    setModalVisible(true);
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
        if (doctorFilter && statusFilter) {
          await fetchByDoctorStatus(monthYear, statusFilter, doctorFilter);
        } else if (doctorFilter) {
          await fetchByDoctor(doctorFilter, monthYear);
        } else if (statusFilter) {
          await fetchByStatus(statusFilter, monthYear);
        } else if (clinicFilter) {
          await fetchByClinic(monthYear, clinicFilter);
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

  const handleBulkCancel = async (payload) => {
    setCancelLoading(true);
    try {
      const success = await cancelDoctorsAppointments(payload);
      if (success) {
        message.success("Appointments cancelled successfully.");
        setShowCancelModal(false);
        const monthYear = getMonthYearString(currentDate);
        fetchAllByDate(monthYear);
      } else {
        message.error("Failed to cancel appointments.");
      }
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "visited":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusColorClass = (status) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
      case "visited":
        return <UserCheck className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <X className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  // Payment status badge color
  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentStatusColorClass = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
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

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };
  const handleDoctorFilterChange = (value) => {
    setDoctorFilter(value);
  };
  const handleClinicFilterChange = (value) => {
    setClinicFilter(value);
  };
  const handlePaymentStatusFilterChange = (value) => {
    setPaymentStatusFilter(value);
  };
  const handleClearFilters = () => {
    setStatusFilter(null);
    setDoctorFilter(null);
    setClinicFilter(null);
    setPaymentStatusFilter(null);
    clearFilters();
    const monthYear = getMonthYearString(currentDate);
    fetchAllByDate(monthYear);
  };

  // Handle sidebar resizing
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;

    const newWidth = window.innerWidth - e.clientX;
    const minWidth = 280; // Minimum width
    const maxWidth = window.innerWidth * 0.8; // Maximum 80% of screen width

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Prevent calendar interaction during resize
  const handleCalendarMouseDown = (e) => {
    if (isResizing) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Add event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.body.style.overflow = "hidden"; // Prevent scrolling during resize
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.body.style.overflow = "";
    };
  }, [isResizing]);

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
          className="min-h-[100px] p-2 lg:p-4 border rounded-lg bg-gray-100 animate-pulse"
        ></div>
      ))}
    </div>
  );

  return (
    <div className="flex bg-gray-50 relative overflow-hidden min-h-screen">
      {/* Appointment Details Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between">
            <Title level={4} style={{ margin: 0 }}>
              Appointment Details
            </Title>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        centered
        destroyOnClose
      >
        {selectedAppointmentModal && (
          <Card>
            <Row gutter={[16, 16]}>
              {/* Header with Status Badges */}
              <Col span={24}>
                <div className="flex items-center justify-between mb-4">
                  <Space>
                    <Tag
                      color={getStatusColor(selectedAppointmentModal.status)}
                    >
                      {getStatusIcon(selectedAppointmentModal.status)}
                      {selectedAppointmentModal.status
                        ?.charAt(0)
                        ?.toUpperCase() +
                        selectedAppointmentModal.status?.slice(1)}
                    </Tag>
                    <Tag
                      color={getPaymentStatusColor(
                        selectedAppointmentModal.payment_status
                      )}
                    >
                      {selectedAppointmentModal.payment_status
                        ?.charAt(0)
                        ?.toUpperCase() +
                        selectedAppointmentModal.payment_status?.slice(1)}
                    </Tag>
                  </Space>
                </div>
              </Col>

              {/* Patient Information */}
              <Col span={12}>
                <Card
                  size="small"
                  title="Patient Information"
                  className="h-full"
                >
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Name">
                      <Space>
                        <UserOutlined />
                        {selectedAppointmentModal.patient}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                      <Space>
                        <PhoneOutlined />
                        {selectedAppointmentModal.patient_phone}
                      </Space>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              {/* Doctor Information */}
              <Col span={12}>
                <Card
                  size="small"
                  title="Doctor Information"
                  className="h-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {selectedAppointmentModal.doctor_photo ? (
                      <Avatar
                        size={64}
                        src={selectedAppointmentModal.doctor_photo}
                        icon={<UserOutlined />}
                      />
                    ) : (
                      <Avatar size={64} icon={<UserOutlined />} />
                    )}
                    <div>
                      <Text strong>{selectedAppointmentModal.doctor}</Text>
                    </div>
                  </div>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Phone">
                      <Space>
                        <PhoneOutlined />
                        {selectedAppointmentModal.doctor_phone}
                      </Space>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              {/* Appointment Details */}
              <Col span={24}>
                <Card size="small" title="Appointment Details">
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Date">
                          <Space>
                            <CalendarOutlined />
                            {selectedAppointmentModal.reservation_date}
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Time">
                          <Space>
                            <ClockCircleOutlined />
                            {selectedAppointmentModal.reservation_hour}
                          </Space>
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                    <Col span={8}>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Visit Fee">
                          <Space>
                            <DollarOutlined />$
                            {selectedAppointmentModal.visit_fee}
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Expected Price">
                          <Space>
                            <DollarOutlined />
                            {selectedAppointmentModal.expected_price
                              ? `$${selectedAppointmentModal.expected_price}`
                              : "N/A"}
                          </Space>
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                    <Col span={8}>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Paid Price">
                          <Space>
                            <DollarOutlined />
                            {selectedAppointmentModal.paid_price
                              ? `$${selectedAppointmentModal.paid_price}`
                              : "N/A"}
                          </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Queue Number">
                          <Space>
                            <IdcardOutlined />
                            {selectedAppointmentModal.queue_number || "N/A"}
                          </Space>
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Additional Information */}
              <Col span={24}>
                <Card size="small" title="Additional Information">
                  <Descriptions column={2} size="small">
                    <Descriptions.Item label="Discount Points">
                      {selectedAppointmentModal.discount_points || "N/A"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              {/* Action Buttons */}
              <Col span={24}>
                <div className="flex justify-end gap-2">
                  {(selectedAppointmentModal.status === "pending" ||
                    selectedAppointmentModal.status === "today") && (
                    <Button
                      type="primary"
                      danger
                      icon={<ExclamationCircleOutlined />}
                      onClick={() => {
                        setModalVisible(false);
                        handleCancelClick(selectedAppointmentModal);
                      }}
                    >
                      Cancel Appointment
                    </Button>
                  )}
                  <Button onClick={() => setModalVisible(false)}>Close</Button>
                </div>
              </Col>
            </Row>
          </Card>
        )}
      </Modal>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <ExclamationCircleOutlined className="text-red-500 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Cancellation
              </h3>
            </div>
            <p className="mb-6 text-gray-600 leading-relaxed">
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors font-medium"
              >
                No, Keep It
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className={`px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md flex items-center justify-center gap-2 transition-colors font-medium ${
                  isCancelling ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isCancelling ? (
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
                ) : null}
                {isCancelling ? "Cancelling..." : "Yes, Cancel Appointment"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Calendar Section */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out p-4 lg:p-6`}
        style={{
          marginRight: sidebarOpen && !loading ? "320px" : "0",
          pointerEvents: isResizing ? "none" : "auto",
        }}
        onMouseDown={handleCalendarMouseDown}
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Calendar Header with Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border-b gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {(statusFilter ||
                  doctorFilter ||
                  clinicFilter ||
                  paymentStatusFilter) && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {
                      [
                        statusFilter,
                        doctorFilter,
                        clinicFilter,
                        paymentStatusFilter,
                      ].filter(Boolean).length
                    }
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
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Next month"
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
              maxHeight: showFilters ? "300px" : "0",
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
                    style={{ width: 120 }}
                    allowClear
                    placeholder="Status"
                  >
                    <Option value="pending">Pending</Option>
                    <Option value="visited">Visited</Option>
                    <Option value="cancelled">Cancelled</Option>
                  </Select>
                </div>
                {/* Payment Status Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Payment:
                  </label>
                  <Select
                    value={paymentStatusFilter}
                    onChange={handlePaymentStatusFilterChange}
                    style={{ width: 120 }}
                    allowClear
                    placeholder="Payment"
                  >
                    <Option value="paid">Paid</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="cancelled">Cancelled</Option>
                  </Select>
                </div>
                {/* Doctor Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Doctor:
                  </label>
                  <Select
                    value={doctorFilter}
                    onChange={handleDoctorFilterChange}
                    style={{ width: 150 }}
                    allowClear
                    placeholder="Doctor"
                  >
                    {/* TODO: Populate with doctor list from API/store */}
                  </Select>
                </div>
                {/* Clinic Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Clinic:
                  </label>
                  <Select
                    value={clinicFilter}
                    onChange={handleClinicFilterChange}
                    style={{ width: 150 }}
                    allowClear
                    placeholder="Clinic"
                  >
                    {/* TODO: Populate with clinic list from API/store */}
                  </Select>
                </div>
                {(statusFilter ||
                  doctorFilter ||
                  clinicFilter ||
                  paymentStatusFilter) && (
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
                  className="p-2 text-center text-sm font-semibold text-gray-700 bg-gray-50 rounded-t-lg"
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
                    className={`min-h-[100px] p-2 lg:p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                    } ${
                      selectedDate &&
                      selectedDate.toDateString() === day.date.toDateString()
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : ""
                    }`}
                    onClick={() => handleDateClick(day.date, day.appointments)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleDateClick(day.date, day.appointments);
                      }
                    }}
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
                          className={`text-xs px-2 py-1 rounded-full text-center truncate border ${getStatusColorClass(
                            apt?.status
                          )}`}
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
          className={`fixed top-0 right-0 h-full bg-white border-l border-gray-200 p-4 lg:p-6 transition-transform duration-300 ease-in-out transform ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          } shadow-lg z-50`}
          style={{
            width: sidebarOpen ? `${sidebarWidth}px` : "320px",
            pointerEvents: "auto",
          }}
        >
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Resize Handle */}
          {sidebarOpen && (
            <div
              className={`absolute left-0 top-0 bottom-0 w-2 z-10 ${
                isResizing
                  ? "bg-blue-500 cursor-col-resize"
                  : "bg-gray-200 hover:bg-gray-300 cursor-col-resize"
              }`}
              onMouseDown={handleMouseDown}
              title="Drag to resize sidebar"
            >
              {/* Resize Handle Grip */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-gray-400 rounded-full" />
            </div>
          )}
          {/* Resize Overlay */}
          {isResizing && (
            <div className="absolute inset-0 bg-blue-50 bg-opacity-30 pointer-events-none z-5" />
          )}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedDate
                ? `Appointments - ${selectedDate.toLocaleDateString()}`
                : "Select a date"}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setViewMode(viewMode === "list" ? "grid" : "list")
                }
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title={
                  viewMode === "list"
                    ? "Switch to Grid View"
                    : "Switch to List View"
                }
              >
                {viewMode === "list" ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {selectedAppointments?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {selectedDate
                ? "No appointments for this date"
                : "Click on a date to view appointments"}
            </div>
          ) : (
            <div
              className={`overflow-y-auto max-h-[calc(100vh-120px)] pr-2 ${
                viewMode === "grid"
                  ? `grid gap-4 ${
                      sidebarWidth >= 600
                        ? "grid-cols-3"
                        : sidebarWidth >= 450
                        ? "grid-cols-2"
                        : "grid-cols-1"
                    }`
                  : "space-y-4"
              }`}
            >
              {selectedAppointments?.map((appointment) => (
                <div
                  key={appointment?.id}
                  className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white ${
                    viewMode === "grid" ? "h-fit" : ""
                  }`}
                  onClick={() => handleCardClick(appointment)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCardClick(appointment);
                    }
                  }}
                >
                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColorClass(
                        appointment?.status
                      )}`}
                    >
                      {getStatusIcon(appointment?.status)}
                      {appointment?.status?.charAt(0)?.toUpperCase() +
                        appointment?.status?.slice(1)}
                    </div>
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColorClass(
                        appointment?.payment_status
                      )}`}
                    >
                      {appointment?.payment_status?.charAt(0)?.toUpperCase() +
                        appointment?.payment_status?.slice(1)}
                    </div>
                  </div>
                  {/* Appointment Details */}
                  <div
                    className={`space-y-3 ${
                      viewMode === "grid" ? "text-sm" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 truncate">
                          {appointment?.patient}
                        </div>
                        <div className="text-sm text-gray-600">Patient</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 truncate">
                          {appointment?.doctor}
                        </div>
                        <div className="text-sm text-gray-600">Doctor</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Clock className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900">
                          {appointment?.reservation_hour}
                        </div>
                        <div className="text-sm text-gray-600">Time</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Calendar className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
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
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        Notes:
                      </h4>
                      <p
                        className={`text-gray-600 leading-relaxed ${
                          viewMode === "grid"
                            ? "text-xs line-clamp-2"
                            : "text-sm"
                        }`}
                      >
                        {appointment.notes}
                      </p>
                    </div>
                  )}
                  {/* Cancel Button */}
                  {(appointment.status === "pending" ||
                    appointment.status === "today") && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelClick(appointment);
                        }}
                        className="px-3 py-2 text-sm text-red-600 border border-red-200 hover:bg-red-50 rounded-md transition-colors font-medium"
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

export default SecretaryAppointments;
