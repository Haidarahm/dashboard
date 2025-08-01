// File: src/pages/doctors/Doctors.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Card,
  Modal,
  Popconfirm,
  Tag,
  Tooltip,
  Row,
  Col,
  Spin,
  Form,
  InputNumber,
  Select,
  Avatar,
  Input,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  DollarCircleOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined as ClockIcon,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useClinicsStore } from "../../../store/admin/clinicsStore";
import { toast } from "react-toastify";
import { useDoctorsStore } from "../../../store/admin/doctorsStore";
import DoctorDetails from "./DoctorDetails";

const { Title } = Typography;
const { Option } = Select;

// Define the initial state structure for a new doctor
const initialNewDoctorState = {
  first_name: "",
  last_name: "",
  speciality: "",
  email: "",
  phone: "",
  password: "",
  average_visit_duration: null,
  visit_fee: null,
  experience: null,
  professional_title: "",
  status: "available",
  clinic_id: 1,
};

function DoctorsTable({ onShowReviews }) {
  const {
    doctors,
    loading,
    error,
    doctorDetails,
    fetchDoctors,
    createDoctor: createDoctorAction,
    showDoctorDetails: showDoctorDetailsAction,
    deleteDoctor: deleteDoctorAction,
    showDoctorsByClinic: showDoctorsByClinicAction,
    setDoctorDetails,
    clearDoctorDetails,
  } = useDoctorsStore();

  // Clinics from Zustand store
  const clinics = useClinicsStore((state) => state.clinics);
  const fetchClinics = useClinicsStore((state) => state.fetchClinics);
  const clinicsLoading = useClinicsStore((state) => state.loading);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [form] = Form.useForm();
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState("all");

  // Fetch doctors and clinics on mount
  useEffect(() => {
    fetchDoctors();
    if (!clinics || clinics.length === 0) {
      fetchClinics();
    }
  }, [fetchDoctors, fetchClinics]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total: doctors.length,
    }));
  }, [doctors]);

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
    setModalType("");
    form.resetFields();
    clearDoctorDetails();
  };

  const handleFormSubmit = async (values) => {
    try {
      const doctorData = {
        ...values,
        average_visit_duration: values.average_visit_duration
          ? Number(values.average_visit_duration)
          : null,
        visit_fee: values.visit_fee ? Number(values.visit_fee) : null,
      };
      if (modalType === "create") {
        const createPayload = {
          first_name: doctorData.first_name,
          last_name: doctorData.last_name,
          clinic_id: `${doctorData.clinic_id}`,
          average_visit_duration: `${doctorData.average_visit_duration} min`,
          visit_fee: doctorData.visit_fee,
          phone: doctorData.phone,
          email: doctorData.email,
          password: doctorData.password,
        };
        await createDoctorAction(createPayload);
        toast.success("Doctor created successfully");
      }
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefresh = async () => {
    setSelectedClinic("all");
    await fetchDoctors();
  };

  const handleViewDoctor = async (doctor) => {
    setModalType("view");
    setShowModal(true);
    setDetailsLoading(true);
    clearDoctorDetails();
    try {
      await showDoctorDetailsAction(doctor.id);
    } catch (error) {
      toast.error("Failed to fetch doctor details");
      clearDoctorDetails();
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDelete = async (doctorId) => {
    try {
      await deleteDoctorAction(doctorId);
      toast.success("Doctor deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete doctor");
    }
  };

  const handleTableChange = (paginationInfo) => {
    fetchDoctors(paginationInfo.current, paginationInfo.pageSize);
  };

  // Get status color and icon
  const getStatusConfig = (status) => {
    switch (status) {
      case "available":
        return {
          color: "green",
          icon: <CheckCircleOutlined />,
          text: "Available",
        };
      case "notAvailable":
        return {
          color: "red",
          icon: <CloseCircleOutlined />,
          text: "Not Available",
        };
      case "busy":
        return { color: "orange", icon: <ClockIcon />, text: "Busy" };
      default:
        return {
          color: "default",
          icon: <ClockIcon />,
          text: status || "Unknown",
        };
    }
  };

  // Modal handlers
  const openModal = async (type, doctor = null) => {
    setModalType(type);
    setSelectedDoctor(doctor);
    setShowModal(true);

    if (type === "create") {
      form.resetFields(); // Reset form fields for create
      form.setFieldsValue(initialNewDoctorState); // Set initial values
      // Fetch clinics for the select menu
      // try {
      //   const clinicsData = await getAllClinics();
      //
      //   setClinics(clinicsData);
      // } catch (e) {
      //   setClinics([]);
      // }
    }
  };

  const handleClinicFilterChange = async (value) => {
    setSelectedClinic(value);
    if (value === "all") {
      await fetchDoctors();
    } else {
      await showDoctorsByClinicAction(value);
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: "Photo",
      key: "photo",
      width: 80,
      render: (_, record) => (
        <Avatar
          size={40}
          src={record.photo}
          icon={<UserOutlined />}
          style={{ backgroundColor: record.photo ? "transparent" : "#1890ff" }}
        />
      ),
    },
    {
      title: "Name",
      key: "name",
      sorter: true,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, color: "#1890ff" }}>
            {record.first_name} {record.last_name}
          </div>
          {record.professional_title && (
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.professional_title}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Speciality",
      dataIndex: "speciality",
      key: "speciality",
      sorter: true,
      render: (text) =>
        text ? (
          <Tag color="blue">{text}</Tag>
        ) : (
          <span style={{ color: "#999" }}>Not specified</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, record) => (
        <div>
          <div>
            <MailOutlined style={{ marginRight: 4, color: "#faad14" }} />
            {record.email}
          </div>
          <div>
            <PhoneOutlined style={{ marginRight: 4, color: "#1890ff" }} />
            {record.phone}
          </div>
        </div>
      ),
    },

    {
      title: "Visit Duration",
      dataIndex: "average_visit_duration",
      key: "average_visit_duration",
      render: (text) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 4, color: "#fa8c16" }} />
          {text ? `${text}` : "Not specified"}
        </span>
      ),
    },
    {
      title: "Visit Fee",
      dataIndex: "visit_fee",
      key: "visit_fee",
      render: (text) => (
        <span>
          <DollarCircleOutlined style={{ marginRight: 4, color: "#52c41a" }} />
          {text ? `$${text}` : "Not specified"}
        </span>
      ),
    },
    {
      title: "Patients Treated",
      dataIndex: "treated",
      key: "treated",
      render: (text) => (
        <span>
          <MedicineBoxOutlined style={{ marginRight: 4, color: "#722ed1" }} />
          {text || 0}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Reviews">
            <Button
              type="text"
              icon={<StarOutlined style={{ color: "#faad14" }} />}
              onClick={() => onShowReviews(record)}
            />
          </Tooltip>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDoctor(record)}
              style={{ color: "#1890ff" }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this doctor?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              okType="danger"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                style={{ color: "#ff4d4f" }}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Header Section */}
      <Card style={{ marginBottom: "24px" }}>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "16px" }}
        >
          <Col>
            <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              Doctors Management
            </Title>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal("create")}
                size="large"
              >
                Create New Doctor
              </Button>
            </Space>
          </Col>
        </Row>
        <Row style={{ marginBottom: "16px" }} gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Select
              value={selectedClinic}
              onChange={handleClinicFilterChange}
              style={{ width: "100%" }}
            >
              <Option value="all">All Clinics</Option>
              {console.log(clinics)}
              {clinics?.map((clinic) => (
                <Option key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={16} style={{ textAlign: "right" }}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                Refresh
              </Button>
              <span style={{ color: "#666" }}>
                Total: {pagination.total} doctors
              </span>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table Section */}

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={doctors}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} doctors`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1400 }}
          size="middle"
        />
      </Spin>

      {/* Modal for View/Create */}
      <Modal
        title={modalType === "view" ? "Doctor Details" : "Create New Doctor"}
        open={showModal}
        onCancel={closeModal}
        footer={
          modalType !== "view" && (
            <Space>
              <Button onClick={closeModal}>Cancel</Button>
              <Button
                type="primary"
                onClick={() => form.submit()}
                loading={loading}
              >
                {modalType === "create" ? "Create" : "Save Changes"}
              </Button>
            </Space>
          )
        }
        width={900}
        // destroyOnClose={true}
        destroyOnHidden={true}
      >
        {modalType === "view" &&
          (detailsLoading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin size="large" />
            </div>
          ) : (
            <DoctorDetails doctor={doctorDetails} />
          ))}
        {modalType === "create" && (
          <div style={{ padding: "16px 0" }}>
            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="first_name"
                    label="First Name"
                    rules={[
                      { required: true, message: "Please enter first name" },
                    ]}
                  >
                    <Input placeholder="Enter first name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="last_name"
                    label="Last Name"
                    rules={[
                      { required: true, message: "Please enter last name" },
                    ]}
                  >
                    <Input placeholder="Enter last name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Please enter email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input placeholder="Enter email" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                      { required: true, message: "Please enter phone number" },
                    ]}
                  >
                    <Input placeholder="Enter phone number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="average_visit_duration"
                    label="Visit Duration"
                    rules={[
                      {
                        required: true,
                        message: "Please select visit duration",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select visit duration"
                      style={{ width: "100%" }}
                    >
                      <Option value={10}>10 minutes</Option>
                      <Option value={15}>20 minutes</Option>
                      <Option value={20}>30 minutes</Option>
                      <Option value={30}>45 minutes</Option>
                      <Option value={60}>60 minutes</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="visit_fee"
                    label="Visit Fee ($)"
                    rules={[
                      { required: true, message: "Please enter visit fee" },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      step={0.01}
                      placeholder="Enter fee"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="clinic_id"
                    label="Clinic"
                    rules={[
                      { required: true, message: "Please select a clinic" },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Select a clinic"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {clinics.map((clinic) => (
                        <Option key={clinic.id} value={clinic.id}>
                          {clinic.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={
                      modalType === "create"
                        ? [{ required: true, message: "Please enter password" }]
                        : []
                    }
                  >
                    <Input.Password placeholder="Enter password" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default DoctorsTable;
