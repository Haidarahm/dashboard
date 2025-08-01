import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Card,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Space,
  Popconfirm,
  Row,
  Col,
  Image,
  Tag,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  getAllClinics,
  createClinic,
  updateClinic,
  deleteClinic,
} from "../../../api/admin/clinics";
import {
  EyeIcon,
  Building2,
  Users,
  DollarSign,
  CalendarDays,
  Image as LucideImage,
} from "lucide-react";

const { Title } = Typography;
const { Option } = Select;

function Clinics() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'create', 'edit', 'view'
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // Custom styles for image preview
  const imageStyle = {
    width: 50,
    height: 50,
    objectFit: "cover",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const imageHoverStyle = {
    transform: "scale(1.1)",
  };

  const fetchClinicsData = async () => {
    setLoading(true);
    try {
      const response = await getAllClinics();
      let clinicsData = [];
      if (Array.isArray(response)) {
        clinicsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        clinicsData = response.data;
      } else if (response.clinics && Array.isArray(response.clinics)) {
        clinicsData = response.clinics;
      } else {
        clinicsData = [];
      }
      setClinics(clinicsData);
    } catch (error) {
      setClinics([]);
      toast.error("Failed to fetch clinics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinicsData();
  }, []);

  const openModal = (type, clinic = null) => {
    setModalType(type);
    setSelectedClinic(clinic);
    setFileList([]); // Reset file list

    if (type === "create") {
      form.resetFields();
    } else if (type === "edit" && clinic) {
      form.setFieldsValue({ name: clinic.name });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClinic(null);
    setModalType("");
    form.resetFields();
    setFileList([]);
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    const { name } = values;

    // Get the actual file object, not the Ant Design wrapper
    const photo =
      fileList.length > 0 ? fileList[0].originFileObj || fileList[0] : null;

    // Additional validation to ensure we have a valid file
    if (photo && !(photo instanceof File)) {
      toast.error("Please select a valid image file");
      setLoading(false);
      return;
    }

    try {
      if (modalType === "create") {
        await createClinic(name, photo);
        toast.success("Clinic created successfully");
      } else if (modalType === "edit" && selectedClinic) {
        await updateClinic(selectedClinic.id, name, photo);
        toast.success("Clinic updated successfully");
      }
      fetchClinicsData();
      closeModal();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || `Failed to ${modalType} clinic`;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (clinicId) => {
    try {
      await deleteClinic(clinicId);
      toast.success("Clinic deleted successfully");
      fetchClinicsData();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete clinic";
      toast.error(errorMessage);
    }
  };

  // Enhanced file validation
  const beforeUpload = (file) => {
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];
    const isValidType = validImageTypes.includes(file.type);

    if (!isValidType) {
      toast.error("Only image files (JPG, PNG, WEBP) are allowed!");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      toast.error("Image must be smaller than 5MB!");
      return false;
    }

    return false; // Prevent automatic upload
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    // Filter out invalid files
    const validFiles = newFileList.filter((file) => {
      if (file.status === "error") return false;

      // Check file type if it's a new upload
      if (file.originFileObj) {
        const validImageTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
        ];
        return validImageTypes.includes(file.originFileObj.type);
      }

      return true;
    });

    setFileList(validFiles);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span style={{ fontWeight: 500, color: "#1890ff" }}>{text}</span>
      ),
    },
    {
      title: "Doctors",
      dataIndex: "numOfDoctors",
      key: "numOfDoctors",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Money",
      dataIndex: "money",
      key: "money",
      render: (text) => (
        <span className="flex items-center gap-2">
          <DollarSign size={16} color="#22c55e" style={{ marginRight: 4 }} />
          {text ? `$${text}` : "$0.00"}
        </span>
      ),
    },
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (photo) =>
        photo ? (
          <Image
            onMouseEnter={(e) => {
              Object.assign(e.target.style, imageHoverStyle);
            }}
            src={`http://127.0.0.1:8000${photo}`}
            alt="clinic"
            style={imageStyle}
            preview={{
              mask: (
                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.5)",
                    // backdropFilter: "blur(2px)",
                    borderRadius: "50%",
                    color: "white",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <EyeIcon width={16} height={16} />
                </div>
              ),
              maskClassName: "custom-image-mask",
            }}
            onMouseLeave={(e) => {
              Object.assign(e.target.style, imageStyle);
            }}
          />
        ) : (
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              color: "#999",
            }}
          >
            No Photo
          </div>
        ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => openModal("edit", record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this clinic?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card style={{ marginBottom: "24px" }}>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              Clinics Management
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
                Create New Clinic
              </Button>
            </Space>
          </Col>
        </Row>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={clinics}
            rowKey="id"
            pagination={false}
            size="middle"
          />
        </Spin>
      </Card>
      <Modal
        title={
          modalType === "view"
            ? "Clinic Details"
            : modalType === "create"
            ? "Create New Clinic"
            : "Edit Clinic"
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
        width={600}
        destroyOnClose={true}
      >
        {modalType === "view" && selectedClinic && (
          <Card
            bordered={false}
            style={{
              boxShadow: "0 2px 16px #e6eaf1",
              borderRadius: 18,
              background: "linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)",
              padding: 0,
            }}
            bodyStyle={{ padding: 0 }}
          >
            <Row gutter={[32, 0]} align="middle">
              <Col xs={24} sm={8} style={{ textAlign: "center", padding: 32 }}>
                {selectedClinic.photo ? (
                  <Image
                    src={selectedClinic.photo}
                    width={100}
                    height={100}
                    style={{
                      borderRadius: 16,
                      objectFit: "cover",
                      marginBottom: 18,
                    }}
                    alt={selectedClinic.name}
                    preview={false}
                  />
                ) : (
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 16,
                      background: "#e0e7ef",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 18px auto",
                    }}
                  >
                    <LucideImage size={48} color="#64748b" />
                  </div>
                )}
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 22,
                    marginBottom: 6,
                    color: "#222",
                  }}
                >
                  {selectedClinic.name}
                </div>
                <Tag
                  color="blue"
                  style={{ fontSize: 15, padding: "3px 16px", borderRadius: 8 }}
                >
                  <Building2
                    size={16}
                    color="#2563eb"
                    style={{ marginRight: 6 }}
                  />
                  Clinic
                </Tag>
              </Col>
              <Col
                xs={24}
                sm={16}
                style={{
                  background: "#fff",
                  borderTopRightRadius: 18,
                  borderBottomRightRadius: 18,
                  padding: 32,
                }}
              >
                <div
                  style={{
                    marginBottom: 18,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Users size={20} color="#6366f1" />
                  <span style={{ fontWeight: 600, color: "#444" }}>
                    Doctors:
                  </span>
                  <span style={{ color: "#222", fontSize: 15 }}>
                    {selectedClinic.numOfDoctors}
                  </span>
                </div>
                <div
                  style={{
                    marginBottom: 18,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <DollarSign size={20} color="#22c55e" />
                  <span style={{ fontWeight: 600, color: "#444" }}>Money:</span>
                  <span style={{ color: "#222", fontSize: 15 }}>
                    {selectedClinic.money}
                  </span>
                </div>
                <div
                  style={{
                    marginBottom: 18,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <CalendarDays size={20} color="#f59e42" />
                  <span style={{ fontWeight: 600, color: "#444" }}>
                    Created:
                  </span>
                  <span style={{ color: "#222", fontSize: 15 }}>
                    {selectedClinic.created_at?.split("T")[0]}
                  </span>
                </div>
                <div
                  style={{
                    marginBottom: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <CalendarDays size={20} color="#0ea5e9" />
                  <span style={{ fontWeight: 600, color: "#444" }}>
                    Updated:
                  </span>
                  <span style={{ color: "#222", fontSize: 15 }}>
                    {selectedClinic.updated_at?.split("T")[0]}
                  </span>
                </div>
              </Col>
            </Row>
          </Card>
        )}
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="Clinic Name"
            rules={[
              { required: true, message: "Please input the clinic name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="photo" label="Clinic Photo">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Clinics;
