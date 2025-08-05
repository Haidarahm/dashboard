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
  Form,
  TimePicker,
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
  createPharmacy,
  updatePharmacy,
} from "../../../api/admin/pharmacies";
import moment from "moment";
import MapWithMovableMarker from "../../../components/map/MapWithMovableMarker";

const { Title } = Typography;
const { Search } = Input;

const initialNewPharmacyState = {
  name: "",
  location: "",
  phone: "",
  start_time: null,
  finish_time: null,
  latitude: "",
  longitude: "",
};

function Pharmacies() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [newPharmacyData, setNewPharmacyData] = useState(
    initialNewPharmacyState
  );
  const [editPharmacyData, setEditPharmacyData] = useState(null);
  const [form] = Form.useForm();
  const [markerPosition, setMarkerPosition] = useState([34.6402, 39.0494]);

  // Fetch pharmacies with improved pagination handling
  const fetchPharmacies = async (page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const response = await fetchAllPharmacies(page, pageSize);
      console.log("API Response:", response); // Debug log

      // Handle different response structures
      let pharmaciesData = [];
      let totalCount = 0;

      if (response && typeof response === "object") {
        // Check for common response patterns
        if (response.data && Array.isArray(response.data)) {
          pharmaciesData = response.data;
          totalCount = response.meta.total;
        }
      } else {
        console.warn("Invalid response:", response);
        pharmaciesData = [];
        totalCount = 0;
      }

      setPharmacies(pharmaciesData);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: totalCount,
      }));
    } catch (error) {
      console.error("Error fetching pharmacies:", error);

      toast.error(error);

      // Reset to empty state on error
      setPharmacies([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  // Search pharmacies with pagination reset
  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      // Reset to first page when clearing search
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchPharmacies(1, pagination.pageSize);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await searchPharmacies(searchTerm);
      const searchResults =
        response.data || response.pharmacies || response || [];

      setPharmacies(searchResults);
      setPagination((prev) => ({
        ...prev,
        current: 1, // Reset to first page for search results
        total: searchResults.length,
      }));
    } catch (error) {
      console.error("Error searching pharmacies:", error);
      toast.error("Failed to search pharmacies");
    } finally {
      setSearchLoading(false);
    }
  };

  // Delete pharmacy with proper refresh
  const handleDelete = async (pharmacyId) => {
    try {
      await deletePharmacy(pharmacyId);
      toast.success("Pharmacy deleted successfully");

      // Calculate if we need to go back a page after deletion
      const currentPageItems = pharmacies.length;
      const shouldGoToPreviousPage =
        currentPageItems === 1 && pagination.current > 1;

      if (shouldGoToPreviousPage) {
        const newPage = pagination.current - 1;
        setPagination((prev) => ({ ...prev, current: newPage }));
        fetchPharmacies(newPage, pagination.pageSize);
      } else {
        fetchPharmacies(pagination.current, pagination.pageSize);
      }
    } catch (error) {
      console.error("Error deleting pharmacy:", error);
      toast.error("Failed to delete pharmacy");
    }
  };

  // Handle table pagination changes
  const handleTableChange = (paginationInfo, filters, sorter) => {
    console.log("Pagination change:", paginationInfo); // Debug log

    const { current, pageSize } = paginationInfo;

    // Update pagination state
    setPagination((prev) => ({
      ...prev,
      current: current,
      pageSize: pageSize,
    }));

    // Fetch new data
    fetchPharmacies(current, pageSize);
  };

  // Modal handlers
  const openModal = (type, pharmacy = null) => {
    setModalType(type);
    setSelectedPharmacy(pharmacy);
    setShowModal(true);

    if (type === "create") {
      setNewPharmacyData(initialNewPharmacyState);
      setMarkerPosition([34.6402, 39.0494]);
      form.resetFields();
    } else if (type === "edit" && pharmacy) {
      const editData = {
        ...pharmacy,
        start_time: pharmacy.start_time
          ? moment(pharmacy.start_time, "HH:mm")
          : null,
        finish_time: pharmacy.finish_time
          ? moment(pharmacy.finish_time, "HH:mm")
          : null,
      };
      setEditPharmacyData(editData);
      setMarkerPosition([
        parseFloat(pharmacy.latitude) || 34.6402,
        parseFloat(pharmacy.longitude) || 39.0494,
      ]);
      form.setFieldsValue(editData);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPharmacy(null);
    setModalType("");
    setNewPharmacyData(initialNewPharmacyState);
    setEditPharmacyData(null);
    form.resetFields();
  };

  // Handle form submission
  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const pharmacyData = {
        ...values,
        start_time: values.start_time
          ? values.start_time.format("HH:mm")
          : null,
        finish_time: values.finish_time
          ? values.finish_time.format("HH:mm")
          : null,
        latitude: parseFloat(values.latitude),
        longitude: parseFloat(values.longitude),
      };

      if (modalType === "create") {
        await createPharmacy(pharmacyData);
        toast.success("Pharmacy created successfully");
      } else if (modalType === "edit" && selectedPharmacy) {
        await updatePharmacy(selectedPharmacy.id, pharmacyData);
        toast.success("Pharmacy updated successfully");
      }

      closeModal();
      fetchPharmacies(pagination.current, pagination.pageSize);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    fetchPharmacies(pagination.current, pagination.pageSize);
  };

  // Load data on component mount
  useEffect(() => {
    fetchPharmacies(1, 5);
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
        const [startHour, startMin] = (record.start_time || "00:00")
          .split(":")
          .map(Number);
        const [endHour, endMin] = (record.finish_time || "23:59")
          .split(":")
          .map(Number);

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;

        let isOpen = false;
        console.log(now);
        if (startTime <= endTime) {
          isOpen = currentTime >= startTime && currentTime <= endTime;
        } else {
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
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
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
        width={800}
        destroyOnClose={true}
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
              initialValues={
                modalType === "edit"
                  ? editPharmacyData
                  : initialNewPharmacyState
              }
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Pharmacy Name"
                    rules={[
                      { required: true, message: "Please enter pharmacy name" },
                    ]}
                  >
                    <Input placeholder="Enter name" />
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
                <Col span={24}>
                  <Form.Item
                    name="location"
                    label="Location"
                    rules={[
                      { required: true, message: "Please enter location" },
                    ]}
                  >
                    <Input placeholder="Enter location" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="start_time"
                    label="Start Time"
                    rules={[
                      { required: true, message: "Please select start time" },
                    ]}
                  >
                    <TimePicker format="HH:mm" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="finish_time"
                    label="Finish Time"
                    rules={[
                      { required: true, message: "Please select finish time" },
                    ]}
                  >
                    <TimePicker format="HH:mm" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <div style={{ marginTop: 24 }}>
                    <label
                      style={{
                        fontWeight: 600,
                        color: "#444",
                        marginBottom: 8,
                        display: "block",
                      }}
                    >
                      Select Location on Map
                    </label>
                    <MapWithMovableMarker
                      position={markerPosition}
                      setPosition={(pos) => {
                        setMarkerPosition(pos);
                        form.setFieldsValue({
                          latitude: pos[0],
                          longitude: pos[1],
                        });
                      }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="latitude"
                    label="Latitude"
                    rules={[
                      { required: true, message: "Please enter latitude" },
                    ]}
                  >
                    <Input
                      placeholder="Enter latitude"
                      type="number"
                      step="any"
                      onChange={(e) => {
                        const lat = parseFloat(e.target.value);
                        setMarkerPosition([lat, markerPosition[1]]);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="longitude"
                    label="Longitude"
                    rules={[
                      { required: true, message: "Please enter longitude" },
                    ]}
                  >
                    <Input
                      placeholder="Enter longitude"
                      type="number"
                      step="any"
                      onChange={(e) => {
                        const lng = parseFloat(e.target.value);
                        setMarkerPosition([markerPosition[0], lng]);
                      }}
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

export default Pharmacies;
