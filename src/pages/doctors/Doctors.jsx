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
  TrophyOutlined,
  StarOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined as ClockIcon,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  fetchDoctors,
  createDoctor,
  showDoctorDetails,
  //   deleteDoctor,
  // Assuming an updateDoctor function exists in your api/doctors.js
  // import { updateDoctor } from "../../api/doctors";
} from "../../api/doctors";

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

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'view', 'create', 'edit'
  const [form] = Form.useForm(); // Ant Design form instance

  // Fetch doctors data
  const fetchDoctorsData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await fetchDoctors();
      console.log(response)
      // Handle different response structures (adjust based on your actual API response)
      let doctorsData = [];
      let totalCount = 0;

      if (Array.isArray(response)) {
        doctorsData = response;
        totalCount = response.length;
      } else if (response.data && Array.isArray(response.data)) {
        doctorsData = response.data;
        totalCount = response.total || response.count || response.data.length;
      } else if (response.doctors && Array.isArray(response.doctors)) {
        doctorsData = response.doctors;
        totalCount =
          response.total || response.count || response.doctors.length;
      } else {
        console.warn("Unexpected response structure:", response);
        doctorsData = [];
        totalCount = 0;
      }

      setDoctors(doctorsData);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize,
        total: totalCount,
      }));
    } catch (error) {
      console.error("Error fetching doctors:", error);

      let errorMessage = "Failed to fetch doctors";
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      if (
        error.code === "NETWORK_ERROR" ||
        error.message?.includes("Network Error")
      ) {
        errorMessage =
          "Network error: Please check your internet connection and server status";
      }
      if (error.response?.status === 404) {
        errorMessage = "Doctors endpoint not found. Please check the API URL";
      }
      if (error.response?.status === 401) {
        errorMessage = "Authentication required. Please login again";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete doctor
  const handleDelete = async (doctorId) => {
    try {
      await deleteDoctor(doctorId);
      toast.success("Doctor deleted successfully");
      fetchDoctorsData(pagination.current, pagination.pageSize); // Refresh list
    } catch (error) {
      console.error("Error deleting doctor:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete doctor";
      toast.error(errorMessage);
    }
  };

  // Handle table pagination
  const handleTableChange = (paginationInfo) => {
    fetchDoctorsData(paginationInfo.current, paginationInfo.pageSize);
  };

  // Get status color and icon
  const getStatusConfig = (status) => {
    switch (status) {
      case "available":
        return { color: "green", icon: <CheckCircleOutlined />, text: "Available" };
      case "notAvailable":
        return { color: "red", icon: <CloseCircleOutlined />, text: "Not Available" };
      case "busy":
        return { color: "orange", icon: <ClockIcon />, text: "Busy" };
      default:
        return { color: "default", icon: <ClockIcon />, text: status || "Unknown" };
    }
  };

  // Modal handlers
  const openModal = (type, doctor = null) => {
    setModalType(type);
    setSelectedDoctor(doctor);
    setShowModal(true);

    if (type === "create") {
      form.resetFields(); // Reset form fields for create
      form.setFieldsValue(initialNewDoctorState); // Set initial values
    } else if (type === "edit" && doctor) {
      // Set initial values for edit form
      // Note: Password is NOT set for editing for security reasons
      const editData = {
        ...doctor,
        // Ensure numeric fields are numbers, not strings
        average_visit_duration: doctor.average_visit_duration
          ? Number(doctor.average_visit_duration)
          : null,
        visit_fee: doctor.visit_fee ? Number(doctor.visit_fee) : null,
        experience: doctor.experience ? Number(doctor.experience) : null,
      };
      form.resetFields(); // Reset form fields before setting new values
      form.setFieldsValue(editData); // Set form fields for edit
    } else if (type === "view" && doctor) {
      // For view, we just need the selectedDoctor state
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
    setModalType("");
    form.resetFields(); // Reset form fields on close
  };

  // Handle form submission for Create/Edit
  const handleFormSubmit = async (values) => {
    setLoading(true); // Indicate loading during submission
    try {
      const doctorData = {
        ...values,
        // Ensure numeric fields are numbers
        average_visit_duration: values.average_visit_duration
          ? Number(values.average_visit_duration)
          : null,
        visit_fee: values.visit_fee ? Number(values.visit_fee) : null,
        experience: values.experience ? Number(values.experience) : null,
      };

      if (modalType === "create") {
        // Ensure password is included for creation
        if (!doctorData.password) {
          toast.error("Password is required for creating a doctor.");
          setLoading(false);
          return;
        }
        await createDoctor(doctorData);
        toast.success("Doctor created successfully");
      } else if (modalType === "edit" && selectedDoctor) {
        // For edit, we typically don't send the password unless it's a specific password change form
        // Remove password from data if it's empty or not intended to be changed via this form
        const dataToUpdate = { ...doctorData };
        delete dataToUpdate.password; // Remove password field for edit

        // Assuming an updateDoctor API function exists
        // await updateDoctor(selectedDoctor.id, dataToUpdate);
        console.log(
          `Updating doctor ${selectedDoctor.id} with data:`,
          dataToUpdate
        ); // Placeholder if updateDoctor is not implemented yet
        toast.success("Doctor updated successfully (simulated)"); // Placeholder success
      }

      closeModal(); // Close modal on success
      fetchDoctorsData(pagination.current, pagination.pageSize); // Refresh list
    } catch (error) {
      console.error(`Error ${modalType}ing doctor:`, error);
      const errorMessage =
        error.response?.data?.message || `Failed to ${modalType} doctor`;
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Refresh data
  const handleRefresh = () => {
    fetchDoctorsData(pagination.current, pagination.pageSize);
  };

  // Load data on component mount
  useEffect(() => {
    fetchDoctorsData();
  }, []);

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
          style={{ backgroundColor: record.photo ? 'transparent' : '#1890ff' }}
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
            <div style={{ fontSize: '12px', color: '#666' }}>
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
      render: (text) => text ? <Tag color="blue">{text}</Tag> : <span style={{ color: '#999' }}>Not specified</span>,
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
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      render: (text) => (
        <span>
          <TrophyOutlined style={{ marginRight: 4, color: "#fa8c16" }} />
          {text ? `${text} years` : 'Not specified'}
        </span>
      ),
    },
    {
      title: "Visit Duration",
      dataIndex: "average_visit_duration",
      key: "average_visit_duration",
      render: (text) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 4, color: "#fa8c16" }} />
          {text ? `${text} min` : 'Not specified'}
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
          {text ? `$${text}` : 'Not specified'}
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
      title: "Rating",
      dataIndex: "finalRate",
      key: "finalRate",
      render: (text) => (
        <span>
          <StarOutlined style={{ marginRight: 4, color: "#faad14" }} />
          {text ? `${text}/5` : 'No rating'}
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
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => openModal("view", record)}
              style={{ color: "#1890ff" }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openModal("edit", record)}
              style={{ color: "#52c41a" }}
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

        {/* Actions */}
        <Row style={{ marginBottom: "16px" }}>
          <Col span={24} style={{ textAlign: "right" }}>
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
      <Card>
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
      </Card>

      {/* Modal for View/Create/Edit */}
      <Modal
        title={
          modalType === "view"
            ? "Doctor Details"
            : modalType === "create"
            ? "Create New Doctor"
            : "Edit Doctor"
        }
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
        destroyOnClose={true}
      >
        {modalType === "view" && selectedDoctor && (
          <div style={{ padding: "16px 0" }}>
            <Row gutter={[16, 16]}>
              <Col span={24} style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Avatar
                  size={80}
                  src={selectedDoctor.photo}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: selectedDoctor.photo ? 'transparent' : '#1890ff' }}
                />
              </Col>
              <Col span={12}>
                <strong>Name:</strong> {selectedDoctor.first_name} {selectedDoctor.last_name}
              </Col>
              <Col span={12}>
                <strong>Professional Title:</strong> {selectedDoctor.professional_title || 'Not specified'}
              </Col>
              <Col span={12}>
                <strong>Speciality:</strong> {selectedDoctor.speciality || 'Not specified'}
              </Col>
              <Col span={12}>
                <strong>Status:</strong> 
                <Tag color={getStatusConfig(selectedDoctor.status).color} style={{ marginLeft: 8 }}>
                  {getStatusConfig(selectedDoctor.status).text}
                </Tag>
              </Col>
              <Col span={12}>
                <strong>Email:</strong> {selectedDoctor.email}
              </Col>
              <Col span={12}>
                <strong>Phone:</strong> {selectedDoctor.phone}
              </Col>
              <Col span={12}>
                <strong>Experience:</strong> {selectedDoctor.experience ? `${selectedDoctor.experience} years` : 'Not specified'}
              </Col>
              <Col span={12}>
                <strong>Avg. Visit Duration:</strong> {selectedDoctor.average_visit_duration ? `${selectedDoctor.average_visit_duration} minutes` : 'Not specified'}
              </Col>
              <Col span={12}>
                <strong>Visit Fee:</strong> {selectedDoctor.visit_fee ? `$${selectedDoctor.visit_fee}` : 'Not specified'}
              </Col>
              <Col span={12}>
                <strong>Patients Treated:</strong> {selectedDoctor.treated || 0}
              </Col>
              <Col span={12}>
                <strong>Rating:</strong> {selectedDoctor.finalRate ? `${selectedDoctor.finalRate}/5` : 'No rating'}
              </Col>
              <Col span={12}>
                <strong>Clinic ID:</strong> {selectedDoctor.clinic_id}
              </Col>
            </Row>
          </div>
        )}

        {(modalType === "create" || modalType === "edit") && (
          <div style={{ padding: "16px 0" }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFormSubmit}
            >
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
                    name="professional_title"
                    label="Professional Title"
                  >
                    <Input placeholder="Enter professional title" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="speciality"
                    label="Speciality"
                  >
                    <Input placeholder="Enter speciality" />
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
                {modalType === "create" && (
                  <Col span={12}>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: "Please enter password" },
                      ]}
                    >
                      <Input.Password placeholder="Enter password" />
                    </Form.Item>
                  </Col>
                )}
                <Col span={12}>
                  <Form.Item
                    name="experience"
                    label="Experience (years)"
                  >
                    <InputNumber
                      min={0}
                      placeholder="Enter years of experience"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="average_visit_duration"
                    label="Avg. Visit Duration (min)"
                  >
                    <InputNumber
                      min={1}
                      placeholder="Enter duration"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="visit_fee"
                    label="Visit Fee ($)"
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
                    name="status"
                    label="Status"
                  >
                    <Select placeholder="Select status">
                      <Option value="available">Available</Option>
                      <Option value="notAvailable">Not Available</Option>
                      <Option value="busy">Busy</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="clinic_id"
                    label="Clinic ID"
                    rules={[
                      { required: true, message: "Please enter clinic ID" },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      placeholder="Enter clinic ID"
                      style={{ width: "100%" }}
                    />
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

export default Doctors;
