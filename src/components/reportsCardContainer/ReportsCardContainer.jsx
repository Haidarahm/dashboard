// src/components/ReportsCardAntd.jsx
import React, { useState, useEffect } from "react";
import { Card, Pagination, Typography, Spin, Empty } from "antd";
import useReportsStore from "../../store/admin/reportsStore";

const { Text } = Typography;

const ReportsCardContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { reports, total, loading, fetchReports, error } = useReportsStore();

  useEffect(() => {
    fetchReports(pageSize, currentPage);
  }, [fetchReports, pageSize, currentPage]);

  const renderContent = () => {
    if (loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <Spin size="large" />
        </div>
      );
    }

    if (error) {
      return (
        <div
          style={{
            color: "#ff4d4f",
            textAlign: "center",
            padding: "40px 20px",
            backgroundColor: "#fff2f0",
            borderRadius: "6px",
            border: "1px solid #ffccc7",
          }}
        >
          <Text type="danger">{error}</Text>
        </div>
      );
    }

    if (reports.length === 0) {
      return (
        <Empty
          description="No reports found"
          style={{ padding: "40px 20px" }}
        />
      );
    }

    return (
      <div
        className="flex flex-1"
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        {reports.map((report) => (
          <Card
            key={report.id}
            size="small"
            type="inner"
            style={{
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
              transition: "all 0.2s ease",
            }}
            bodyStyle={{ padding: "16px" }}
            title={
              <Text strong style={{ fontSize: "14px", color: "#1890ff" }}>
                {report.type}
              </Text>
            }
          >
            <div style={{ marginBottom: "8px" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Patient: {report.patient_first_name} {report.patient_last_name}
              </Text>
            </div>
            <Text style={{ fontSize: "13px", lineHeight: "1.5" }}>
              {report.description}
            </Text>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card
      title={
        <Text strong style={{ fontSize: "16px", color: "#262626" }}>
          Reports
        </Text>
      }
      style={{
        width: "100%",
        height: "443px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e8e8e8",
      }}
      bodyStyle={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
      bordered={false}
    >
      {/* Content Area */}
      <div
        style={{
          flex: 1,
          maxHeight: 290,
          overflowY: "auto",
          marginBottom: "16px",
          paddingRight: "4px", // Space for scrollbar
        }}
      >
        {renderContent()}
      </div>

      {/* Pagination - Only show if there are reports and no loading/error */}
      {!loading && !error && reports.length > 0 && (
        <div
          style={{
            borderTop: "1px solid #f0f0f0",
            paddingTop: "16px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            size="small"
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showQuickJumper={false}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} reports`
            }
          />
        </div>
      )}
    </Card>
  );
};

export default ReportsCardContainer;
