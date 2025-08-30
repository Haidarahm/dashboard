import React, { useState, useEffect } from "react";
import {
  Modal,
  Table,
  Tag,
  Typography,
  Pagination,
  Spin,
  Empty,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
} from "antd";
import {
  FaSyringe,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaEdit,
} from "react-icons/fa";
import useChildStore from "../../../store/doctor/childStore";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Vaccines = ({ visible, onCancel, childId, childName }) => {
  const {
    childVaccineRecords,
    vaccineRecordsMeta,
    vaccineRecordsLoading,
    vaccineRecordsError,
    getChildVaccineRecords,
    editVaccineRecordInfo,
    editVaccineLoading,
  } = useChildStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedVaccineRecord, setSelectedVaccineRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && childId) {
      getChildVaccineRecords(childId, currentPage, pageSize);
    }
  }, [visible, childId, currentPage, pageSize, getChildVaccineRecords]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleEdit = (record) => {
    setSelectedVaccineRecord(record);
    form.setFieldsValue({
      dose_number: record.dose_number,
      notes: record.notes || "",
      isTaken: record.isTaken,
      next_vaccine_date: record.next_vaccine_date
        ? dayjs(record.next_vaccine_date)
        : null,
    });
    setEditModalVisible(true);
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setSelectedVaccineRecord(null);
    form.resetFields();
  };

  const handleSave = async (values) => {
    try {
      const editData = {
        dose_number: values.dose_number,
        notes: values.notes,
        isTaken: values.isTaken,
        next_vaccine_date: values.next_vaccine_date
          ? values.next_vaccine_date.format("YYYY-MM-DD")
          : null,
        record_id: selectedVaccineRecord.id,
      };

      await editVaccineRecordInfo(editData);
      toast.success("Vaccine record updated successfully");
      handleCancelEdit();
      // Refresh the data
      getChildVaccineRecords(childId, currentPage, pageSize);
    } catch (error) {
      toast.error("Failed to update vaccine record");
      console.error("Error updating vaccine record:", error);
    }
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
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<FaEdit />}
          onClick={() => handleEdit(record)}
          disabled={!record.appointment_id}
          size="small"
          className={
            record.appointment_id
              ? "bg-blue-500 hover:bg-blue-600 border-blue-500"
              : "bg-gray-400"
          }
        >
          Edit
        </Button>
      ),
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
    <>
      {/* Main Vaccines Modal */}
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
              scroll={{ x: 1100 }}
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

      {/* Edit Vaccine Record Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FaEdit className="text-blue-500" />
            <span>Edit Vaccine Record</span>
          </div>
        }
        open={editModalVisible}
        onCancel={handleCancelEdit}
        footer={null}
        width={600}
        destroyOnClose
      >
        {selectedVaccineRecord && (
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <div className="space-y-4">
              <Form.Item
                label="Dose Number"
                name="dose_number"
                rules={[
                  { required: true, message: "Please enter dose number" },
                ]}
              >
                <InputNumber min={1} className="w-full" />
              </Form.Item>

              <Form.Item
                label="Status"
                name="isTaken"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select>
                  <Select.Option value={0}>Pending</Select.Option>
                  <Select.Option value={1}>Taken</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Next Vaccine Date" name="next_vaccine_date">
                <DatePicker className="w-full" format="YYYY-MM-DD" />
              </Form.Item>

              <Form.Item label="Notes" name="notes">
                <TextArea
                  rows={3}
                  placeholder="Enter any additional notes..."
                />
              </Form.Item>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button onClick={handleCancelEdit}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={editVaccineLoading}
                  className="bg-green-500 hover:bg-green-600 border-green-500"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default Vaccines;
