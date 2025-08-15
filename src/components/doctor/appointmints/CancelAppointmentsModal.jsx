import React, { useState } from "react";
import { Modal, DatePicker, TimePicker, Form, Button, message } from "antd";
import { toast } from "react-toastify";

const CancelAppointmentsModal = ({ visible, onCancel, onSubmit, loading }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!values.dates || !values.times) {
        toast.error("Please select both date and time ranges.");
        return;
      }
      const [startDate, endDate] = values.dates;
      const [startTime, endTime] = values.times;
      onSubmit({
        start_leave_date: startDate.format("DD-MM-YYYY"),
        end_leave_date: endDate.format("DD-MM-YYYY"),
        start_leave_time: startTime.format("HH:mm"),
        end_leave_time: endTime.format("HH:mm"),
      });
      toast.success("Appointments cancelled successfully.");
    } catch (err) {
      toast.error(err);
    }
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
          rules={[{ required: true, message: "Please select a date range" }]}
        >
          <DatePicker.RangePicker style={{ width: "100%" }} />
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
