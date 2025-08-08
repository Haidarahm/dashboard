import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Spin,
  Typography,
  Tag,
  Button,
  Tooltip,
  Popover,
  Space,
} from "antd";
import { UserOutlined, FileTextOutlined } from "@ant-design/icons";
import { useAppointmentsStore } from "../../../store/doctor/appointmentsStore";
import usePatientsStore from "../../../store/doctor/patientsStore";
import PatientDetails from "./PatientDetails";
import Prescription from "./Prescription";
import usePrescriptionStore from "../../../store/doctor/prescriptionStore";

const { Title } = Typography;

function TodaysAppointments() {
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [loadingPatientId, setLoadingPatientId] = useState(null);
  const [prescriptionVisible, setPrescriptionVisible] = useState(false);
  const [selectedPatientForPrescription, setSelectedPatientForPrescription] =
    useState(null);
  const [prescriptionIconLoading, setPrescriptionIconLoading] = useState(false);

  const {
    filteredAppointments,
    loading,
    error,
    fetchByStatus,
    setCurrentMonthYear,
  } = useAppointmentsStore();

  const { fetchPatientProfile, patientProfile, profileLoading } =
    usePatientsStore();

  const { createPrescription, clearCurrentPrescription } =
    usePrescriptionStore();

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const monthYear = `${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${today.getFullYear()}`;

  useEffect(() => {
    setCurrentMonthYear(monthYear);
    fetchByStatus("today", todayStr);
    // eslint-disable-next-line
  }, []);

  const handleShowProfile = async (patientId) => {
    setLoadingPatientId(patientId);
    setSelectedPatientId(patientId);
    await fetchPatientProfile(patientId);
    setLoadingPatientId(null);
    setIsDetailsVisible(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsVisible(false);
    setSelectedPatientId(null);
  };

  const handleWritePrescription = async (record) => {
    // Clear any previous prescription state
    clearCurrentPrescription();
    setPrescriptionIconLoading(true);
    // Create prescription before opening modal
    const result = await createPrescription(record.patient_id);
    setPrescriptionIconLoading(false);
    if (result) {
      setSelectedPatientForPrescription({
        id: record.patient_id,
        name: `${record.patient_first_name || ""} ${
          record.patient_last_name || ""
        }`.trim(),
        appointment_id: record.id, // Store the appointment ID
      });
      setPrescriptionVisible(true);
    }
  };

  const handleClosePrescription = () => {
    setPrescriptionVisible(false);
    setSelectedPatientForPrescription(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Patient Name",
      key: "patient_name",
      render: (_, record) =>
        `${record.patient_first_name || ""} ${record.patient_last_name || ""}`,
    },
    {
      title: "Reservation Hour",
      dataIndex: "reservation_hour",
      key: "reservation_hour",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "visited" ? "green" : "blue"}>{status}</Tag>
      ),
    },
    {
      title: "Appointment Type",
      dataIndex: "appointment_type",
      key: "appointment_type",
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (payment_status) => (
        <Tag color={payment_status === "paid" ? "green" : "red"}>
          {payment_status}
        </Tag>
      ),
    },
    {
      title: "Referred By",
      dataIndex: "referred by",
      key: "referred by",
    },
    {
      title: "Is Child",
      dataIndex: "is_child",
      key: "is_child",
      render: (is_child) => (is_child ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Show patient profile">
            <Button
              icon={<UserOutlined />}
              onClick={() => handleShowProfile(record.patient_id)}
              type={
                selectedPatientId === record.patient_id ? "primary" : "default"
              }
              loading={loadingPatientId === record.patient_id}
              size="small"
            />
          </Tooltip>

          <Tooltip title="Write prescription">
            <Button
              icon={<FileTextOutlined />}
              onClick={() => handleWritePrescription(record)}
              size="small"
              loading={prescriptionIconLoading}
              disabled={prescriptionIconLoading}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", gap: 24, flexDirection: "column" }}>
        <Card style={{ marginBottom: "24px" }}>
          <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
            Today's Appointments
          </Title>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={filteredAppointments}
              rowKey="id"
              pagination={false}
              size="middle"
              style={{ marginTop: 24 }}
            />
          </Spin>
          {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
        </Card>

        <div
          style={{
            transition: "all 0.3s ease-in-out",
            transform: isDetailsVisible ? "scale(1)" : "scale(0)",
            opacity: isDetailsVisible ? 1 : 0,
            maxHeight: isDetailsVisible ? "1000px" : "0",
            overflow: "hidden",
          }}
        >
          <PatientDetails
            profile={patientProfile}
            onClose={handleCloseDetails}
            isVisible={isDetailsVisible}
            loading={profileLoading}
          />
        </div>
      </div>

      <Prescription
        visible={prescriptionVisible}
        onClose={handleClosePrescription}
        patientId={selectedPatientForPrescription?.id}
        patientName={selectedPatientForPrescription?.name}
        appointmentId={selectedPatientForPrescription?.appointment_id}
      />
    </div>
  );
}

export default TodaysAppointments;
