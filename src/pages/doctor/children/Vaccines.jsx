import React, { useState, useEffect } from "react";
import { Modal, Table, Tag, Typography, Pagination, Spin, Empty } from "antd";
import {
  FaSyringe,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import useChildStore from "../../../store/doctor/childStore";

const { Title, Text } = Typography;

const Vaccines = ({ visible, onCancel, childId, childName }) => {
  const {
    childVaccineRecords,
    vaccineRecordsMeta,
    vaccineRecordsLoading,
    vaccineRecordsError,
    getChildVaccineRecords,
  } = useChildStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (visible && childId) {
      getChildVaccineRecords(childId, currentPage, pageSize);
    }
  }, [visible, childId, currentPage, pageSize, getChildVaccineRecords]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const getStatusColor = (isTaken) => {
    return isTaken ? "success" : "warning";
  };

  const getStatusText = (isTaken) => {
    return isTaken ? "Taken" : "Pending";
  };

  const getRecommendedColor = (recommended) => {
    const colorMap = {
      upcoming: "blue",
      overdue: "red",
      completed: "green",
      current: "orange",
    };
    return colorMap[recommended] || "default";
  };

  const getRecommendedText = (recommended) => {
    const textMap = {
      upcoming: "Upcoming",
      overdue: "Overdue",
      completed: "Completed",
      current: "Current",
    };
    return textMap[recommended] || recommended;
  };

  const columns = [
    {
      title: "Vaccine Name",
      key: "vaccine_name",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <FaSyringe className="text-blue-500" />
          <Text strong>{record.vaccine_name}</Text>
        </div>
      ),
      sorter: (a, b) => a.vaccine_name.localeCompare(b.vaccine_name),
    },
    {
      title: "Dose Number",
      key: "dose_number",
      render: (_, record) => (
        <Tag color="blue" className="font-medium">
          Dose {record.dose_number}
        </Tag>
      ),
      sorter: (a, b) => a.dose_number - b.dose_number,
    },
    {
      title: "Status",
      key: "isTaken",
      render: (_, record) => (
        <Tag color={getStatusColor(record.isTaken)} className="font-medium">
          {getStatusText(record.isTaken)}
        </Tag>
      ),
      filters: [
        { text: "Taken", value: 1 },
        { text: "Pending", value: 0 },
      ],
      onFilter: (value, record) => record.isTaken === value,
    },
    {
      title: "When to Take",
      key: "when_to_take",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-green-500" />
          <Text>{record.when_to_take}</Text>
        </div>
      ),
    },
    {
      title: "Recommended",
      key: "recommended",
      render: (_, record) => (
        <Tag
          color={getRecommendedColor(record.recommended)}
          className="font-medium"
        >
          {getRecommendedText(record.recommended)}
        </Tag>
      ),
      filters: [
        { text: "Upcoming", value: "upcoming" },
        { text: "Overdue", value: "overdue" },
        { text: "Completed", value: "completed" },
        { text: "Current", value: "current" },
      ],
      onFilter: (value, record) => record.recommended === value,
    },
    {
      title: "Next Vaccine Date",
      key: "next_vaccine_date",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <FaClock className="text-purple-500" />
          <Text>{record.next_vaccine_date || "Not scheduled"}</Text>
        </div>
      ),
    },
    {
      title: "Notes",
      key: "notes",
      render: (_, record) => <Text>{record.notes || "No notes"}</Text>,
    },
  ];

  if (vaccineRecordsError) {
    return (
      <Modal
        title="Vaccination Records"
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={1200}
        destroyOnClose
      >
        <div className="text-center py-8">
          <Text type="danger">Error: {vaccineRecordsError}</Text>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FaSyringe className="text-blue-500" />
          <span>Vaccination Records - {childName}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1200}
      destroyOnClose
    >
      <div className="mb-4">
        <Text type="secondary">
          Child ID: {childId} | Total Records: {vaccineRecordsMeta.total || 0}
        </Text>
      </div>

      {vaccineRecordsLoading ? (
        <div className="text-center py-8">
          <Spin size="large" />
          <div className="mt-2">
            <Text type="secondary">Loading vaccination records...</Text>
          </div>
        </div>
      ) : childVaccineRecords && childVaccineRecords.length > 0 ? (
        <>
          <Table
            columns={columns}
            dataSource={childVaccineRecords}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1000 }}
            className="mb-4"
            rowClassName="hover:bg-gray-50"
          />

          <div className="flex justify-center">
            <Pagination
              current={vaccineRecordsMeta.current_page}
              total={vaccineRecordsMeta.total}
              pageSize={vaccineRecordsMeta.per_page}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} vaccination records`
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
          description="No vaccination records found for this child"
          className="py-8"
          image={<FaSyringe className="text-6xl text-gray-300" />}
        />
      )}
    </Modal>
  );
};

export default Vaccines;
