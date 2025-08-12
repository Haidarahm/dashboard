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
} from "antd";
import dayjs from "dayjs";
import useCheckupStore from "../../../store/doctor/checkupStore";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

function CheckUp({ open, onClose, patientId, appointmentId }) {
  const [selectedDateIso, setSelectedDateIso] = useState(null); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState(null);

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

  useEffect(() => {
    if (open) {
      setSelectedDateIso(null);
      setSelectedTime(null);
      clearTimes();
      showDoctorWorkDaysAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
    if (!patientId || !appointmentId || !selectedDateIso || !selectedTime)
      return;
    // Send date as DD/MM/YY e.g., 20/07/25
    const dateShort = dayjs(selectedDateIso).format("DD/MM/YY");
    const res = await addCheckupAction({
      patient_id: patientId,
      date: dateShort,
      time: selectedTime,
      this_appointment_id: appointmentId,
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
          <Text type="secondary">Select a time</Text>
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
                        ? "No times loaded yet."
                        : "Pick an available date first."}
                    </Text>
                  )}
                </Space>
                {selectedTime && (
                  <div>
                    <Button
                      type="primary"
                      onClick={handleConfirmCheckup}
                      loading={addingCheckup}
                    >
                      Confirm checkup
                    </Button>
                  </div>
                )}
              </Space>
            </Spin>
          </div>
        </div>
      </Space>
    </Modal>
  );
}

export default CheckUp;
