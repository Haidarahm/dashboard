import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Tag,
  Space,
  Pagination,
  Spin,
  message,
  Select,
  Row,
  Col,
  Typography,
} from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import useCancelledAppointmentsStore from "../../store/secretary/cancelledAppointmentsStore";

const { Title } = Typography;
const { Option } = Select;

function CancelledAppointments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [readFilter, setReadFilter] = useState("all");

  const {
    cancelledAppointments,
    loading,
    error,
    pagination,
    fetchCancelledAppointments,
    setCurrentPage: setStoreCurrentPage,
  } = useCancelledAppointmentsStore();

  useEffect(() => {
    fetchCancelledAppointments(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    setStoreCurrentPage(page);
  };

  const handleReadFilterChange = (value) => {
    setReadFilter(value);
    setCurrentPage(1);
    setStoreCurrentPage(1);
  };

  const handleRefresh = () => {
    fetchCancelledAppointments(currentPage, pageSize);
  };

  const getReadStatusColor = (status) => {
    switch (status) {
      case "seen":
        return "green";
      case "not seen":
        return "red";
      default:
        return "default";
    }
  };

  const getReadStatusIcon = (status) => {
    switch (status) {
      case "seen":
        return <EyeOutlined />;
      case "not seen":
        return <EyeInvisibleOutlined />;
      default:
        return null;
    }
  };

  const getReadStatusText = (status) => {
    switch (status) {
      case "seen":
        return "Seen";
      case "not seen":
        return "Not Seen";
      default:
        return status;
    }
  };

  // Filter appointments based on read status
  const filteredAppointments =
    readFilter === "all"
      ? cancelledAppointments
      : cancelledAppointments.filter((apt) => apt.read === readFilter);

  const columns = [
    {
      title: "Patient Name",
      key: "patientName",
      render: (_, record) => (
        <span>
          {record.patientFisrtName} {record.patientLastName}
        </span>
      ),
      sorter: (a, b) => {
        const nameA =
          `${a.patientFisrtName} ${a.patientLastName}`.toLowerCase();
        const nameB =
          `${b.patientFisrtName} ${b.patientLastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "N/A",
    },
    {
      title: "Doctor",
      dataIndex: "doctor_name",
      key: "doctor_name",
      sorter: (a, b) => a.doctor_name.localeCompare(b.doctor_name),
    },
    {
      title: "Appointment Date",
      dataIndex: "appointment_date",
      key: "appointment_date",
      sorter: (a, b) =>
        new Date(a.appointment_date) - new Date(b.appointment_date),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Appointment Time",
      dataIndex: "appointment_time",
      key: "appointment_time",
      render: (time) => time.substring(0, 5), // Remove seconds
    },
    {
      title: "Read Status",
      dataIndex: "read",
      key: "read",
      render: (status) => (
        <Tag
          color={getReadStatusColor(status)}
          icon={getReadStatusIcon(status)}
        >
          {getReadStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: "Seen", value: "seen" },
        { text: "Not Seen", value: "not seen" },
      ],
      onFilter: (value, record) => record.read === value,
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={handleRefresh} type="primary">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={8}>
            <Title level={3} style={{ margin: 0 }}>
              Cancelled Appointments
            </Title>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space>
              <span className="text-sm text-gray-600">Read Status:</span>
              <Select
                value={readFilter}
                onChange={handleReadFilterChange}
                style={{ width: 120 }}
              >
                <Option value="all">All</Option>
                <Option value="seen">Seen</Option>
                <Option value="not seen">Not Seen</Option>
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={24} md={8} className="text-right">
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Refresh
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredAppointments}
          rowKey={(record) =>
            `${record.patientFisrtName}-${record.patientLastName}-${record.appointment_date}-${record.appointment_time}`
          }
          loading={loading}
          pagination={false}
          scroll={{ x: 800 }}
          size="middle"
        />

        <div className="mt-6 text-center">
          <Pagination
            current={currentPage}
            total={pagination.total}
            pageSize={pageSize}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} items`
            }
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            pageSizeOptions={["10", "20", "50"]}
          />
        </div>
      </Card>
    </div>
  );
}

export default CancelledAppointments;
