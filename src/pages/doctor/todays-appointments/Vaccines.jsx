import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Tag,
  Typography,
  Spin,
} from "antd";
import dayjs from "dayjs";

import {
  FaSyringe,
  FaCalendarAlt,
  FaEdit,
  FaClock,
  FaUser,
} from "react-icons/fa";
import useChildStore from "../../../store/doctor/childStore";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Vaccines = ({ visible, onCancel, appointmentId }) => {
  const {
    appointmentVaccinationRecord,
    appointmentVaccinationLoading,
    appointmentVaccinationError,
    getAppointmentVaccinationRecord,
    editVaccineRecordInfo,
    editVaccineLoading,
  } = useChildStore();

  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (visible && appointmentId) {
      getAppointmentVaccinationRecord(appointmentId);
    }
  }, [visible, appointmentId, getAppointmentVaccinationRecord]);

  useEffect(() => {
    if (appointmentVaccinationRecord && editMode) {
      form.setFieldsValue({
        dose_number: appointmentVaccinationRecord.dose_number,
        notes: appointmentVaccinationRecord.notes || "",
        isTaken: appointmentVaccinationRecord.isTaken,
        next_vaccine_date: appointmentVaccinationRecord.next_vaccine_date
          ? dayjs(appointmentVaccinationRecord.next_vaccine_date)
          : null,
      });
    }
  }, [appointmentVaccinationRecord, editMode, form]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
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
        record_id: appointmentVaccinationRecord.vaccination_record_id,
      };

      await editVaccineRecordInfo(editData);
      toast.success("Vaccine record updated successfully");
      setEditMode(false);
      // Close the modal on success
      onCancel();
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

  if (appointmentVaccinationError) {
    return (
      <Modal
        title="Vaccination Record"
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={800}
        destroyOnClose
      >
        <div className="text-center py-8">
          <Text type="danger">Error: {appointmentVaccinationError}</Text>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FaSyringe className="text-blue-500" />
          <span>Vaccination Record</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      {appointmentVaccinationLoading ? (
        <div className="text-center py-8">
          <Spin size="large" />
          <div className="mt-2">
            <Text type="secondary">Loading vaccination record...</Text>
          </div>
        </div>
      ) : appointmentVaccinationRecord ? (
        <div>
          {!editMode ? (
            // View Mode
            <div className="space-y-4">
              {/* Patient Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FaUser className="text-blue-500" />
                  <Title level={5} className="mb-0">
                    Patient Information
                  </Title>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text strong>Patient Name:</Text>
                    <div className="mt-1">
                      <Text>
                        {appointmentVaccinationRecord.patient_first_name}{" "}
                        {appointmentVaccinationRecord.patient_last_name}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FaCalendarAlt className="text-green-500" />
                  <Title level={5} className="mb-0">
                    Appointment Information
                  </Title>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text strong>Reservation Date:</Text>
                    <div className="mt-1">
                      <Text>
                        {appointmentVaccinationRecord.reservation_date}
                      </Text>
                    </div>
                  </div>
                  <div>
                    <Text strong>Reservation Hour:</Text>
                    <div className="mt-1">
                      <Text>
                        {appointmentVaccinationRecord.reservation_hour.slice(
                          0,
                          5
                        )}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vaccine Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FaSyringe className="text-purple-500" />
                  <Title level={5} className="mb-0">
                    Vaccine Information
                  </Title>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text strong>Vaccine Name:</Text>
                    <div className="mt-1">
                      <Text strong className="text-blue-600">
                        {appointmentVaccinationRecord.vaccine_name}
                      </Text>
                    </div>
                  </div>
                  <div>
                    <Text strong>Dose Number:</Text>
                    <div className="mt-1">
                      <Tag color="blue" className="font-medium">
                        Dose {appointmentVaccinationRecord.dose_number}
                      </Tag>
                    </div>
                  </div>
                  <div>
                    <Text strong>Status:</Text>
                    <div className="mt-1">
                      <Tag
                        color={getStatusColor(
                          appointmentVaccinationRecord.isTaken
                        )}
                        className="font-medium"
                      >
                        {getStatusText(appointmentVaccinationRecord.isTaken)}
                      </Tag>
                    </div>
                  </div>
                  <div>
                    <Text strong>When to Take:</Text>
                    <div className="mt-1">
                      <Text>{appointmentVaccinationRecord.when_to_take}</Text>
                    </div>
                  </div>
                  <div>
                    <Text strong>Recommended:</Text>
                    <div className="mt-1">
                      <Tag
                        color={getRecommendedColor(
                          appointmentVaccinationRecord.recommended
                        )}
                        className="font-medium"
                      >
                        {getRecommendedText(
                          appointmentVaccinationRecord.recommended
                        )}
                      </Tag>
                    </div>
                  </div>
                  <div>
                    <Text strong>Next Vaccine Date:</Text>
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <FaClock className="text-purple-500" />
                        <Text>
                          {appointmentVaccinationRecord.next_vaccine_date ||
                            "Not scheduled"}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
                {appointmentVaccinationRecord.notes && (
                  <div className="mt-4">
                    <Text strong>Notes:</Text>
                    <div className="mt-1">
                      <Text>{appointmentVaccinationRecord.notes}</Text>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button onClick={onCancel}>Close</Button>
                <Button
                  type="primary"
                  icon={<FaEdit />}
                  onClick={handleEdit}
                  className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                >
                  Edit Vaccine
                </Button>
              </div>
            </div>
          ) : (
            // Edit Mode
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={{
                dose_number: appointmentVaccinationRecord?.dose_number,
                notes: appointmentVaccinationRecord?.notes || "",
                isTaken: appointmentVaccinationRecord?.isTaken,
                next_vaccine_date:
                  appointmentVaccinationRecord?.next_vaccine_date
                    ? dayjs(appointmentVaccinationRecord.next_vaccine_date)
                    : null,
              }}
            >
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
        </div>
      ) : (
        <div className="text-center py-8">
          <Text type="secondary">
            No vaccination record found for this appointment
          </Text>
        </div>
      )}
    </Modal>
  );
};

export default Vaccines;
