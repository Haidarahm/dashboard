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
  Space,
  Popconfirm,
  Row,
  Col,
  Switch,
  Tag,
  Radio,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  fetchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../../api/admin/employees";

const { Title } = Typography;

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'create', 'edit'
  const [form] = Form.useForm();
  const [filter, setFilter] = useState(null); // null for all, 1 for secretaries, 0 for employees

  const fetchEmployeesData = async () => {
    setLoading(true);
    const params = {};

    params.is_secretary = filter;

    try {
      const response = await fetchEmployees(params.is_secretary);
      let employeesData = [];
      let totalCount = 0;

      if (Array.isArray(response)) {
        employeesData = response;
        totalCount = response.length;
      } else if (response.data && Array.isArray(response.data)) {
        employeesData = response.data;
        totalCount = response.total || response.count || response.data.length;
      } else if (response.employees && Array.isArray(response.employees)) {
        employeesData = response.employees;
        totalCount =
          response.total || response.count || response.employees.length;
      } else {
        console.warn("Unexpected response structure:", response);
        employeesData = [];
        totalCount = 0;
      }

      setEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesData();
  }, [filter]);

  const openModal = (type, employee = null) => {
    setModalType(type);
    setSelectedEmployee(employee);

    if (type === "create") {
      form.resetFields();
      form.setFieldsValue({ is_secretary: false });
    } else if (type === "edit" && employee) {
      form.setFieldsValue({
        ...employee,
        is_secretary: !!employee.is_secretary,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setModalType("");
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    const employeeData = {
      ...values,
      is_secretary: values.is_secretary ? 1 : 0,
    };

    try {
      if (modalType === "create") {
        await addEmployee(employeeData);
        toast.success("Employee created successfully");
      } else if (modalType === "edit" && selectedEmployee) {
        await updateEmployee({ ...employeeData, user_id: selectedEmployee.id });
        toast.success("Employee updated successfully");
      }
      fetchEmployeesData();
      closeModal();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message[0] || `Failed to ${modalType} employee`;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteEmployee(userId);
      toast.success("Employee deleted successfully");
      fetchEmployeesData();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete employee";
      toast.error(errorMessage);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "first_name",
      key: "name",
      render: (text, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Role",
      dataIndex: "is_secretary",
      key: "role",
      render: (_, data) => (
        <Tag color={data.role === "secretary" ? "blue" : "green"}>
          {data.role === "secretary" ? "Secretary" : "Labtech"}
        </Tag>
      ),
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
            title="Are you sure to delete this employee?"
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
          <Title level={4}>Employees Management</Title>
        </Col>
        <Col>
          <Radio.Group
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ marginRight: 16 }}
          >
            <Radio.Button value={null}>All</Radio.Button>
            <Radio.Button value={0}>Labtechs</Radio.Button>
            <Radio.Button value={1}>Secretaries</Radio.Button>
          </Radio.Group>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal("create")}
          >
            Add Employee
          </Button>
        </Col>
      </Row>
      <Spin spinning={loading}>
        <Table dataSource={employees} columns={columns} rowKey="id" />
      </Spin>
      <Modal
        title={modalType === "create" ? "Create New Employee" : "Edit Employee"}
        visible={showModal}
        onCancel={closeModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[
              { required: true, message: "Please input the first name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[{ required: true, message: "Please input the last name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input a valid email!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: modalType === "create",
                message: "Password is required",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          {
            modalType === "create" && (
              <Form.Item
              name="is_secretary"
              label="Is Secretary?"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>    
            )
          }
          
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

export default Employees;
