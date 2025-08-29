import React, { useState, useEffect } from "react";
import {
  Table,
  Avatar,
  Tag,
  Button,
  Space,
  Typography,
  Pagination,
  Spin,
  Empty,
} from "antd";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaUser,
  FaCalendarAlt,
  FaBaby,
  FaTint,
} from "react-icons/fa";
import useChildStore from "../../../store/doctor/childStore";

const { Text, Title } = Typography;

const ChildrenManagement = ({
  onChildSelect,
  onEditChild,
  onDeleteChild,
  showActions = true,
}) => {
  const {
    children,
    childrenMeta,
    childrenLoading,
    childrenError,
    fetchChildren,
  } = useChildStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchChildren(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "Unknown";

    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    if (age < 1) {
      const months = Math.floor(
        (today - birth) / (1000 * 60 * 60 * 24 * 30.44)
      );
      return `${months} months`;
    }

    return `${age} years`;
  };

  const getGenderColor = (gender) => {
    return gender === "male" ? "blue" : "pink";
  };

  const getBloodTypeColor = (bloodType) => {
    const colorMap = {
      "A+": "red",
      "A-": "red",
      "B+": "green",
      "B-": "green",
      "AB+": "purple",
      "AB-": "purple",
      "O+": "orange",
      "O-": "orange",
    };
    return colorMap[bloodType] || "default";
  };

  const columns = [
    {
      title: "Photo",
      key: "photo",
      width: 80,
      render: (_, record) => (
        <Avatar
          size={50}
          src={record.photo}
          icon={<FaUser className="text-lg" />}
          className="bg-blue-100 text-blue-600"
        />
      ),
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <div>
          <Text strong className="text-base">
            {record.first_name} {record.last_name}
          </Text>
        </div>
      ),
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: "Age",
      key: "age",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <FaBaby className="text-blue-500" />
          <Text>{calculateAge(record.birth_date)}</Text>
        </div>
      ),
      sorter: (a, b) => new Date(a.birth_date) - new Date(b.birth_date),
    },
    {
      title: "Gender",
      key: "gender",
      render: (_, record) => (
        <Tag color={getGenderColor(record.gender)} className="font-medium">
          {record.gender?.charAt(0)?.toUpperCase() + record.gender?.slice(1)}
        </Tag>
      ),
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: "Blood Type",
      key: "blood_type",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <FaTint className="text-red-500" />
          <Tag
            color={getBloodTypeColor(record.blood_type)}
            className="font-medium"
          >
            {record.blood_type}
          </Tag>
        </div>
      ),
      filters: [
        { text: "A+", value: "A+" },
        { text: "A-", value: "A-" },
        { text: "B+", value: "B+" },
        { text: "B-", value: "B-" },
        { text: "AB+", value: "AB+" },
        { text: "AB-", value: "AB-" },
        { text: "O+", value: "O+" },
        { text: "O-", value: "O-" },
      ],
      onFilter: (value, record) => record.blood_type === value,
    },
    {
      title: "Birth Date",
      key: "birth_date",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-green-500" />
          <Text>{record.birth_date}</Text>
        </div>
      ),
      sorter: (a, b) => new Date(a.birth_date) - new Date(b.birth_date),
    },
  ];

  // Add actions column if showActions is true
  if (showActions) {
    columns.push({
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          {onChildSelect && (
            <Button
              type="primary"
              size="small"
              icon={<FaEye />}
              onClick={() => onChildSelect(record)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              View
            </Button>
          )}
          {onEditChild && (
            <Button
              type="default"
              size="small"
              icon={<FaEdit />}
              onClick={() => onEditChild(record)}
              className="border-orange-500 text-orange-500 hover:border-orange-600 hover:text-orange-600"
            >
              Edit
            </Button>
          )}
          {onDeleteChild && (
            <Button
              type="default"
              size="small"
              icon={<FaTrash />}
              onClick={() => onDeleteChild(record)}
              danger
              className="border-red-500 text-red-500 hover:border-red-600 hover:text-red-600"
            >
              Delete
            </Button>
          )}
        </Space>
      ),
    });
  }

  if (childrenError) {
    return (
      <div className="text-center py-8">
        <Text type="danger">Error: {childrenError}</Text>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <Title level={4} className="mb-0 flex items-center gap-2">
          <FaBaby className="text-blue-500" />
          Children List
        </Title>
        <Text type="secondary">Total: {childrenMeta.total} children</Text>
      </div>

      <div className="p-4">
        {childrenLoading ? (
          <div className="text-center py-8">
            <Spin size="large" />
            <div className="mt-2">
              <Text type="secondary">Loading children...</Text>
            </div>
          </div>
        ) : children && children.length > 0 ? (
          <>
            <Table
              columns={columns}
              dataSource={children}
              rowKey="id"
              pagination={false}
              scroll={{ x: 1000 }}
              className="mb-4"
              rowClassName="hover:bg-gray-50"
            />

            <div className="flex justify-center">
              <Pagination
                current={childrenMeta.current_page}
                total={childrenMeta.total}
                pageSize={childrenMeta.per_page}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} children`
                }
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
                pageSizeOptions={["10", "20", "50"]}
                className="mt-4"
              />
            </div>
          </>
        ) : (
          <Empty
            description="No children found"
            className="py-8"
            image={<FaBaby className="text-6xl text-gray-300" />}
          />
        )}
      </div>
    </div>
  );
};

export default ChildrenManagement;
