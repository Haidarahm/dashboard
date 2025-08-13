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

function Refferal({ open, onClose, patientId, patientName }) {
  const [current, setCurrent] = useState(0);
  const [clinicId, setClinicId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [selectedDateIso, setSelectedDateIso] = useState(null); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState(null);

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
      showClinicsAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
    await showReferralDoctorWorkDaysAction(doctorId);
    setCurrent(2);
  };

  const nextFromDate = async () => {
    if (!selectedDateIso || !doctorId) return;
    const dateShort = dayjs(selectedDateIso).format("DD/MM/YY");
    await showReferralTimesAction(doctorId, dateShort);
    setCurrent(3);
  };

  const nextFromTime = () => {
    if (!selectedTime) return;
    setCurrent(4);
  };

  const confirmReferral = async () => {
    if (!patientId || !doctorId || !selectedDateIso || !selectedTime) return;
    const dateShort = dayjs(selectedDateIso).format("DD/MM/YY");
    const res = await addReferralReservationAction({
      patient_id: patientId,
      doctor_id: doctorId,
      date: dateShort,
      time: selectedTime,
    });
    if (res) {
      toast.success("Referral reservation added");
      onClose?.();
    }
  };

  const steps = [
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
    {
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
    },
    {
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
    },
  ];

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
        <Steps
          current={current}
          items={steps.map((s) => ({ title: s.title }))}
        />
        <div>{steps[current].content}</div>
      </Space>
    </Modal>
  );
}

export default Refferal;
