// src/components/PatientsTable.jsx
import React, { useState } from "react";
import { Table, Typography, Tag, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

const initialData = [
  {
    id: 1,
    first_name: "Naya",
    last_name: "Salha",
    user_id: 4,
    gender: "female",
    age: 21,
    address: "Mazzeh",
  },
];

const PatientsTable = () => {
  const [data, setData] = useState(initialData);

  const handleDelete = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    message.success("Patient deleted");
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
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer" }}
            title="Delete"
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
      dataSource={data}
      columns={columns}
      rowKey="id"
      pagination={{
        pageSize: 5,
        total: data.length,
        current: 1,
      }}
      bordered
      size="middle"
    />
  );
};

export default PatientsTable;
