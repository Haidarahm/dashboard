import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Calendar,
  Typography,
  Spin,
  Space,
  Button,
  Divider,
  Tag,
  message,
  Select,
} from "antd";
import dayjs from "dayjs";
import useCheckupStore from "../../../store/doctor/checkupStore";
import { useProfileStore } from "../../../store/doctor/profileStore";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { Option } = Select;

function CheckUp({ open, onClose, patientId, appointmentId }) {
  const [selectedDateIso, setSelectedDateIso] = useState(null); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentType, setAppointmentType] = useState("visit");

  const {
    workDays,
    times,
    loadingWorkDays,
    loadingTimes,
    addingCheckup,
    showDoctorWorkDaysAction,
    showTimesAction,
    addCheckupAction,
    clearTimes,
  } = useCheckupStore();

  const { profile, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (open) {
      setSelectedDateIso(null);
      setSelectedTime(null);
      setAppointmentType("visit");
      clearTimes();
      showDoctorWorkDaysAction();
      fetchProfile(); // Fetch doctor profile to get booking_type
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Check if confirm button should be enabled based on booking type
  const canConfirmCheckup = useMemo(() => {
    if (!selectedDateIso) return false;

    if (profile?.booking_type === "auto") {
      // For auto booking: only date is required
      return true;
    } else if (profile?.booking_type === "manual") {
      // For manual booking: both date and time are required
      return selectedDateIso && selectedTime;
    }

    // Default: require both date and time
    return selectedDateIso && selectedTime;
  }, [selectedDateIso, selectedTime, profile?.booking_type]);

  const availableDates = useMemo(() => {
    // API example: { available_dates: ["2025-08-12", ...] }
    if (!workDays) return new Set();
    const list = Array.isArray(workDays)
      ? workDays
      : workDays.available_dates || [];
    return new Set(list);
  }, [workDays]);

  const isAvailable = (date) =>
    availableDates.has(dayjs(date).format("YYYY-MM-DD"));

  const onSelectDate = async (dateObj) => {
    const iso = dayjs(dateObj).format("YYYY-MM-DD");
    if (!availableDates.has(iso)) return;
    setSelectedDateIso(iso);
    setSelectedTime(null);
    // showTimes expects DD/MM/YY like 20/07/25
    const dateShort = dayjs(dateObj).format("DD/MM/YY");
    await showTimesAction(dateShort);
  };

  const handleConfirmCheckup = async () => {
    if (!patientId || !appointmentId || !selectedDateIso) return;

    // For manual booking, require time selection
    if (profile?.booking_type === "manual" && !selectedTime) {
      toast.error("Time selection is required for manual booking");
      return;
    }

    // Send date as DD/MM/YY e.g., 20/07/25
    const dateShort = dayjs(selectedDateIso).format("DD/MM/YY");
    const res = await addCheckupAction({
      patient_id: patientId,
      date: dateShort,
      time: selectedTime || null,
      this_appointment_id: appointmentId,
      appointment_type: appointmentType,
    });
    if (res) {
      toast.success("Checkup added successfully");
      onClose?.();
    }
  };

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
          if (available) onSelectDate(value);
        }}
      >
        {value.date()}
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      title={
        <Title level={4} style={{ margin: 0 }}>
          Add Checkup
        </Title>
      }
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
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

        <Divider style={{ margin: "12px 0" }} />

        <div>
          <Text type="secondary">Select a date</Text>
          <div style={{ marginTop: 8 }}>
            <Spin spinning={loadingWorkDays}>
              <Calendar
                fullscreen={false}
                dateFullCellRender={dateFullCellRender}
              />
            </Spin>
          </div>
          <div style={{ marginTop: 8 }}>
            <Tag color="blue">
              Available dates are highlighted. Others are disabled.
            </Tag>
          </div>
        </div>

        <Divider style={{ margin: "12px 0" }} />

        <div>
          <Text type="secondary">
            Select a time{" "}
            {profile?.booking_type === "auto" ? "(not required)" : "(required)"}
          </Text>
          <div style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {profile?.booking_type === "auto"
                ? "Time selection is not required for auto booking. You can confirm the checkup with just a date."
                : "Time selection is required for manual booking. You must select both date and time."}
            </Text>
          </div>
          <div style={{ marginTop: 8 }}>
            <Spin spinning={loadingTimes || addingCheckup}>
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <Space wrap>
                  {(times || []).length ? (
                    (Array.isArray(times) ? times : times.data || []).map(
                      (t) => (
                        <Button
                          key={t}
                          type={selectedTime === t ? "primary" : "default"}
                          onClick={() => setSelectedTime(t)}
                        >
                          {t}
                        </Button>
                      )
                    )
                  ) : (
                    <Text type="secondary">
                      {selectedDateIso
                        ? profile?.booking_type === "auto"
                          ? "No times available for this date. You can still confirm the checkup without selecting a time."
                          : "No times available for this date. Time selection is required for manual booking."
                        : "Pick an available date first."}
                    </Text>
                  )}
                </Space>
              </Space>
            </Spin>
          </div>
        </div>

        {/* Confirm Button - Always visible when date is selected */}
        {selectedDateIso && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Button
              type="primary"
              size="large"
              onClick={handleConfirmCheckup}
              loading={addingCheckup}
              disabled={!canConfirmCheckup}
            >
              Confirm Checkup
            </Button>
            {selectedTime && (
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Time selected: {selectedTime}</Text>
              </div>
            )}
            {profile?.booking_type === "manual" && !selectedTime && (
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ color: "#ff4d4f" }}>
                  Time selection is required for manual booking
                </Text>
              </div>
            )}
          </div>
        )}
      </Space>
    </Modal>
  );
}

export default CheckUp;
