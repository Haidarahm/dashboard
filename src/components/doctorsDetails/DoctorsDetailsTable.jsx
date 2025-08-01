import React, { useEffect, useState } from "react";
import { Table, Avatar, Typography, Spin, Card, Statistic } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDoctorsTableStore } from "../../store/admin/doctorsStore";
import { showPaymentDetailsByDoctor } from "../../api/admin/payments";
// Pie chart removed

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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  return (
    <div
      style={{
        display: "flex",

        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <Statistic
        title="Total Revenue"
        value={data.totalRevenue}
        precision={0}
        formatter={(value) => formatCurrency(value)}
        valueStyle={{
          fontSize: 18,
          fontWeight: 600,
          color: "#3B82F6",
        }}
      />
      <Statistic
        title="Appointments"
        value={data.totalAppointments}
        formatter={(value) => formatNumber(value)}
        valueStyle={{
          fontSize: 16,
          color: "#22C55E",
        }}
      />
      <Statistic
        title="Avg Payment"
        value={data.averagePayment}
        precision={0}
        formatter={(value) => formatCurrency(value)}
        valueStyle={{
          fontSize: 16,
          color: "#F59E0B",
        }}
      />
    </div>
  );
};

const DoctorsDetailsTable = () => {
  const { doctors, meta, loading, fetchDoctors } = useDoctorsTableStore();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchDoctors(page, 5);
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
          style={{
            backgroundColor: photo ? "transparent" : "#1890ff",
            border: "1px solid #f0f0f0",
          }}
        />
      ),
    },
    {
      title: "Doctor Name",
      dataIndex: "first_name",
      key: "name",
      render: (_, record) => (
        <span
          style={{
            fontWeight: 500,
            color: "#1890ff",
            fontSize: 15,
          }}
        >
          {record.first_name}
        </span>
      ),
    },
    {
      title: "Payment Stats",
      key: "payments",
      width: 280,
      render: (_, record) => <PaymentChart doctorId={record.id} />,
    },
  ];

  return (
    <Card
      title={
        <span
          style={{
            fontSize: 18,
            color: "#262626",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Doctors Payment Statistics
        </span>
      }
      style={{
        width: "100%",
        height: "443px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        border: "1px solid #e8e8e8",
      }}
      bodyStyle={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        scrollbarWidth:"thin",
       
        overflow: "auto",
      }}
      
      bordered={false}
    >
      <Table
        columns={columns}
        dataSource={doctors}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 5,
          total: meta.total,
          onChange: setPage,
          showSizeChanger: false,
          hideOnSinglePage: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} doctors`,
          style: {
            marginBottom: 0,
            padding: "0 16px",
            fontSize: 14,
          },
        }}
        size="middle"
        style={{
          flex: 1,
          border: "1px solid #f0f0f0",
          borderRadius: "8px",
          fontSize: 14,
        }}
      
        bordered={false}
        showHeader={true}
        rowClassName={() => "doctor-table-row"}
      />
    </Card>
  );
};

export default DoctorsDetailsTable;
