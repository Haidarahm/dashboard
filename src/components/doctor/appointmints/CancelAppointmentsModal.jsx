import React, { useState } from "react";
import { Modal, DatePicker, TimePicker, Form, Button, message } from "antd";
import { toast } from "react-toastify";

const CancelAppointmentsModal = ({
  visible,
  onCancel,
  onSubmit,
  loading,
  allowedWeekdays = [],
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

      // Guard: ensure start/end days are allowed
      const startDay = startDate.day();
      const endDay = endDate.day();
      if (
        allowedWeekdays &&
        allowedWeekdays.length > 0 &&
        (!allowedWeekdays.includes(startDay) ||
          !allowedWeekdays.includes(endDay))
      ) {
        message.error("Selected dates must be on your scheduled days.");
        return;
      }

      onSubmit({
        start_leave_date: startDate.format("DD-MM-YYYY"),
        end_leave_date: endDate.format("DD-MM-YYYY"),
        start_leave_time: startTime.format("HH:mm"),
        end_leave_time: endTime.format("HH:mm"),
      });
    } catch (err) {
      // Validation error
    }
  };

  const disabledDate = (current) => {
    if (!current) return false;
    if (!allowedWeekdays || allowedWeekdays.length === 0) return false;
    const day = current.day(); // 0 (Sunday) - 6 (Saturday)
    return !allowedWeekdays.includes(day);
  };

  return (
    <Modal
      title="Cancel Appointments"
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Cancel Appointments"
      cancelText="Close"
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          label="Date Range"
          name="dates"
          rules={[
            { required: true, message: "Please select a date range" },
            ({ getFieldValue }) => ({
              validator() {
                const val = getFieldValue("dates");
                if (!val || val.length !== 2) return Promise.resolve();
                if (!allowedWeekdays || allowedWeekdays.length === 0)
                  return Promise.resolve();
                const [s, e] = val;
                const sDay = s?.day();
                const eDay = e?.day();
                if (
                  allowedWeekdays.includes(sDay) &&
                  allowedWeekdays.includes(eDay)
                )
                  return Promise.resolve();
                return Promise.reject(
                  new Error("Selected dates must be on your scheduled days.")
                );
              },
            }),
          ]}
        >
          <DatePicker.RangePicker
            style={{ width: "100%" }}
            disabledDate={disabledDate}
          />
        </Form.Item>
        <Form.Item
          label="Time Range"
          name="times"
          rules={[{ required: true, message: "Please select a time range" }]}
        >
          <TimePicker.RangePicker format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CancelAppointmentsModal;
