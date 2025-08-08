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
  AutoComplete,
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

const frequencyOptions = [
  "Once a day",
  "Twice a day",
  "Three times a day",
  "Every 4 hours",
  "Every 6 hours",
  "Every 8 hours",
  "As needed (PRN)",
  "Weekly",
  "Monthly",
];
const untilOptions = [
  "For 3 days",
  "For 7 days",
  "For 10 days",
  "For 2 weeks",
  "For 1 month",
  "Indefinitely",
  "Until next appointment",
];
const whenToTakeOptions = [
  "Morning",
  "Afternoon",
  "Evening",
  "At bedtime",
  "Before meals",
  "After meals",
  "With food",
  "On an empty stomach",
];

const Prescription = ({
  visible,
  onClose,
  patientId,
  patientName,
  appointmentId,
}) => {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState(["1"]);
  const [medicineSections, setMedicineSections] = useState([
    { key: "1", saved: false },
  ]);
  const [showCompleteTextarea, setShowCompleteTextarea] = useState(false);
  const [completeNote, setCompleteNote] = useState("");
  const [savingSectionKey, setSavingSectionKey] = useState(null);
  const [formChanged, setFormChanged] = useState(0);
  const [currentStep, setCurrentStep] = useState(1); // 1: medicines, 2: diagnosis, 3: preview
  const [diagnosisForm] = Form.useForm();
  const [diagnosisData, setDiagnosisData] = useState({
    symptoms: "",
    diagnosis: "",
    doctorNote: "",
    patientNote: "",
  });
  const [nextButtonLoading, setNextButtonLoading] = useState(false);

  const {
    createPrescription,
    addMedicineToPrescription,
    completePrescriptionAction,
    addMedicalInfo,
    currentPrescription,
    prescriptionLoading,
    medicineLoading,
    completionLoading,
    medicalInfoLoading,
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

  const handleNextStep = async () => {
    if (currentStep === 1) {
      // Validate that at least one medicine is saved
      if (!medicineSections.some((section) => section.saved)) {
        toast.error("Please add at least one medicine before proceeding");
        return;
      }

      // Complete prescription before moving to next step
      setNextButtonLoading(true);
      try {
        const result = await completePrescriptionAction({
          id: currentPrescription?.data?.prescription_id,
          note: completeNote,
        });
        if (result) {
          toast.success("Prescription completed successfully");
          setCurrentStep(2);
        } else {
          toast.error("Failed to complete prescription");
        }
      } catch (error) {
        toast.error("Error completing prescription");
      } finally {
        setNextButtonLoading(false);
      }
    } else if (currentStep === 2) {
      // Validate diagnosis form
      diagnosisForm
        .validateFields()
        .then(() => {
          setCurrentStep(3);
        })
        .catch(() => {
          toast.error("Please fill all required fields");
        });
    }
  };

  const handleBackStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  const handleSaveDiagnosis = async () => {
    try {
      const values = await diagnosisForm.validateFields();
      const medicalData = {
        prescription_id: currentPrescription?.data?.prescription_id,
        appointment_id: appointmentId, // Use the appointment ID from props
        symptoms: values.symptoms,
        diagnosis: values.diagnosis,
        doctorNote: values.doctorNote,
        patientNote: values.patientNote,
      };

      const result = await addMedicalInfo(medicalData);
      if (result) {
        toast.success("Diagnosis saved successfully");
        setDiagnosisData(values);
        handleClose(); // Close modal after successful save
      } else {
        toast.error("Failed to save diagnosis");
      }
    } catch (error) {
      toast.error("Please fill all required fields");
    }
  };

  const handleCompletePrescription = async () => {
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
    setCurrentStep(1);
    setDiagnosisData({
      symptoms: "",
      diagnosis: "",
      doctorNote: "",
      patientNote: "",
    });
    diagnosisForm.resetFields();
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
      <AutoComplete
        options={frequencyOptions.map((v) => ({ value: v }))}
        placeholder="Select or type frequency"
        filterOption={(inputValue, option) =>
          option.value.toLowerCase().includes(inputValue.toLowerCase())
        }
        allowClear
      />
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
      rules={[
        { required: true, message: "Please select until date or period" },
      ]}
    >
      <AutoComplete
        options={untilOptions.map((v) => ({ value: v }))}
        placeholder="Select or type until period"
        filterOption={(inputValue, option) =>
          option.value.toLowerCase().includes(inputValue.toLowerCase())
        }
        allowClear
      />
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
      <AutoComplete
        options={whenToTakeOptions.map((v) => ({ value: v }))}
        placeholder="Select or type when to take"
        filterOption={(inputValue, option) =>
          option.value.toLowerCase().includes(inputValue.toLowerCase())
        }
        allowClear
      />
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

  const renderDiagnosisStep = () => (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        <MedicineBoxOutlined style={{ marginRight: 8, color: "#1890ff" }} />
        Add Diagnosis
      </Title>
      <Form form={diagnosisForm} layout="vertical">
        <Form.Item
          label="Symptoms"
          name="symptoms"
          rules={[{ required: true, message: "Please enter symptoms" }]}
        >
          <TextArea rows={3} placeholder="Enter patient symptoms..." />
        </Form.Item>

        <Form.Item
          label="Diagnosis"
          name="diagnosis"
          rules={[{ required: true, message: "Please enter diagnosis" }]}
        >
          <TextArea rows={3} placeholder="Enter diagnosis..." />
        </Form.Item>

        <Form.Item
          label="Doctor Note"
          name="doctorNote"
          rules={[{ required: true, message: "Please enter doctor note" }]}
        >
          <TextArea rows={3} placeholder="Enter doctor notes..." />
        </Form.Item>

        <Form.Item label="Patient Note" name="patientNote">
          <TextArea rows={3} placeholder="Enter patient notes (optional)..." />
        </Form.Item>
      </Form>
    </div>
  );

  const renderPreviewStep = () => (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        <FileTextOutlined style={{ marginRight: 8, color: "#1890ff" }} />
        Preview Prescription
      </Title>
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Medicines:</Title>
        {medicineSections
          .filter((section) => section.saved)
          .map((section, index) => (
            <div
              key={section.key}
              style={{
                marginBottom: 8,
                padding: 8,
                border: "1px solid #d9d9d9",
                borderRadius: 4,
              }}
            >
              <strong>Medicine {index + 1}</strong>
              {/* Display medicine details here */}
            </div>
          ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Diagnosis:</Title>
        <div
          style={{ padding: 8, border: "1px solid #d9d9d9", borderRadius: 4 }}
        >
          <strong>Symptoms:</strong> {diagnosisData.symptoms}
          <br />
          <strong>Diagnosis:</strong> {diagnosisData.diagnosis}
          <br />
          <strong>Doctor Note:</strong> {diagnosisData.doctorNote}
          <br />
          {diagnosisData.patientNote && (
            <>
              <strong>Patient Note:</strong> {diagnosisData.patientNote}
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
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
        );
      case 2:
        return renderDiagnosisStep();
      case 3:
        return renderPreviewStep();
      default:
        return null;
    }
  };

  const renderFooterButtons = () => {
    if (currentStep === 1) {
      return [
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button
          key="next"
          type="primary"
          loading={nextButtonLoading}
          onClick={handleNextStep}
          disabled={!medicineSections.some((section) => section.saved)}
        >
          Next
        </Button>,
      ];
    } else if (currentStep === 2) {
      return [
        <Button key="back" onClick={handleBackStep}>
          Back
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={medicalInfoLoading}
          onClick={handleSaveDiagnosis}
        >
          Save Diagnosis
        </Button>,
      ];
    }
    return [];
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
      footer={renderFooterButtons()}
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
        <div>{renderStepContent()}</div>
      )}
    </Modal>
  );
};

export default Prescription;
