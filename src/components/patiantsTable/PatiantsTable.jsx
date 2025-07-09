// src/components/PatientsTable.jsx
import React, { useEffect, useState } from "react";
import { Table, Typography, Tag, Spin, Empty } from "antd";
import usePatientsStore from "../../store/patientsStore";

const { Text } = Typography;

const PatientsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const { patients, total, loading, error, fetchPatients } = usePatientsStore();

  useEffect(() => {
    fetchPatients(pageSize, currentPage);
  }, [fetchPatients, pageSize, currentPage]);

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
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (
        <Tag color={gender === "female" ? "magenta" : "blue"}>
          {gender.charAt(0).toUpperCase() + gender.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 80,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    // Actions column can be re-enabled if a real delete API is available
  ];

  return (
    <Table
      title={() => (
        <Text
          strong
          style={{
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Patients
        </Text>
      )}
      dataSource={patients}
      columns={columns}
      rowKey="id"
      loading={loading}
     
      pagination={{
        pageSize,
        total,
        current: currentPage,
        onChange: setCurrentPage,
        showSizeChanger: false,
        showQuickJumper: false,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} patients`,
      }}
      bordered
      size="middle"
    />
  );
};

export default PatientsTable;
