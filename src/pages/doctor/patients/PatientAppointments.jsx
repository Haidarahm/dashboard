import React from "react";
import {
  Card,
  Typography,
  Tag,
  Table,
  Button,
  Spin,
  Tooltip,
  Space,
  Popover,
  Descriptions,
} from "antd";
import {
  CloseOutlined,
  CalendarOutlined,
  FileTextOutlined,
  EyeOutlined,
} from "@ant-design/icons";

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
  onViewResults,
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
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Popover
              content={
                <div style={{ maxWidth: "300px" }}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="ID">
                      {record.id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Patient Name">
                      {record.patient_first_name} {record.patient_last_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Date">
                      {record.reservation_date}
                    </Descriptions.Item>
                    <Descriptions.Item label="Time">
                      {record.reservation_hour.slice(0, 5)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <Tag color={getStatusColor(record.status)}>
                        {record.status.charAt(0).toUpperCase() +
                          record.status.slice(1)}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Type">
                      <Tag color="blue">
                        {record.appointment_type.charAt(0).toUpperCase() +
                          record.appointment_type.slice(1)}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Info">
                      {record.appointment_info || "Not specified"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Status">
                      <Tag color={getPaymentStatusColor(record.payment_status)}>
                        {record.payment_status.charAt(0).toUpperCase() +
                          record.payment_status.slice(1)}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Referred By">
                      {record["referred by"] || "Not specified"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Child Appointment">
                      <Tag color={record.is_child ? "orange" : "default"}>
                        {record.is_child ? "Yes" : "No"}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              }
              title="Appointment Details"
              trigger="click"
              placement="left"
            >
              <Button icon={<EyeOutlined />} type="default" size="small" />
            </Popover>
          </Tooltip>
          <Tooltip title="View Results">
            <Button
              icon={<FileTextOutlined />}
              onClick={() => onViewResults(record.id)}
              disabled={record.status !== "visited"}
              type="default"
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Date & Time",
      key: "datetime",
      width: 120,
      render: (_, record) => (
        <div>
          <div>{record.reservation_date}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.reservation_hour.slice(0, 5)}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Payment",
      dataIndex: "payment_status",
      key: "payment_status",
      width: 80,
      render: (paymentStatus) => (
        <Tag color={getPaymentStatusColor(paymentStatus)}>
          {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
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
        onChange={onTableChange}
        loading={loading}
        style={{ width: "100%" }}
      />
    </Card>
  );
};

export default PatientAppointments;
