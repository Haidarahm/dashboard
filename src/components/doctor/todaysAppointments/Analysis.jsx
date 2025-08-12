import React, { useState } from "react";
import { Modal, Form, Input, Button, Typography, message, Space } from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
import useAnalyzeStore from "../../../store/doctor/analyzeStore";

const { Title } = Typography;
const { TextArea } = Input;

const Analysis = ({ visible, onClose, patientId, patientName }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { requestAnalyzeAction, requestLoading } = useAnalyzeStore();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const result = await requestAnalyzeAction({
        name: values.name,
        description: values.description,
        patient_id: patientId,
      });

      if (result) {
        message.success("Analysis request submitted successfully");
        form.resetFields();
        onClose();
      } else {
        message.error("Failed to submit analysis request");
      }
    } catch (error) {
      message.error("Error submitting analysis request");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ExperimentOutlined style={{ fontSize: 24, color: "#1890ff" }} />
          <Title level={4} style={{ margin: 0, display: "inline-block" }}>
            Request Analysis
          </Title>
          {patientName && (
            <span style={{ color: "#666", fontSize: "14px" }}>
              for {patientName}
            </span>
          )}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          label="Analysis Name"
          name="name"
          rules={[{ required: true, message: "Please enter analysis name" }]}
        >
          <Input placeholder="Enter analysis name (e.g., Blood Test, X-Ray)" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea
            rows={4}
            placeholder="Enter detailed description of the analysis needed..."
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading || requestLoading}
              icon={<ExperimentOutlined />}
            >
              Submit Request
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Analysis;
