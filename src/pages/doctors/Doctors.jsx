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
  Input,
  Row,
  Col,
  Spin,
  Form,
  InputNumber, // Import InputNumber for numeric fields
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  DollarCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  fetchDoctors,
  createDoctor,
  showDoctorDetails, // Although we might not use this directly in the view modal initially
  deleteDoctor,
  // Assuming an updateDoctor function exists in your api/doctors.js
  // import { updateDoctor } from "../../api/doctors";
} from "../../api/doctors";

const { Title } = Typography;
const { Search } = Input;

// Define the initial state structure for a new doctor
const initialNewDoctorState = {
  first_name: "",
  last_name: "",
  department: "",
  email: "",
  phone: "",
  password: "", // Password field for creation
  average_visit_duration: null, // Use null initially for InputNumber
  visit_fee: null, // Use null initially for InputNumber
};

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
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

  // Search doctors (Placeholder - implement actual search API call if available)
  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      fetchDoctorsData(); // Fetch all if search term is empty
      return;
    }

    setSearchLoading(true);
    try {
      // Replace with actual search API call if available
      // const response = await searchDoctors(searchTerm);
      // setDoctors(response.data || response.doctors || response);
      // setPagination((prev) => ({
      //   ...prev,
      //   current: 1,
      //   total: response.total || response.count || response.data?.length || 0,
      // }));

      // --- Temporary client-side filtering if no search API ---
      const filteredDoctors = doctors.filter(doctor =>
        doctor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDoctors(filteredDoctors);
      setPagination(prev => ({ ...prev, current: 1, total: filteredDoctors.length }));
      // --- End Temporary client-side filtering ---

      toast.info(`Showing results for "${searchTerm}"`);

    } catch (error) {
      console.error("Error searching doctors:", error);
      toast.error("Failed to search doctors");
    } finally {
      setSearchLoading(false);
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
      const errorMessage = error.response?.data?.message || "Failed to delete doctor";
      toast.error(errorMessage);
    }
  };

  // Handle table pagination
  const handleTableChange = (paginationInfo) => {
    fetchDoctorsData(paginationInfo.current, paginationInfo.pageSize);
  };

  // Modal handlers
  const openModal = (type, doctor = null) => {
    setModalType(type);
    setSelectedDoctor(doctor);
    setShowModal(true);

    if (type === 'create') {
      form.resetFields(); // Reset form fields for create
      form.setFieldsValue(initialNewDoctorState); // Set initial values
    } else if (type === 'edit' && doctor) {
      // Set initial values for edit form
      // Note: Password is NOT set for editing for security reasons
      const editData = {
        ...doctor,
        // Ensure numeric fields are numbers, not strings
        average_visit_duration: doctor.average_visit_duration ? Number(doctor.average_visit_duration) : null,
        visit_fee: doctor.visit_fee ? Number(doctor.visit_fee) : null,
      };
      form.resetFields(); // Reset form fields before setting new values
      form.setFieldsValue(editData); // Set form fields for edit
    } else if (type === 'view' && doctor) {
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
        average_visit_duration: values.average_visit_duration ? Number(values.average_visit_duration) : null,
        visit_fee: values.visit_fee ? Number(values.visit_fee) : null,
      };

      if (modalType === 'create') {
        // Ensure password is included for creation
        if (!doctorData.password) {
             toast.error("Password is required for creating a doctor.");
             setLoading(false);
             return;
        }
        await createDoctor(doctorData);
        toast.success("Doctor created successfully");
      } else if (modalType === 'edit' && selectedDoctor) {
        // For edit, we typically don't send the password unless it's a specific password change form
        // Remove password from data if it's empty or not intended to be changed via this form
        const dataToUpdate = { ...doctorData };
        delete dataToUpdate.password; // Remove password field for edit

        // Assuming an updateDoctor API function exists
        // await updateDoctor(selectedDoctor.id, dataToUpdate);
        console.log(`Updating doctor ${selectedDoctor.id} with data:`, dataToUpdate); // Placeholder if updateDoctor is not implemented yet
        toast.success("Doctor updated successfully (simulated)"); // Placeholder success
      }

      closeModal(); // Close modal on success
      fetchDoctorsData(pagination.current, pagination.pageSize); // Refresh list
    } catch (error) {
      console.error(`Error ${modalType}ing doctor:`, error);
      const errorMessage = error.response?.data?.message || `Failed to ${modalType} doctor`;
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
      title: "Name",
      key: "name",
      sorter: true,
      render: (_, record) => (
        <span style={{ fontWeight: 500, color: "#1890ff" }}>
          {record.first_name} {record.last_name}
        </span>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      sorter: true,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Email",
dataIndex: "email",
key: "email",
render: (text) => (
  <span>
    <MailOutlined style={{ marginRight: 4, color: "#faad14" }} />
    {text}
  </span>
),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => (
        <span>
          <PhoneOutlined style={{ marginRight: 4, color: "#1890ff" }} />
          {text}
        </span>
      ),
    },
    {
      title: "Avg. Visit Duration (min)",
      dataIndex: "average_visit_duration",
      key: "average_visit_duration",
      render: (text) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 4, color: "#fa8c16" }} />
          {text}
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
          {text}
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

        {/* Search and Actions */}
        <Row gutter={16} style={{ marginBottom: "16px" }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search doctors..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              loading={searchLoading}
            />
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
      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={doctors}
            rowKey="id" // Assuming 'id' is the unique key for doctors
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} doctors`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
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
          modalType !== "view" && ( // Show footer buttons only for create/edit
            <Space>
              <Button onClick={closeModal}>Cancel</Button>
              <Button type="primary" onClick={() => form.submit()} loading={loading}>
                {modalType === 'create' ? 'Create' : 'Save Changes'}
              </Button>
            </Space>
          )
        }
        width={800}
        destroyOnClose={true} // Destroy form fields on close to reset state
      >
        {modalType === "view" && selectedDoctor && (
          <div style={{ padding: "16px 0" }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <strong>Name:</strong> {selectedDoctor.first_name} {selectedDoctor.last_name}
              </Col>
              <Col span={12}>
                <strong>Department:</strong> {selectedDoctor.department}
              </Col>
              <Col span={12}>
                <strong>Email:</strong> {selectedDoctor.email}
              </Col>
              <Col span={12}>
                <strong>Phone:</strong> {selectedDoctor.phone}
              </Col>
              <Col span={12}>
                <strong>Avg. Visit Duration:</strong> {selectedDoctor.average_visit_duration} minutes
              </Col>
              <Col span={12}>
                <strong>Visit Fee:</strong> ${selectedDoctor.visit_fee}
              </Col>
              {/* Add other doctor details here if available in the record */}
            </Row>
          </div>
        )}

        {(modalType === "create" || modalType === "edit") && (
          <div style={{ padding: "16px 0" }}>
             <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
                // initialValues are set in openModal based on type
             >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="first_name"
                            label="First Name"
                            rules={[{ required: true, message: 'Please enter first name' }]}
                        >
                            <Input placeholder="Enter first name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="last_name"
                            label="Last Name"
                            rules={[{ required: true, message: 'Please enter last name' }]}
                        >
                            <Input placeholder="Enter last name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="department"
                            label="Department"
                            rules={[{ required: true, message: 'Please enter department' }]}
                        >
                            <Input placeholder="Enter department" />
                        </Form.Item>
                    </Col>
                     <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Please enter email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input placeholder="Enter email" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="phone"
                            label="Phone Number"
                            rules={[{ required: true, message: 'Please enter phone number' }]}
                        >
                            <Input placeholder="Enter phone number" />
                        </Form.Item>
                    </Col>
                    {modalType === 'create' && ( // Password only required for creation
                        <Col span={12}>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: 'Please enter password' }]}
                            >
                                <Input.Password placeholder="Enter password" />
                            </Form.Item>
                        </Col>
                    )}
                    <Col span={12}>
                        <Form.Item
                            name="average_visit_duration"
                            label="Avg. Visit Duration (min)"
                            rules={[{ required: true, message: 'Please enter average visit duration' }]}
                        >
                            <InputNumber min={1} placeholder="Enter duration" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="visit_fee"
                            label="Visit Fee ($)"
                            rules={[{ required: true, message: 'Please enter visit fee' }]}
                        >
                            <InputNumber min={0} step={0.01} placeholder="Enter fee" style={{ width: '100%' }} />
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
