import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Spin,
  Row,
  Col,
  Typography,
} from "antd";
import { FaBaby, FaSave } from "react-icons/fa";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const AddChildRecord = ({
  visible,
  onCancel,
  onSubmit,
  loading,
  children,
  selectedChildId,
}) => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      // If a child ID is provided, set it automatically
      if (selectedChildId) {
        form.setFieldsValue({ child_id: selectedChildId });
      }
    }
  }, [visible, form, selectedChildId]);

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      // Validate numeric values
      const height = parseFloat(values.height_cm);
      const weight = parseFloat(values.weight_kg);
      const headCircumference = parseFloat(values.head_circumference_cm);

      if (isNaN(height) || height <= 0) {
        throw new Error("Please enter a valid height value");
      }
      if (isNaN(weight) || weight <= 0) {
        throw new Error("Please enter a valid weight value");
      }
      if (isNaN(headCircumference) || headCircumference <= 0) {
        throw new Error("Please enter a valid head circumference value");
      }

      // Format the data according to the expected structure
      const formData = {
        child_id: values.child_id,
        height_cm: height,
        weight_kg: weight,
        head_circumference_cm: headCircumference,
        growth_notes: values.growth_notes || "",
        developmental_observations: values.developmental_observations || "",
        allergies: values.allergies || "",
        doctor_notes: values.doctor_notes || "",
        feeding_type: values.feeding_type,
        last_visit_date: values.last_visit_date
          ? values.last_visit_date.format("YYYY-MM-DD")
          : null,
        next_visit_date: values.next_visit_date
          ? values.next_visit_date.format("YYYY-MM-DD")
          : null,
      };

      await onSubmit(formData);
      toast.success("Child record added successfully!");
      form.resetFields();
      onCancel();
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Unknown error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const feedingTypeOptions = [
    { value: "natural", label: "Natural" },
    { value: "formula", label: "Formula" },
    { value: "mixed", label: "Mixed" },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FaBaby className="text-blue-500" />
          <span>Add Child Record</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
      destroyOnClose
      className="my-8"
      bodyStyle={{ padding: "24px" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          feeding_type: "natural",
        }}
      >
        <Row gutter={16}>
          {/* Child Selection */}
          <Col span={24}>
            <Form.Item
              name="child_id"
              label="Select Child"
              rules={[{ required: true, message: "Please select a child" }]}
            >
              <Select
                placeholder="Select a child"
                showSearch
                optionFilterProp="children"
                loading={loading}
                disabled={!!selectedChildId}
              >
                {children?.map((child) => (
                  <Option key={child.id} value={child.id}>
                    {child.first_name} {child.last_name} - {child.birth_date}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Height */}
          <Col span={8}>
            <Form.Item
              name="height_cm"
              label="Height (cm)"
              rules={[
                { required: true, message: "Please enter height" },
                {
                  validator: (_, value) => {
                    if (!value || value === "") {
                      return Promise.reject(new Error("Please enter height"));
                    }
                    const numValue = parseFloat(value);
                    if (isNaN(numValue)) {
                      return Promise.reject(
                        new Error("Please enter a valid number")
                      );
                    }
                    if (numValue <= 0) {
                      return Promise.reject(
                        new Error("Height must be greater than 0")
                      );
                    }
                    if (numValue > 300) {
                      return Promise.reject(
                        new Error("Height must be reasonable (max 300 cm)")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                type="number"
                step="0.1"
                min="0.1"
                max="300"
                placeholder="e.g., 50.5"
                suffix="cm"
              />
            </Form.Item>
          </Col>

          {/* Weight */}
          <Col span={8}>
            <Form.Item
              name="weight_kg"
              label="Weight (kg)"
              rules={[
                { required: true, message: "Please enter weight" },
                {
                  validator: (_, value) => {
                    if (!value || value === "") {
                      return Promise.reject(new Error("Please enter weight"));
                    }
                    const numValue = parseFloat(value);
                    if (isNaN(numValue)) {
                      return Promise.reject(
                        new Error("Please enter a valid number")
                      );
                    }
                    if (numValue <= 0) {
                      return Promise.reject(
                        new Error("Weight must be greater than 0")
                      );
                    }
                    if (numValue > 200) {
                      return Promise.reject(
                        new Error("Weight must be reasonable (max 200 kg)")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                type="number"
                step="0.1"
                min="0.1"
                max="200"
                placeholder="e.g., 5.5"
                suffix="kg"
              />
            </Form.Item>
          </Col>

          {/* Head Circumference */}
          <Col span={8}>
            <Form.Item
              name="head_circumference_cm"
              label="Head Circumference (cm)"
              rules={[
                { required: true, message: "Please enter head circumference" },
                {
                  validator: (_, value) => {
                    if (!value || value === "") {
                      return Promise.reject(
                        new Error("Please enter head circumference")
                      );
                    }
                    const numValue = parseFloat(value);
                    if (isNaN(numValue)) {
                      return Promise.reject(
                        new Error("Please enter a valid number")
                      );
                    }
                    if (numValue <= 0) {
                      return Promise.reject(
                        new Error("Head circumference must be greater than 0")
                      );
                    }
                    if (numValue > 100) {
                      return Promise.reject(
                        new Error(
                          "Head circumference must be reasonable (max 100 cm)"
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                type="number"
                step="0.1"
                min="0.1"
                max="100"
                placeholder="e.g., 35.0"
                suffix="cm"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Feeding Type */}
          <Col span={12}>
            <Form.Item
              name="feeding_type"
              label="Feeding Type"
              rules={[
                { required: true, message: "Please select feeding type" },
              ]}
            >
              <Select placeholder="Select feeding type">
                {feedingTypeOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Last Visit Date */}
          <Col span={12}>
            <Form.Item
              name="last_visit_date"
              label="Last Visit Date"
              rules={[
                { required: true, message: "Please select last visit date" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Select date"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Next Visit Date */}
          <Col span={12}>
            <Form.Item name="next_visit_date" label="Next Visit Date">
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Select date (optional)"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Growth Notes */}
          <Col span={24}>
            <Form.Item name="growth_notes" label="Growth Notes">
              <TextArea
                rows={3}
                placeholder="Enter growth observations and notes..."
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Developmental Observations */}
          <Col span={24}>
            <Form.Item
              name="developmental_observations"
              label="Developmental Observations"
            >
              <TextArea
                rows={3}
                placeholder="Enter developmental milestones and observations..."
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Allergies */}
          <Col span={24}>
            <Form.Item name="allergies" label="Known Allergies">
              <TextArea
                rows={2}
                placeholder="Enter any known allergies or leave empty if none..."
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Doctor Notes */}
          <Col span={24}>
            <Form.Item
              name="doctor_notes"
              label="Doctor's Notes & Recommendations"
            >
              <TextArea
                rows={3}
                placeholder="Enter medical notes, recommendations, and follow-up instructions..."
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row gutter={16} className="mt-6">
          <Col span={24} className="flex justify-end gap-3">
            <Button onClick={onCancel} disabled={submitLoading}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitLoading}
              icon={<FaSave />}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {submitLoading ? "Adding..." : "Add Record"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddChildRecord;
