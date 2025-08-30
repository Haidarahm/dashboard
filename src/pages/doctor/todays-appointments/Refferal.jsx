import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Steps,
  Select,
  Typography,
  Space,
  Button,
  Calendar,
  Spin,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import useReferredStore from "../../../store/doctor/referredStore";

const { Title, Text } = Typography;
const { Option } = Select;

function Refferal({ open, onClose, patientId, patientName, isChild }) {
  const [current, setCurrent] = useState(0);
  const [clinicId, setClinicId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [selectedDateIso, setSelectedDateIso] = useState(null); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentType, setAppointmentType] = useState("visit");
  const [selectedDoctorBookingType, setSelectedDoctorBookingType] =
    useState(null);

  const {
    clinics,
    clinicDoctors,
    doctorWorkDays,
    referralTimes,
    loadingClinics,
    loadingClinicDoctors,
    loadingWorkDays,
    loadingReferralTimes,
    addingReferralReservation,
    showClinicsAction,
    showClinicDoctorsAction,
    showReferralDoctorWorkDaysAction,
    showReferralTimesAction,
    addReferralReservationAction,
  } = useReferredStore();

  useEffect(() => {
    if (open) {
      setCurrent(0);
      setClinicId(null);
      setDoctorId(null);
      setSelectedDateIso(null);
      setSelectedTime(null);
      setAppointmentType("visit");
      setSelectedDoctorBookingType(null);
      showClinicsAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Debug current step changes
  useEffect(() => {
    console.log("Current step changed to:", current);
  }, [current]);

  const availableDates = useMemo(() => {
    if (!doctorWorkDays) return new Set();
    const list = Array.isArray(doctorWorkDays)
      ? doctorWorkDays
      : doctorWorkDays.available_dates || [];
    return new Set(list);
  }, [doctorWorkDays]);

  const selectedDoctorName = useMemo(() => {
    const d = (clinicDoctors || []).find((doc) => doc?.id === doctorId);
    if (!d) return null;
    return `${d.first_name || ""} ${d.last_name || ""}`.trim();
  }, [clinicDoctors, doctorId]);

  const dateFullCellRender = (value) => {
    const iso = value.format("YYYY-MM-DD");
    const available = availableDates.has(iso);
    const isSelected = selectedDateIso === iso;
    return (
      <div
        style={{
          height: 36,
          lineHeight: "36px",
          textAlign: "center",
          borderRadius: 6,
          cursor: available ? "pointer" : "not-allowed",
          background: isSelected
            ? available
              ? "#e6f7ff"
              : undefined
            : undefined,
          border: isSelected ? "1px solid #1890ff" : "1px solid transparent",
          color: available ? undefined : "#bfbfbf",
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (available) {
            const isoSel = value.format("YYYY-MM-DD");
            setSelectedDateIso(isoSel);
          }
        }}
      >
        {value.date()}
      </div>
    );
  };

  const nextFromClinic = async () => {
    if (!clinicId) return;
    await showClinicDoctorsAction(clinicId);
    setCurrent(1);
  };

  const nextFromDoctor = async () => {
    if (!doctorId) return;

    // Get the selected doctor's booking type
    const selectedDoctor = clinicDoctors.find((doc) => doc.id === doctorId);
    if (selectedDoctor) {
      setSelectedDoctorBookingType(selectedDoctor.booking_type);
    }

    await showReferralDoctorWorkDaysAction(doctorId);
    setCurrent(2);
  };

  const nextFromDate = async () => {
    if (!selectedDateIso || !doctorId) return;

    console.log("nextFromDate - booking type:", selectedDoctorBookingType);

    // Check booking type to determine next step
    if (selectedDoctorBookingType === "auto") {
      // For auto booking: skip time selection, go directly to review
      console.log("Auto booking - going to review step (index 3)");
      setCurrent(3); // Review step is at index 3 for auto booking
    } else {
      // For manual booking: show time selection
      console.log("Manual booking - going to time step (index 3)");
      const dateShort = dayjs(selectedDateIso).format("DD/MM/YY");
      await showReferralTimesAction(doctorId, dateShort);
      setCurrent(3); // Time step is at index 3 for manual booking
    }
  };

  const nextFromTime = () => {
    if (!selectedTime) return;
    setCurrent(4); // Review step is at index 4 for manual booking (after time step at index 3)
  };

  const confirmReferral = async () => {
    if (!patientId || !doctorId || !selectedDateIso) return;

    // For manual booking, require time selection
    if (selectedDoctorBookingType === "manual" && !selectedTime) {
      toast.error("Time selection is required for manual booking");
      return;
    }

    const dateShort = dayjs(selectedDateIso).format("DD/MM/YY");
    const res = await addReferralReservationAction({
      patient_id: patientId,
      doctor_id: doctorId,
      date: dateShort,
      time: selectedTime || null, // Time is optional for auto booking
      appointment_type: isChild ? appointmentType : "visit",
    });
    if (res) {
      toast.success("Referral reservation added");
      onClose?.();
    }
  };

  // Create steps dynamically based on booking type
  const steps = useMemo(() => {
    console.log("Creating steps, booking type:", selectedDoctorBookingType);

    // Always start with these 3 steps
    const baseSteps = [
      {
        title: "Clinic",
        content: (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text type="secondary">Select a clinic</Text>
            <Select
              showSearch
              placeholder="Choose clinic"
              value={clinicId ?? undefined}
              onChange={setClinicId}
              loading={loadingClinics}
              options={(clinics || []).map((c) => ({
                label: c.name,
                value: c.id,
              }))}
              style={{ width: 320 }}
            />
            <Button
              type="primary"
              onClick={nextFromClinic}
              disabled={!clinicId}
              loading={loadingClinicDoctors}
            >
              Next
            </Button>
          </Space>
        ),
      },
      {
        title: "Doctor",
        content: (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text type="secondary">Select a doctor</Text>
            <Select
              showSearch
              placeholder="Choose doctor"
              value={doctorId ?? undefined}
              onChange={setDoctorId}
              loading={loadingClinicDoctors}
              options={(clinicDoctors || []).map((d) => ({
                label: `${d.first_name || ""} ${d.last_name || ""}`.trim(),
                value: d.id,
              }))}
              style={{ width: 320 }}
            />
            <Space>
              <Button onClick={() => setCurrent(0)}>Back</Button>
              <Button
                type="primary"
                onClick={nextFromDoctor}
                disabled={!doctorId}
                loading={loadingWorkDays}
              >
                Next
              </Button>
            </Space>
          </Space>
        ),
      },
      {
        title: "Date",
        content: (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text type="secondary">Select a date</Text>
            <Spin spinning={loadingWorkDays}>
              <Calendar
                fullscreen={false}
                dateFullCellRender={dateFullCellRender}
              />
            </Spin>
            <Tag color="blue">
              Available dates are highlighted. Others are disabled.
            </Tag>
            <Space>
              <Button onClick={() => setCurrent(1)}>Back</Button>
              <Button
                type="primary"
                onClick={nextFromDate}
                disabled={!selectedDateIso}
                loading={loadingReferralTimes}
              >
                Next
              </Button>
            </Space>
          </Space>
        ),
      },
    ];

    // For auto booking: add review step directly after date
    if (selectedDoctorBookingType === "auto") {
      baseSteps.push({
        title: "Review",
        content: (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={5} style={{ margin: 0 }}>
              Confirm referral
            </Title>
            <div>
              <div>
                <Text strong>Patient:</Text>{" "}
                <Text>{patientName || patientId}</Text>
              </div>
              <div>
                <Text strong>Doctor:</Text>{" "}
                <Text>{selectedDoctorName || doctorId}</Text>
              </div>
              <div>
                <Text strong>Date:</Text>{" "}
                <Text>{dayjs(selectedDateIso).format("YYYY-MM-DD")}</Text>
              </div>
              <div>
                <Text strong>Appointment type:</Text>{" "}
                <Text>{isChild ? appointmentType : "visit"}</Text>
              </div>
            </div>
            <Space>
              <Button onClick={() => setCurrent(2)}>Back</Button>
              <Button
                type="primary"
                onClick={confirmReferral}
                loading={addingReferralReservation}
              >
                Confirm referral
              </Button>
            </Space>
          </Space>
        ),
      });
    } else {
      // For manual booking: add time step, then review step
      baseSteps.push({
        title: "Time",
        content: (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text type="secondary">Select a time</Text>
            <Spin spinning={loadingReferralTimes}>
              <Space wrap>
                {(Array.isArray(referralTimes)
                  ? referralTimes
                  : referralTimes?.data || []
                ).map((t) => (
                  <Button
                    key={t}
                    type={selectedTime === t ? "primary" : "default"}
                    onClick={() => setSelectedTime(t)}
                  >
                    {t}
                  </Button>
                ))}
                {!referralTimes?.length && (
                  <Text type="secondary">No times loaded yet.</Text>
                )}
              </Space>
            </Spin>
            <Space>
              <Button onClick={() => setCurrent(2)}>Back</Button>
              <Button
                type="primary"
                onClick={nextFromTime}
                disabled={!selectedTime}
              >
                Next
              </Button>
            </Space>
          </Space>
        ),
      });

      // Add review step for manual booking
      baseSteps.push({
        title: "Review",
        content: (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={5} style={{ margin: 0 }}>
              Confirm referral
            </Title>
            <div>
              <div>
                <Text strong>Patient:</Text>{" "}
                <Text>{patientName || patientId}</Text>
              </div>
              <div>
                <Text strong>Doctor:</Text>{" "}
                <Text>{selectedDoctorName || doctorId}</Text>
              </div>
              <div>
                <Text strong>Date:</Text>{" "}
                <Text>{dayjs(selectedDateIso).format("YYYY-MM-DD")}</Text>
              </div>
              <div>
                <Text strong>Time:</Text> <Text>{selectedTime}</Text>
              </div>
              <div>
                <Text strong>Appointment type:</Text>{" "}
                <Text>{isChild ? appointmentType : "visit"}</Text>
              </div>
            </div>
            <Space>
              <Button onClick={() => setCurrent(3)}>Back</Button>
              <Button
                type="primary"
                onClick={confirmReferral}
                loading={addingReferralReservation}
              >
                Confirm referral
              </Button>
            </Space>
          </Space>
        ),
      });
    }

    console.log(
      "Final steps array:",
      baseSteps.map((s, i) => `${i}: ${s.title}`)
    );
    return baseSteps;
  }, [
    clinicId,
    doctorId,
    selectedDateIso,
    selectedTime,
    selectedDoctorBookingType,
    referralTimes,
    loadingClinics,
    loadingClinicDoctors,
    loadingWorkDays,
    loadingReferralTimes,
    addingReferralReservation,
    clinics,
    clinicDoctors,
    patientName,
    patientId,
    isChild,
    appointmentType,
  ]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      title={
        <Title level={4} style={{ margin: 0 }}>
          Refer patient
        </Title>
      }
    >
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        {/* Appointment type selection for child appointments */}
        {isChild ? (
          <div>
            <Text type="secondary">Appointment type</Text>
            <div style={{ marginTop: 8 }}>
              <Select
                value={appointmentType}
                onChange={setAppointmentType}
                style={{ width: 240 }}
              >
                <Option value="vaccination">Vaccination</Option>
                <Option value="visit">Visit</Option>
              </Select>
            </div>
          </div>
        ) : null}

        <Steps
          current={current}
          items={steps.map((s) => ({ title: s.title }))}
        />
        <div>
          {steps[current] && steps[current].content ? (
            steps[current].content
          ) : (
            <div>
              Step not found. Current: {current}, Total steps: {steps.length}
            </div>
          )}
        </div>
      </Space>
    </Modal>
  );
}

export default Refferal;
