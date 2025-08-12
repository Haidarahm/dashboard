import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Select,
  Table,
  Tag,
  Space,
  Typography,
  Spin,
  Button,
} from "antd";
import useAnalyzeStore from "../../../store/doctor/analyzeStore";

const { Title, Text } = Typography;

function Analysis({ open, onClose, patientId }) {
  const [status, setStatus] = useState(null);
  const [clinicId, setClinicId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [analysisResponse, setAnalysisResponse] = useState(null);

  const {
    showPatientAnalysisAction,
    showPatientAnalysisByClinicAction,
    showClinicsAction,
    showAllAnalysisAction,
    clinics,
    clinicsLoading,
    patientAnalysisLoading,
    clinicAnalysisLoading,
    allAnalysisLoading,
  } = useAnalyzeStore();

  const loading =
    patientAnalysisLoading || clinicAnalysisLoading || allAnalysisLoading;

  useEffect(() => {
    if (!open || !patientId) return;
    // Load clinics for filter dropdown
    showClinicsAction();
  }, [open, patientId, showClinicsAction]);

  const fetchData = async () => {
    if (!patientId) return;

    // If no filters are applied, use showAllAnalysisAction
    if (!status && !clinicId) {
      const response = await showAllAnalysisAction(patientId);
      if (response) setAnalysisResponse(response);
      return;
    }

    const payloadBase = { patient_id: patientId, page, per_page: pageSize };

    // If clinic is selected, filter by clinic (prioritize clinic over status)
    if (clinicId && clinicId !== "all") {
      const response = await showPatientAnalysisByClinicAction({
        ...payloadBase,
        clinic_id: clinicId,
      });
      if (response) setAnalysisResponse(response);
      return;
    }

    // If only status is selected, filter by status
    if (status) {
      const response = await showPatientAnalysisAction({
        ...payloadBase,
        status,
      });
      if (response) setAnalysisResponse(response);
    }
  };

  const handleRefresh = () => {
    setStatus(null);
    setClinicId(null);
    setPage(1);
    fetchData();
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    setClinicId(null); // Clear clinic filter when status is selected
    setPage(1);
  };

  const handleClinicChange = (val) => {
    const next = val ?? null;
    setClinicId(next);
    setStatus(null); // Clear status filter when clinic is selected
    setPage(1);
  };

  useEffect(() => {
    if (!open) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, status, clinicId, page, pageSize, patientId]);

  const dataSource = useMemo(
    () => analysisResponse?.data || [],
    [analysisResponse]
  );
  const meta = analysisResponse?.meta || {
    current_page: 1,
    per_page: pageSize,
    total: 0,
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <Text ellipsis={{ tooltip: text }}>{text || "-"}</Text>,
    },
    {
      title: "Result File",
      dataIndex: "result_file",
      key: "result_file",
      render: (val) =>
        val ? (
          <a href={val} target="_blank" rel="noreferrer">
            Open
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Result Photo",
      dataIndex: "result_photo",
      key: "result_photo",
      render: (val) =>
        val ? (
          <a href={val} target="_blank" rel="noreferrer">
            Open
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => (
        <Tag color={s === "finished" ? "green" : "orange"}>{s || "-"}</Tag>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleClose = () => {
    setClinicId(null);
    setStatus(null);
    setPage(1);
    setPageSize(10);
    setAnalysisResponse(null);
    onClose?.();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={900}
      title={
        <Space direction="vertical" style={{ width: "100%" }}>
          <Title level={4} style={{ margin: 0 }}>
            Patient Analysis
          </Title>
          <Space wrap>
            <Space>
              <Text type="secondary">Status:</Text>
              <Select
                value={status}
                onChange={handleStatusChange}
                placeholder="Select status"
                allowClear
                options={[
                  { label: "Pending", value: "pending" },
                  { label: "Finished", value: "finished" },
                ]}
                style={{ width: 140 }}
              />
            </Space>
            <Space>
              <Text type="secondary">Clinic:</Text>
              <Select
                allowClear
                placeholder="All clinics"
                value={clinicId ?? undefined}
                onChange={handleClinicChange}
                loading={clinicsLoading}
                options={(clinics || []).map((c) => ({
                  label: c.name,
                  value: c.id,
                }))}
                style={{ width: 200 }}
              />
              <Button onClick={handleRefresh} disabled={loading}>
                Refresh
              </Button>
            </Space>
          </Space>
        </Space>
      }
    >
      <Spin spinning={loading}>
        <Table
          rowKey={(r, idx) => r.id ?? `${r.name}-${idx}`}
          columns={columns}
          dataSource={dataSource}
          pagination={{
            current: meta.current_page || page,
            pageSize: meta.per_page || pageSize,
            total: meta.total || 0,
            showSizeChanger: true,
            showTotal: (t, range) => `${range[0]}-${range[1]} of ${t} analyses`,
          }}
          onChange={handleTableChange}
        />
      </Spin>
    </Modal>
  );
}

export default Analysis;
