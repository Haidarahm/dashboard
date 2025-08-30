import React, { useState } from "react";
import {
  Modal,
  DatePicker,
  TimePicker,
  Form,
  Button,
  Select,
  Spin,
  message,
} from "antd";
import { toast } from "react-toastify";

const { Option } = Select;

const CancelAppointmentsModal = ({
  visible,
  onCancel,
  onSubmit,
  loading,
  availableDates = [],
  doctors = [],
  selectedDoctor,
  onDoctorSelect,
  loadingWorkDays,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!values.dates || !values.times) {
        message.error("Please select both date and time ranges.");
        return;
      }
      const [startDate, endDate] = values.dates;
      const [startTime, endTime] = values.times;

      // Guard: ensure start/end dates are in available dates
      const startDateStr = startDate.format("YYYY-MM-DD");
      const endDateStr = endDate.format("YYYY-MM-DD");

      if (
        availableDates &&
        availableDates.length > 0 &&
        (!availableDates.includes(startDateStr) ||
          !availableDates.includes(endDateStr))
      ) {
        message.error(
          "Selected dates must be on the doctor's available work days."
        );
        return;
      }

      onSubmit({
        start_leave_date: startDate.format("DD-MM-YYYY"),
        end_leave_date: endDate.format("DD-MM-YYYY"),
        start_leave_time: startTime.format("HH:mm"),
        end_leave_time: endTime.format("HH:mm"),
      });
    } catch (err) {
      // Form validation error
    }
  };

  const disabledDate = (current) => {
    if (!current) return false;
    if (!availableDates || availableDates.length === 0) return true; // Disable all dates if no work days

    const dateStr = current.format("YYYY-MM-DD");
    return !availableDates.includes(dateStr);
  };

  const handleDoctorChange = (doctorId) => {
    onDoctorSelect(doctorId);
    // Set the form field value to match the selected doctor
    form.setFieldsValue({ doctor: doctorId });
    // Reset other form fields when doctor changes
    form.setFieldsValue({ dates: undefined, times: undefined });
  };

  return (
    <Modal
      title="Cancel Doctor Appointments"
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Cancel Appointments"
      cancelText="Close"
      destroyOnClose
      width={600}
      okButtonProps={{
        disabled:
          !selectedDoctor || loadingWorkDays || availableDates.length === 0,
      }}
    >
      <Form form={form} layout="vertical" preserve={false}>
        {/* Doctor Selection */}
        <Form.Item
          label="Select Doctor"
          name="doctor"
          rules={[{ required: true, message: "Please select a doctor" }]}
        >
          <Select
            placeholder="Choose a doctor"
            onChange={handleDoctorChange}
            value={selectedDoctor}
            loading={loadingWorkDays}
          >
            {doctors.map((doctor) => (
              <Option key={doctor.id} value={doctor.id}>
                {doctor.first_name} {doctor.last_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Loading indicator for work days */}
        {loadingWorkDays && (
          <div className="flex items-center justify-center py-4">
            <Spin size="small" />
            <span className="ml-2 text-sm text-gray-600">
              Loading doctor's work days...
            </span>
          </div>
        )}

        {/* Date Range - Only show if doctor is selected and has work days */}
        {selectedDoctor && !loadingWorkDays && availableDates.length > 0 && (
          <Form.Item
            label="Date Range"
            name="dates"
            rules={[
              { required: true, message: "Please select a date range" },
              ({ getFieldValue }) => ({
                validator() {
                  const val = getFieldValue("dates");
                  if (!val || val.length !== 2) return Promise.resolve();
                  if (!availableDates || availableDates.length === 0)
                    return Promise.resolve();
                  const [s, e] = val;
                  const sDateStr = s?.format("YYYY-MM-DD");
                  const eDateStr = e?.format("YYYY-MM-DD");
                  if (
                    availableDates.includes(sDateStr) &&
                    availableDates.includes(eDateStr)
                  )
                    return Promise.resolve();
                  return Promise.reject(
                    new Error(
                      "Selected dates must be on the doctor's available work days."
                    )
                  );
                },
              }),
            ]}
          >
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              disabledDate={disabledDate}
              disabled={!selectedDoctor}
            />
          </Form.Item>
        )}

        {/* Time Range - Only show if doctor is selected and has work days */}
        {selectedDoctor && !loadingWorkDays && availableDates.length > 0 && (
          <Form.Item
            label="Time Range"
            name="times"
            rules={[{ required: true, message: "Please select a time range" }]}
          >
            <TimePicker.RangePicker
              format="HH:mm"
              style={{ width: "100%" }}
              disabled={!selectedDoctor}
            />
          </Form.Item>
        )}

        {/* No Work Days Message */}
        {selectedDoctor && !loadingWorkDays && availableDates.length === 0 && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-900 mb-2">
              No Work Days Available
            </h4>
            <p className="text-xs text-yellow-700">
              This doctor has no scheduled work days in the selected period.
            </p>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default CancelAppointmentsModal;
