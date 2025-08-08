import React from "react";
import { Card, Typography, Tag, Table, Button, Spin } from "antd";
import { CloseOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title } = Typography;

const PatientAppointments = ({
  appointments,
  onClose,
  isVisible,
  loading,
  onTableChange,
  currentPage,
  pageSize,
  total,
}) => {
  if (!appointments && !loading) {
    return (
      <Card
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease-in-out",
          transform: isVisible ? "scale(1)" : "scale(0)",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <Title level={4} type="secondary">
          Select a patient to view appointments
        </Title>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease-in-out",
          transform: isVisible ? "scale(1)" : "scale(0)",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Title level={4} type="secondary">
              Loading appointments...
            </Title>
          </div>
        </div>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "visited":
        return "green";
      case "cancelled":
        return "red";
      case "pending":
        return "orange";
      case "confirmed":
        return "blue";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case "paid":
        return "green";
      case "unpaid":
        return "red";
      case "pending":
        return "orange";
      default:
        return "default";
    }
  };

  const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date} ${time}`);
    return (
      dateObj.toLocaleDateString() +
      " " +
      dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Date & Time",
      key: "datetime",
      render: (_, record) => (
        <div>
          <div>{record.reservation_date}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.reservation_hour}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Type",
      dataIndex: "appointment_type",
      key: "appointment_type",
      width: 120,
      render: (type) => (
        <Tag color="blue">{type.charAt(0).toUpperCase() + type.slice(1)}</Tag>
      ),
    },
    {
      title: "Info",
      dataIndex: "appointment_info",
      key: "appointment_info",
      width: 100,
    },
    {
      title: "Payment",
      dataIndex: "payment_status",
      key: "payment_status",
      width: 100,
      render: (paymentStatus) => (
        <Tag color={getPaymentStatusColor(paymentStatus)}>
          {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Referred By",
      dataIndex: "referred by",
      key: "referred_by",
      width: 120,
      render: (referredBy) => referredBy || "-",
    },
    {
      title: "Child",
      dataIndex: "is_child",
      key: "is_child",
      width: 80,
      render: (isChild) => (
        <Tag color={isChild ? "orange" : "default"}>
          {isChild ? "Yes" : "No"}
        </Tag>
      ),
    },
  ];

  return (
    <Card
      style={{
        height: "100%",
        transition: "all 0.3s ease-in-out",
        transform: isVisible ? "scale(1)" : "scale(0)",
        opacity: isVisible ? 1 : 0,
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Title level={3} style={{ color: "#1890ff", margin: 0 }}>
          Patient Appointments
        </Title>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          style={{
            border: "none",
            padding: "4px",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f0f0f0";
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.transform = "scale(1)";
          }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={appointments?.data || []}
        rowKey="id"
        pagination={{
          current: currentPage || 1,
          pageSize: pageSize || 5,
          total: total || 0,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} appointments`,
        }}
        size="middle"
        scroll={{ x: 800 }}
        onChange={onTableChange}
        loading={loading}
      />
    </Card>
  );
};

export default PatientAppointments;
