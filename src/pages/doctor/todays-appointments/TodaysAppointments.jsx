import React, { useEffect } from "react";
import { Card, Table, Spin, Typography, Tag } from "antd";
import { useAppointmentsStore } from "../../../store/doctor/appointmentsStore";

const { Title } = Typography;

function TodaysAppointments() {
  const {
    filteredAppointments,
    loading,
    error,
    fetchByStatus,
    setCurrentMonthYear,
  } = useAppointmentsStore();

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const monthYear = `${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${today.getFullYear()}`;

  useEffect(() => {
    setCurrentMonthYear(monthYear);
    fetchByStatus("today", todayStr);
    // eslint-disable-next-line
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Patient Name",
      key: "patient_name",
      render: (_, record) =>
        `${record.patient_first_name || ""} ${record.patient_last_name || ""}`,
    },
    {
      title: "Reservation Hour",
      dataIndex: "reservation_hour",
      key: "reservation_hour",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "visited" ? "green" : "blue"}>{status}</Tag>
      ),
    },
    {
      title: "Appointment Type",
      dataIndex: "appointment_type",
      key: "appointment_type",
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (payment_status) => (
        <Tag color={payment_status === "paid" ? "green" : "red"}>
          {payment_status}
        </Tag>
      ),
    },
    {
      title: "Referred By",
      dataIndex: "referred by",
      key: "referred by",
    },
    {
      title: "Is Child",
      dataIndex: "is_child",
      key: "is_child",
      render: (is_child) => (is_child ? "Yes" : "No"),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card style={{ marginBottom: "24px" }}>
        <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
          Today's Appointments
        </Title>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredAppointments}
            rowKey="id"
            pagination={false}
            size="middle"
            style={{ marginTop: 24 }}
          />
        </Spin>
        {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
      </Card>
    </div>
  );
}

export default TodaysAppointments;
