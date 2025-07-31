import React, { useEffect, useState } from "react";
import { Table, Avatar, Typography, Spin, Card, Statistic } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDoctorsTableStore } from "../../store/admin/doctorsStore";
import { showPaymentDetailsByDoctor } from "../../api/admin/payments";
import { Pie } from "@ant-design/charts";

const { Text } = Typography;

const PaymentChart = ({ doctorId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    showPaymentDetailsByDoctor(doctorId)
      .then((res) => {
        if (mounted) setData(res);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [doctorId]);

  if (loading) return <Spin size="small" />;
  if (!data) return <Text type="secondary">No data</Text>;

  const chartData = [
    {
      type: "Revenue",
      value: data.totalRevenue,
      color: "#3B82F6",
    },
    {
      type: "Appointments",
      value: data.totalAppointments,
      color: "#22C55E",
    },
    {
      type: "Avg Payment",
      value: data.averagePayment,
      color: "#F59E0B",
    },
  ];

  const config = {
    data: chartData,
    angleField: "value",
    colorField: "type",
    color: ["#3B82F6", "#22C55E", "#F59E0B"],
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: ({ value }) => `${value}`,
      style: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "bold",
      },
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "14px",
          fontWeight: "bold",
        },
        content: "",
      },
    },
  };

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <div style={{ width: 120, height: 120 }}>
        <Pie {...config} />
      </div>
      <div>
        <Statistic
          title="Total Revenue"
          value={data.totalRevenue}
          precision={2}
          valueStyle={{ fontSize: 16 }}
        />
        <Statistic
          title="Appointments"
          value={data.totalAppointments}
          valueStyle={{ fontSize: 16 }}
        />
        <Statistic
          title="Avg Payment"
          value={data.averagePayment}
          precision={2}
          valueStyle={{ fontSize: 16 }}
        />
      </div>
    </div>
  );
};

const DoctorsDetailsTable = () => {
  const { doctors, meta, loading, fetchDoctors } = useDoctorsTableStore();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchDoctors(page, 3);
  }, [fetchDoctors, page]);

  const columns = [
    {
      title: "Image",
      dataIndex: "photo",
      key: "photo",
      width: 80,
      render: (photo) => (
        <Avatar
          size={48}
          src={photo}
          icon={<UserOutlined />}
          style={{ backgroundColor: photo ? "transparent" : "#1890ff" }}
        />
      ),
    },
    {
      title: "Doctor Name",
      dataIndex: "first_name",
      key: "name",
      render: (_, record) => (
        <span style={{ fontWeight: 500, color: "#1890ff" }}>
          {record.first_name} {record.last_name}
        </span>
      ),
    },
    {
      title: "Payment Stats",
      key: "payments",
      width: 400,
      render: (_, record) => <PaymentChart doctorId={record.id} />,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={doctors}
      rowKey="id"
      loading={loading}
      pagination={{
        current: meta.current_page,
        pageSize: 3,
        total: meta.total,
        onChange: setPage,
        showSizeChanger: false,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} doctors`,
      }}
      bordered
      size="middle"
      style={{ marginTop: 16 }}
    />
  );
};

export default DoctorsDetailsTable;
