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
} from "../../api/clinics";
import { EyeIcon } from "lucide-react";

const { Title } = Typography;

function Clinics() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'create', 'edit'
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

  const fetchClinicsData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await getAllClinics();
      let clinicsData = [];
      let totalCount = 0;

      if (Array.isArray(response)) {
        clinicsData = response;
        totalCount = response.length;
      } else if (response.data && Array.isArray(response.data)) {
        clinicsData = response.data;
        totalCount = response.total || response.count || response.data.length;
      } else if (response.clinics && Array.isArray(response.clinics)) {
        clinicsData = response.clinics;
        totalCount =
          response.total || response.count || response.clinics.length;
      } else {
        console.warn("Unexpected response structure:", response);
        clinicsData = [];
        totalCount = 0;
      }

      setClinics(clinicsData);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize,
        total: totalCount,
      }));
    } catch (error) {
      console.error("Error fetching clinics:", error);
      toast.error("Failed to fetch clinics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinicsData();
  }, []);

  const handleTableChange = (paginationInfo) => {
    fetchClinicsData(paginationInfo.current, paginationInfo.pageSize);
  };

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
    const photo = fileList.length > 0 ? fileList[0].originFileObj || fileList[0] : null;
  
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
      fetchClinicsData(pagination.current, pagination.pageSize);
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
      fetchClinicsData(pagination.current, pagination.pageSize);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete clinic";
      toast.error(errorMessage);
    }
  };

  // Enhanced file validation
  const beforeUpload = (file) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
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
    const validFiles = newFileList.filter(file => {
      if (file.status === 'error') return false;
      
      // Check file type if it's a new upload
      if (file.originFileObj) {
        const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
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
    },
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (photo) =>
        photo ? (
          <Image
            src={`http://127.0.0.1:8000${photo}`}
            alt="clinic"
            style={imageStyle}
            preview={{
              mask: (
                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(2px)",
                    borderRadius: "50%",
                    color: "white",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                   <EyeIcon width={16} />
                 </div>
              ),
              maskClassName: "custom-image-mask"
            }}
            onMouseEnter={(e) => {
              Object.assign(e.target.style, imageHoverStyle);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.target.style, imageStyle);
            }}
          />
        ) : (
          <div style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            color: "#999"
          }}>
            No Photo
          </div>
        ),
    },
    {
      title: "Number of Doctors",
      dataIndex: "numOfDoctors",
      key: "numOfDoctors",
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
          <Button icon={<EditOutlined />} onClick={() => openModal("edit", record)}>
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
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>Clinics Management</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal("create")}
          >
            Add Clinic
          </Button>
        </Col>
      </Row>
      <Spin spinning={loading}>
        <Table
          dataSource={clinics}
          columns={columns}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Spin>
      <Modal
        title={modalType === "create" ? "Create New Clinic" : "Edit Clinic"}
        visible={showModal}
        onCancel={closeModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="Clinic Name"
            rules={[{ required: true, message: "Please input the clinic name!" }]}
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
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {modalType === "create" ? "Create" : "Save Changes"}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={closeModal}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

export default Clinics;