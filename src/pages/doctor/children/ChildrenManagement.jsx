import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Pagination,
  Spin,
  Empty,
  message,
} from "antd";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaBaby,
  FaTint,
  FaFileAlt,
  FaSyringe,
} from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

import useChildStore from "../../../store/doctor/childStore";
import ChildRecord from "./ChildRecord";
import AddChildRecord from "./AddChildRecord";
import Vaccines from "./Vaccines";

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
    getChildRecord,
    addChildRecords,
    editChildRecords,
    childRecord,
    childRecordLoading,
    childRecordError,
  } = useChildStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [selectedChildForRecord, setSelectedChildForRecord] = useState(null);
  const [addRecordModalVisible, setAddRecordModalVisible] = useState(false);
  const [editRecordModalVisible, setEditRecordModalVisible] = useState(false);
  const [editButtonLoading, setEditButtonLoading] = useState({});
  const [vaccinesVisible, setVaccinesVisible] = useState(false);
  const [selectedForVaccines, setSelectedForVaccines] = useState(null);

  useEffect(() => {
    fetchChildren(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Debug effect to monitor childRecord changes
  useEffect(() => {
    console.log("childRecord changed:", childRecord);
  }, [childRecord]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleViewRecord = async (child) => {
    setSelectedChildForRecord(child);
    setRecordModalVisible(true);
    try {
      await getChildRecord(child.id);
    } catch (error) {
      console.error("Failed to fetch child record:", error);
    }
  };

  const handleCloseRecordModal = () => {
    setRecordModalVisible(false);
    setSelectedChildForRecord(null);
  };

  const handleOpenAddRecordModal = (childId = null) => {
    setAddRecordModalVisible(true);
    if (childId) {
      setSelectedChildForRecord({ id: childId });
    }
  };

  const handleCloseAddRecordModal = () => {
    setAddRecordModalVisible(false);
  };

  const handleOpenVaccines = (child) => {
    setSelectedForVaccines({
      id: child.id,
      name: `${child.first_name || ""} ${child.last_name || ""}`.trim(),
    });
    setVaccinesVisible(true);
  };

  const handleOpenEditRecordModal = async (childId = null) => {
    if (childId) {
      try {
        // Set loading state for this specific button
        setEditButtonLoading((prev) => ({ ...prev, [childId]: true }));

        // First fetch the child record to get default values
        const recordData = await getChildRecord(childId);
        console.log("Fetched record data for editing:", recordData);
        console.log("Current childRecord state:", childRecord);
        setSelectedChildForRecord({ id: childId });
        // Wait a bit to ensure the state is updated before opening modal
        setTimeout(() => {
          console.log("Opening edit modal with childRecord:", childRecord);
          setEditRecordModalVisible(true);
        }, 100);
      } catch (error) {
        console.error("Failed to fetch child record for editing:", error);
        // Show error message to user
        message.error("Failed to load record data for editing");
      } finally {
        // Clear loading state regardless of success/failure
        setEditButtonLoading((prev) => ({ ...prev, [childId]: false }));
      }
    } else {
      setEditRecordModalVisible(true);
    }
  };

  const handleCloseEditRecordModal = () => {
    setEditRecordModalVisible(false);
  };

  const handleAddChildRecord = async (formData) => {
    try {
      await addChildRecords(formData);
      // Refresh the children list to show any updates
      await fetchChildren(currentPage, pageSize);
    } catch (error) {
      throw error.response.data; // Re-throw to let the AddChildRecord component handle the error
    }
  };

  const handleEditChildRecord = async (formData) => {
    try {
      await editChildRecords(formData);
      // Refresh the children list to show any updates
      await fetchChildren(currentPage, pageSize);
    } catch (error) {
      throw error.response.data; // Re-throw to let the AddChildRecord component handle the error
    }
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
      title: "#",
      key: "index",
      width: 60,
      render: (_, record, index) => (
        <div className="text-center">
          <Text strong className="text-gray-600">
            {(currentPage - 1) * pageSize + index + 1}
          </Text>
        </div>
      ),
    },
    {
      title: "Name",
      key: "name",
      width: 150,
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
      width: 150,
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
      width: 100,
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
      width: 120,
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
      width: 150,
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
      width: 380,
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            size="small"
            icon={<FaFileAlt />}
            onClick={() => handleViewRecord(record)}
            className="border-green-500 text-green-500 hover:border-green-600 hover:text-green-600"
          >
            View Record
          </Button>
          <Button
            type="default"
            size="small"
            icon={<FaPlus />}
            onClick={() => handleOpenAddRecordModal(record.id)}
            disabled={record.child_record !== null}
            className={`${
              record.child_record === null
                ? "border-blue-500 text-blue-500 hover:border-blue-600 hover:text-blue-600"
                : "border-gray-300 text-gray-400 cursor-not-allowed"
            }`}
          >
            {record.child_record === null ? "Add Record" : "Record Exists"}
          </Button>
          <Button
            type="default"
            size="small"
            icon={<FaEdit />}
            onClick={() => handleOpenEditRecordModal(record.id)}
            disabled={record.child_record === null}
            loading={editButtonLoading[record.id] || false}
            className={`${
              record.child_record !== null
                ? "border-purple-500 text-purple-500 hover:border-purple-600 hover:text-purple-600"
                : "border-gray-300 text-gray-400 cursor-not-allowed"
            }`}
          >
            {record.child_record !== null ? "Edit Record" : "No Record"}
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<FaSyringe />}
            onClick={() => handleOpenVaccines(record)}
            className="bg-green-500 hover:bg-green-600 border-green-500"
          >
            View Vaccines
          </Button>
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
        <div>
          <Title level={4} className="mb-0 flex items-center gap-2">
            <FaBaby className="text-blue-500" />
            Children List
          </Title>
          <Text type="secondary">Total: {childrenMeta.total} children</Text>
        </div>
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
              scroll={{ x: 1300 }}
              className="mb-4"
              tableLayout="auto"
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

      {/* Child Record Modal */}
      <ChildRecord
        visible={recordModalVisible}
        onCancel={handleCloseRecordModal}
        childRecord={childRecord}
        loading={childRecordLoading}
        error={childRecordError}
      />

      {/* Add Child Record Modal */}
      <AddChildRecord
        visible={addRecordModalVisible}
        onCancel={handleCloseAddRecordModal}
        onSubmit={handleAddChildRecord}
        loading={childrenLoading}
        children={children}
        selectedChildId={selectedChildForRecord?.id}
      />

      {/* Edit Child Record Modal */}
      <AddChildRecord
        visible={editRecordModalVisible}
        onCancel={handleCloseEditRecordModal}
        onSubmit={handleEditChildRecord}
        loading={childrenLoading}
        children={children}
        selectedChildId={selectedChildForRecord?.id}
        isEdit={true}
        existingRecord={childRecord}
        key={`edit-${childRecord?.id || "new"}`}
      />

      {/* Vaccines Modal */}
      <Vaccines
        visible={vaccinesVisible}
        onCancel={() => setVaccinesVisible(false)}
        childId={selectedForVaccines?.id}
        childName={selectedForVaccines?.name}
      />
    </div>
  );
};

export default ChildrenManagement;
