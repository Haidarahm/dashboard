// File: src/pages/pharmacies/Pharmacies.jsx
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
  Form, // Import Form
  TimePicker, // Import TimePicker
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  fetchAllPharmacies,
  deletePharmacy,
  searchPharmacies,
  // Assuming createPharmacy and updatePharmacy exist in this file
  createPharmacy, // <-- Uncommented
  updatePharmacy, // <-- Uncommented
} from "../../api/pharmacies";
import moment from 'moment'; // Import moment for TimePicker

const { Title } = Typography;
const { Search } = Input;

// Define the initial state structure for a new pharmacy
const initialNewPharmacyState = {
  name: "",
  location: "",
  phone: "",
  start_time: null, // Use null initially for TimePicker
  finish_time: null, // Use null initially for TimePicker
  latitude: "",
  longitude: "",
};

function Pharmacies() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'view', 'create', 'edit'
  const [newPharmacyData, setNewPharmacyData] = useState(initialNewPharmacyState); // State for new pharmacy form
  const [editPharmacyData, setEditPharmacyData] = useState(null); // State for edit pharmacy form
  const [form] = Form.useForm(); // Ant Design form instance

  // Fetch pharmacies data
  const fetchPharmacies = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await fetchAllPharmacies();

      // Handle different response structures
      let pharmaciesData = [];
      let totalCount = 0;

      if (Array.isArray(response)) {
        pharmaciesData = response;
        totalCount = response.length;
      } else if (response.data && Array.isArray(response.data)) {
        pharmaciesData = response.data;
        totalCount = response.total || response.count || response.data.length;
      } else if (response.pharmacies && Array.isArray(response.pharmacies)) {
        pharmaciesData = response.pharmacies;
        totalCount =
          response.total || response.count || response.pharmacies.length;
      } else {
        console.warn("Unexpected response structure:", response);
        pharmaciesData = [];
        totalCount = 0;
      }

      setPharmacies(pharmaciesData);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize,
        total: totalCount,
      }));
    } catch (error) {
      console.error("Error fetching pharmacies:", error);

      // More specific error messages
      let errorMessage = "Failed to fetch pharmacies";
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
        errorMessage =
          "Pharmacies endpoint not found. Please check the API URL";
      }
      if (error.response?.status === 401) {
        errorMessage = "Authentication required. Please login again";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Search pharmacies
  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      fetchPharmacies();
      return;
    }

    setSearchLoading(true);
    try {
      const response = await searchPharmacies(searchTerm);
      setPharmacies(response.data || response.pharmacies || response);
      setPagination((prev) => ({
        ...prev,
        current: 1,
        total: response.total || response.count || response.data?.length || 0,
      }));
    } catch (error) {
      console.error("Error searching pharmacies:", error);
      toast.error("Failed to search pharmacies");
    } finally {
      setSearchLoading(false);
    }
  };

  // Delete pharmacy
  const handleDelete = async (pharmacyId) => {
    try {
      await deletePharmacy(pharmacyId);
      toast.success("Pharmacy deleted successfully");
      fetchPharmacies(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("Error deleting pharmacy:", error);
      toast.error("Failed to delete pharmacy");
    }
  };

  // Handle table pagination
  const handleTableChange = (paginationInfo) => {
    fetchPharmacies(paginationInfo.current, paginationInfo.pageSize);
  };

  // Modal handlers
  const openModal = (type, pharmacy = null) => {
    setModalType(type);
    setSelectedPharmacy(pharmacy);
    setShowModal(true);

    if (type === 'create') {
      setNewPharmacyData(initialNewPharmacyState);
      form.resetFields(); // Reset form fields for create
    } else if (type === 'edit' && pharmacy) {
      // Set initial values for edit form
      const editData = {
        ...pharmacy,
        start_time: pharmacy.start_time ? moment(pharmacy.start_time, 'HH:mm') : null,
        finish_time: pharmacy.finish_time ? moment(pharmacy.finish_time, 'HH:mm') : null,
      };
      setEditPharmacyData(editData);
      form.setFieldsValue(editData); // Set form fields for edit
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPharmacy(null);
    setModalType("");
    setNewPharmacyData(initialNewPharmacyState); // Reset create form state
    setEditPharmacyData(null); // Reset edit form state
    form.resetFields(); // Reset form fields
  };

  // Handle form submission for Create/Edit
  const handleFormSubmit = async (values) => {
    setLoading(true); // Indicate loading during submission
    try {
      const pharmacyData = {
        ...values,
        // Format time values back to HH:mm strings
        start_time: values.start_time ? values.start_time.format('HH:mm') : null,
        finish_time: values.finish_time ? values.finish_time.format('HH:mm') : null,
        // Convert coordinates to numbers if necessary, or handle as strings
        latitude: parseFloat(values.latitude),
        longitude: parseFloat(values.longitude),
      };

      if (modalType === 'create') {
        // Call your createPharmacy API function here
        await createPharmacy(pharmacyData); // <-- Actual API call
        toast.success("Pharmacy created successfully"); // <-- Success message
      } else if (modalType === 'edit' && selectedPharmacy) {
        // Call your updatePharmacy API function here
        await updatePharmacy(selectedPharmacy.id, pharmacyData); // <-- Actual API call
        toast.success("Pharmacy updated successfully"); // <-- Success message
      }

      closeModal(); // Close modal on success
      fetchPharmacies(pagination.current, pagination.pageSize); // Refresh list
    } catch (error) {
      console.error(`Error ${modalType}ing pharmacy:`, error);
      // Provide more specific error feedback if possible
      const errorMessage = error.response?.data?.message || `Failed to ${modalType} pharmacy`;
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Stop loading
    }
  };


  // Refresh data
  const handleRefresh = () => {
    fetchPharmacies(pagination.current, pagination.pageSize);
  };

  // Load data on component mount
  useEffect(() => {
    fetchPharmacies();
  }, []);

  // Table columns configuration
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text) => (
        <span style={{ fontWeight: 500, color: "#1890ff" }}>{text}</span>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>
            <EnvironmentOutlined style={{ marginRight: 4, color: "#52c41a" }} />
            {text}
          </span>
        </Tooltip>
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
      title: "Working Hours",
      key: "workingHours",
      render: (_, record) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 4, color: "#fa8c16" }} />
          {record.start_time} - {record.finish_time}
        </span>
      ),
    },
    {
      title: "Coordinates",
      key: "coordinates",
      render: (_, record) => (
        <div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            Lat: {record.latitude}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            Lng: {record.longitude}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        // Ensure start_time and finish_time are valid strings before splitting
        const [startHour, startMin] = (record.start_time || '00:00').split(":").map(Number);
        const [endHour, endMin] = (record.finish_time || '23:59').split(":").map(Number);

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;

        // Handle cases where end time is before start time (e.g., overnight)
        let isOpen = false;
        if (startTime <= endTime) {
            isOpen = currentTime >= startTime && currentTime <= endTime;
        } else { // Overnight hours, e.g., 22:00 - 06:00
            isOpen = currentTime >= startTime || currentTime <= endTime;
        }


        return (
          <Tag color={isOpen ? "green" : "red"}>
            {isOpen ? "Open" : "Closed"}
          </Tag>
        );
      },
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
              title="Are you sure you want to delete this pharmacy?"
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
              Pharmacies Management
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
                Create New Pharmacy
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Search and Actions */}
        <Row gutter={16} style={{ marginBottom: "16px" }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search pharmacies by name..."
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
                Total: {pagination.total} pharmacies
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
            dataSource={pharmacies}
            rowKey="id"
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} pharmacies`,
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
            ? "Pharmacy Details"
            : modalType === "create"
            ? "Create New Pharmacy"
            : "Edit Pharmacy"
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
        {modalType === "view" && selectedPharmacy && (
          <div style={{ padding: "16px 0" }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <strong>Name:</strong> {selectedPharmacy.name}
              </Col>
              <Col span={12}>
                <strong>Phone:</strong> {selectedPharmacy.phone}
              </Col>
              <Col span={24}>
                <strong>Location:</strong> {selectedPharmacy.location}
              </Col>
              <Col span={12}>
                <strong>Start Time:</strong> {selectedPharmacy.start_time}
              </Col>
              <Col span={12}>
                <strong>Finish Time:</strong> {selectedPharmacy.finish_time}
              </Col>
              <Col span={12}>
                <strong>Latitude:</strong> {selectedPharmacy.latitude}
              </Col>
              <Col span={12}>
                <strong>Longitude:</strong> {selectedPharmacy.longitude}
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
                initialValues={modalType === 'edit' ? editPharmacyData : initialNewPharmacyState}
             >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Pharmacy Name"
                            rules={[{ required: true, message: 'Please enter pharmacy name' }]}
                        >
                            <Input placeholder="Enter name" />
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
                    <Col span={24}>
                        <Form.Item
                            name="location"
                            label="Location"
                            rules={[{ required: true, message: 'Please enter location' }]}
                        >
                            <Input placeholder="Enter location" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="start_time"
                            label="Start Time"
                            rules={[{ required: true, message: 'Please select start time' }]}
                        >
                            <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="finish_time"
                            label="Finish Time"
                            rules={[{ required: true, message: 'Please select finish time' }]}
                        >
                            <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="latitude"
                            label="Latitude"
                            rules={[{ required: true, message: 'Please enter latitude' }]}
                        >
                            <Input placeholder="Enter latitude" type="number" step="any" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="longitude"
                            label="Longitude"
                            rules={[{ required: true, message: 'Please enter longitude' }]}
                        >
                            <Input placeholder="Enter longitude" type="number" step="any" />
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

export default Pharmacies;
