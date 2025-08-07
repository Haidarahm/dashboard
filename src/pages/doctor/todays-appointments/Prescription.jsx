import React, { useState } from "react";
import {
  Modal,
  Collapse,
  Button,
  Input,
  Form,
  Space,
  Typography,
  message,
  Spin,
} from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  NumberOutlined,
  ClockCircleOutlined,
  ExperimentOutlined,
  CalendarOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import usePrescriptionStore from "../../../store/doctor/prescriptionStore";
import { toast } from "react-toastify";

const { Panel } = Collapse;
const { Title } = Typography;
const { TextArea } = Input;

const Prescription = ({ visible, onClose, patientId, patientName }) => {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState(["1"]);
  const [medicineSections, setMedicineSections] = useState([
    { key: "1", saved: false },
  ]);
  const [showCompleteTextarea, setShowCompleteTextarea] = useState(false);
  const [completeNote, setCompleteNote] = useState("");
  const [savingSectionKey, setSavingSectionKey] = useState(null);
  const [formChanged, setFormChanged] = useState(0); // dummy state to force rerender

  const {
    createPrescription,
    addMedicineToPrescription,
    completePrescriptionAction,
    currentPrescription,
    prescriptionLoading,
    medicineLoading,
    completionLoading,
    clearCurrentPrescription,
  } = usePrescriptionStore();

  const handleCreatePrescription = async () => {
    try {
      const result = await createPrescription(patientId);
      if (result) {
        toast.success("Prescription created successfully");
      } else {
        toast.error("Failed to create prescription");
      }
    } catch (error) {
      toast.error("Error creating prescription");
    }
  };

  const handleAddMedicineSection = () => {
    const newKey = String(medicineSections.length + 1);
    setMedicineSections([...medicineSections, { key: newKey, saved: false }]);
    setActiveKey([newKey]);
  };

  const handleSaveMedicine = async (sectionKey) => {
    try {
      setSavingSectionKey(sectionKey);
      const values = await form.validateFields();
      const medicineData = {
        name: values[`name_${sectionKey}`],
        dose: values[`dose_${sectionKey}`],
        frequency: values[`frequency_${sectionKey}`],
        strength: values[`strength_${sectionKey}`],
        until: values[`until_${sectionKey}`],
        whenToTake: values[`whenToTake_${sectionKey}`],
        prescription_id: currentPrescription?.data?.prescription_id,
        note: values[`note_${sectionKey}`] || "",
      };
      const result = await addMedicineToPrescription(medicineData);
      setSavingSectionKey(null);
      if (result) {
        message.success("Medicine added successfully");
        setMedicineSections((prev) =>
          prev.map((section) =>
            section.key === sectionKey ? { ...section, saved: true } : section
          )
        );
      } else {
        message.error("Failed to add medicine");
      }
    } catch (error) {
      setSavingSectionKey(null);
      message.error("Please fill all required fields");
    }
  };

  const handleCompletePrescription = async () => {
    // No longer require note
    try {
      const result = await completePrescriptionAction({
        id: currentPrescription?.data?.prescription_id,
        note: completeNote,
      });
      if (result) {
        toast.success("Prescription completed successfully");
        handleClose();
      } else {
        toast.error("Failed to complete prescription");
      }
    } catch (error) {
      toast.error("Error completing prescription");
    }
  };

  const handleClose = () => {
    setMedicineSections([{ key: "1", saved: false }]);
    setActiveKey(["1"]);
    setShowCompleteTextarea(false);
    setCompleteNote("");
    clearCurrentPrescription();
    form.resetFields();
    onClose();
  };

  const renderMedicineForm = (sectionKey) => (
    <Form.Item
      label={
        <span>
          <MedicineBoxOutlined style={{ marginRight: 4, color: "#1890ff" }} />
          Medicine Name
        </span>
      }
      name={`name_${sectionKey}`}
      rules={[{ required: true, message: "Please enter medicine name" }]}
    >
      <Input placeholder="Enter medicine name" />
    </Form.Item>
  );

  const renderDoseForm = (sectionKey) => (
    <Form.Item
      label={
        <span>
          <NumberOutlined style={{ marginRight: 4, color: "#1890ff" }} />
          Dose
        </span>
      }
      name={`dose_${sectionKey}`}
      rules={[{ required: true, message: "Please enter dose" }]}
    >
      <Input type="number" placeholder="e.g., 500" min={0} step={1} />
    </Form.Item>
  );

  const renderFrequencyForm = (sectionKey) => (
    <Form.Item
      label={
        <span>
          <ClockCircleOutlined style={{ marginRight: 4, color: "#1890ff" }} />
          Frequency
        </span>
      }
      name={`frequency_${sectionKey}`}
      rules={[{ required: true, message: "Please enter frequency" }]}
    >
      <Input placeholder="e.g., Every 6 hours, Twice daily" />
    </Form.Item>
  );

  const renderStrengthForm = (sectionKey) => (
    <Form.Item
      label={
        <span>
          <ExperimentOutlined style={{ marginRight: 4, color: "#1890ff" }} />
          Strength
        </span>
      }
      name={`strength_${sectionKey}`}
      rules={[{ required: true, message: "Please enter strength" }]}
    >
      <Input placeholder="e.g., 500mg, 10mg/ml" />
    </Form.Item>
  );

  const renderUntilForm = (sectionKey) => (
    <Form.Item
      label={
        <span>
          <CalendarOutlined style={{ marginRight: 4, color: "#1890ff" }} />
          Until
        </span>
      }
      name={`until_${sectionKey}`}
      rules={[{ required: true, message: "Please select until date" }]}
    >
      <Input type="date" />
    </Form.Item>
  );

  const renderWhenToTakeForm = (sectionKey) => (
    <Form.Item
      label={
        <span>
          <ScheduleOutlined style={{ marginRight: 4, color: "#1890ff" }} />
          When to Take
        </span>
      }
      name={`whenToTake_${sectionKey}`}
      rules={[{ required: true, message: "Please enter when to take" }]}
    >
      <Input placeholder="e.g., After meals, Before bedtime" />
    </Form.Item>
  );

  const renderNoteForm = (sectionKey) => (
    <Form.Item
      label={
        <span>
          <FileTextOutlined style={{ marginRight: 4, color: "#1890ff" }} />
          Note
        </span>
      }
      name={`note_${sectionKey}`}
    >
      <TextArea rows={2} placeholder="Additional notes about this medicine" />
    </Form.Item>
  );

  // Helper to check if all required fields in a section are filled and valid
  const isSectionValid = (sectionKey) => {
    const values = form.getFieldsValue();
    const requiredFields = [
      `name_${sectionKey}`,
      `dose_${sectionKey}`,
      `frequency_${sectionKey}`,
      `strength_${sectionKey}`,
      `until_${sectionKey}`,
      `whenToTake_${sectionKey}`,
    ];
    // All required fields must be filled
    const allFilled = requiredFields.every(
      (field) => values[field] !== undefined && values[field] !== ""
    );
    // No validation errors for required fields
    const noErrors = requiredFields.every(
      (field) => (form.getFieldError(field) || []).length === 0
    );
    return allFilled && noErrors;
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MedicineBoxOutlined style={{ fontSize: 24, color: "#1890ff" }} />
          <Title level={4} style={{ margin: 0, display: "inline-block" }}>
            Write Prescription
          </Title>
          {patientName && (
            <span style={{ color: "#666", fontSize: "14px" }}>
              for {patientName}
            </span>
          )}
        </div>
      }
      open={visible}
      onCancel={handleClose}
      width={800}
      footer={[
        <Button
          key="complete"
          type="primary"
          loading={completionLoading}
          onClick={handleCompletePrescription}
          disabled={!medicineSections.some((section) => section.saved)}
        >
          Complete Prescription
        </Button>,
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
      ]}
    >
      {!currentPrescription && prescriptionLoading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Title level={4} type="secondary">
              Creating prescription...
            </Title>
          </div>
        </div>
      ) : (
        <div>
          <Form
            form={form}
            layout="vertical"
            onValuesChange={() => setFormChanged((c) => c + 1)}
          >
            <Collapse activeKey={activeKey} onChange={setActiveKey} ghost>
              {medicineSections.map((section) => (
                <Panel
                  key={section.key}
                  header={`Medicine ${section.key}`}
                  extra={
                    <Space>
                      {section.saved && (
                        <span style={{ color: "#52c41a", fontSize: "12px" }}>
                          ✓ Saved
                        </span>
                      )}
                      <Button
                        type="primary"
                        size="small"
                        icon={<SaveOutlined />}
                        loading={savingSectionKey === section.key}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveMedicine(section.key);
                        }}
                        disabled={!isSectionValid(section.key)}
                      >
                        Save
                      </Button>
                    </Space>
                  }
                >
                  <div style={{ padding: "16px 0" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 16,
                      }}
                    >
                      {renderMedicineForm(section.key)}
                      {renderDoseForm(section.key)}
                      {renderFrequencyForm(section.key)}
                      {renderStrengthForm(section.key)}
                      {renderUntilForm(section.key)}
                      {renderWhenToTakeForm(section.key)}
                    </div>
                    {renderNoteForm(section.key)}
                  </div>
                </Panel>
              ))}
            </Collapse>
          </Form>

          <div style={{ margin: "16px 0" }}>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddMedicineSection}
              style={{ width: "100%" }}
            >
              Add Medicine
            </Button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Title level={5}>Prescription Note</Title>
            <TextArea
              rows={4}
              placeholder="Enter prescription notes..."
              value={completeNote}
              onChange={(e) => setCompleteNote(e.target.value)}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default Prescription;
