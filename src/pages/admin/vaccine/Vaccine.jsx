import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Card,
  Modal,
  Popconfirm,
  Form,
  Input,
  InputNumber,
  Spin,
  Tag,
  Tooltip,
  Row,
  Col,
} from "antd";
import { toast } from "react-toastify";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useVaccineStore } from "../../../store/admin/vaccineStore";

const { Title } = Typography;

const initialVaccineState = {
  name: "",
  description: "",
  age_group: "",
  recommended_doses: 1,
  price: 0,
};

function Vaccine() {
  const vaccineStore = useVaccineStore();
  const {
    vaccines,
    loading,
    error,
    fetchVaccines,
    addVaccine,
    updateVaccine,
    deleteVaccine,
    totalVaccins,
  } = vaccineStore;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: totalVaccins,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchVaccines(pagination.current, pagination.pageSize);
  }, [fetchVaccines, pagination.current, pagination.pageSize]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, total: totalVaccins }));
  }, [vaccines]);

  const openModal = (type, vaccine = null) => {
    setModalType(type);
    setSelectedVaccine(vaccine);
    setShowModal(true);
    if (type === "edit" && vaccine) {
      form.setFieldsValue(vaccine);
    } else {
      form.setFieldsValue(initialVaccineState);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVaccine(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    try {
      if (modalType === "create") {
        await addVaccine(values);
        toast.success("Vaccine added successfully");
      } else if (modalType === "edit" && selectedVaccine) {
        await updateVaccine({ ...selectedVaccine, ...values });
        toast.success("Vaccine updated successfully");
      }
      fetchVaccines(pagination.current, pagination.pageSize);
      closeModal();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (vaccine) => {
    try {
      await deleteVaccine(vaccine.id || vaccine.vaccine_id);
      toast.success("Vaccine deleted successfully");
      fetchVaccines(pagination.current, pagination.pageSize);
    } catch (err) {
      toast.error("Failed to delete vaccine");
    }
  };

  const handleTableChange = (paginationInfo) => {
    setPagination({
      ...pagination,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Age Group",
      dataIndex: "age_group",
      key: "age_group",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Recommended Doses",
      dataIndex: "recommended_doses",
      key: "recommended_doses",
      render: (num) => <span>{num}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span>${price}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openModal("edit", record)}
              style={{ color: "#1890ff" }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this vaccine?"
              onConfirm={() => handleDelete(record)}
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
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              Vaccines Management
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal("create")}
              size="large"
            >
              Add Vaccine
            </Button>
          </Col>
        </Row>
      </Card>
      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={vaccines}
            rowKey={(record) => record.id || record.vaccine_id}
            pagination={{
              ...pagination,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} vaccines`,
            }}
            onChange={handleTableChange}
            size="middle"
          />
        </Spin>
      </Card>
      <Modal
        title={modalType === "create" ? "Add Vaccine" : "Edit Vaccine"}
        open={showModal}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={initialVaccineState}
        >
          <Form.Item
            name="name"
            label="Vaccine Name"
            rules={[{ required: true, message: "Please enter vaccine name" }]}
          >
            <Input placeholder="Enter vaccine name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            name="age_group"
            label="Age Group"
            rules={[{ required: true, message: "Please enter age group" }]}
          >
            <Input placeholder="e.g. Children, Adults, Seniors" />
          </Form.Item>
          <Form.Item
            name="recommended_doses"
            label="Recommended Doses"
            rules={[
              { required: true, message: "Please enter recommended doses" },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} prefix="$" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={closeModal}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {modalType === "create" ? "Add" : "Save Changes"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Vaccine;
