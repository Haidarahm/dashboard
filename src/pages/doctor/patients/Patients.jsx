import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Spin,
  Typography,
  Tag,
  Input,
  Space,
  Button,
  Tooltip,
} from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import usePatientsStore from "../../../store/doctor/patientsStore";
import PatientDetails from "./PatientDetails";

const { Title, Text } = Typography;

function Patients() {
  const {
    patients,
    loading,
    error,
    fetchPatients,
    searchForPatient,
    total,
    currentPage,
    perPage,
    searchQuery,
    fetchPatientProfile,
    patientProfile,
  } = usePatientsStore();

  const [searchValue, setSearchValue] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    if (!searchQuery) {
      fetchPatients(1, perPage);
    }
    // eslint-disable-next-line
  }, [perPage]);

  const handleTableChange = (pagination) => {
    if (searchQuery) {
      searchForPatient(searchQuery, pagination.current, pagination.pageSize);
    } else {
      fetchPatients(pagination.current, pagination.pageSize);
    }
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      searchForPatient(searchValue.trim(), 1, perPage);
    } else {
      fetchPatients(1, perPage);
    }
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    if (!e.target.value) {
      fetchPatients(1, perPage);
    }
  };

  const handleInputPressEnter = (e) => {
    handleSearch();
  };

  const handleShowDetails = (patientId) => {
    setSelectedPatientId(patientId);
    fetchPatientProfile(patientId);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <Text>
          {record.first_name} {record.last_name}
        </Text>
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 80,
      render: (_, record) => {
        // Calculate age from birth_date if available
        if (record.birth_date) {
          const birth = new Date(record.birth_date);
          const ageDifMs = Date.now() - birth.getTime();
          const ageDate = new Date(ageDifMs);
          return Math.abs(ageDate.getUTCFullYear() - 1970);
        }
        return "-";
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Tooltip title="Show patient details">
          <Button
            icon={<UserOutlined />}
            onClick={() => handleShowDetails(record.id)}
            type={selectedPatientId === record.id ? "primary" : "default"}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <Card style={{ marginBottom: "24px" }}>
            <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              Patients
            </Title>
            <Space style={{ marginBottom: 16, marginTop: 16 }}>
              <Input
                placeholder="Search by name"
                value={searchValue}
                onChange={handleInputChange}
                onPressEnter={handleInputPressEnter}
                style={{ width: 240 }}
                allowClear
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                loading={loading}
              >
                Search
              </Button>
            </Space>
            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={patients}
                rowKey="id"
                pagination={{
                  current: currentPage,
                  pageSize: perPage,
                  total: total,
                  showSizeChanger: true,
                  pageSizeOptions: ["5", "10", "20", "50"],
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} patients`,
                }}
                size="middle"
                style={{ marginTop: 24 }}
                onChange={handleTableChange}
              />
            </Spin>
            {error && (
              <div style={{ color: "red", marginTop: 16 }}>{error}</div>
            )}
          </Card>
        </div>
        <div style={{ flex: 1, minWidth: 350 }}>
          <PatientDetails profile={patientProfile} />
        </div>
      </div>
    </div>
  );
}

export default Patients;
