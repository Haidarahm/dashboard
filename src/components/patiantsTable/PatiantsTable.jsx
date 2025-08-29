// src/components/PatientsTable.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Tag,
  Spin,
  Empty,
  Popconfirm,
  Button,
  message,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import usePatientsStore from "../../store/admin/patientsStore";

const { Text } = Typography;

const PatientsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const { patients, total, loading, error, fetchPatients, removePatient } =
    usePatientsStore();

  useEffect(() => {
    fetchPatients(pageSize, currentPage);
  }, [fetchPatients, pageSize, currentPage]);

  const handleDelete = async (id) => {
    try {
      await removePatient(id);
      message.success("Patient deleted successfully");
      // Optionally, refetch if pagination/total is affected
      fetchPatients(pageSize, currentPage);
    } catch (err) {
      message.error(err?.toString() || "Failed to delete patient");
    }
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
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (
        <Tag color={gender === "female" ? "magenta" : "blue"}>
          {gender?.charAt(0).toUpperCase() + gender?.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Age",
      key: "age",
      width: 80,
      render: (_, record) => {
        if (record.birth_date) {
          const birthDate = new Date(record.birth_date);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          // If age is less than 1 year, calculate months
          if (age < 1) {
            const months = Math.floor(
              (today - birthDate) / (1000 * 60 * 60 * 24 * 30.44)
            );
            return <Text>{months} months</Text>;
          }

          return <Text>{age} years</Text>;
        }
        return <Text>Unknown</Text>;
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
        <Popconfirm
          title="Are you sure to delete this patient?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            icon={<DeleteOutlined style={{ color: "red" }} />}
            type="text"
            loading={loading}
            disabled={loading}
          />
        </Popconfirm>
      ),
    },
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
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} patients`,
      }}
      bordered
      size="middle"
    />
  );
};

export default PatientsTable;
