import React from "react";
import { Card, Typography, Tag, Spin, Divider, List, Descriptions } from "antd";
import {
  CloseOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Results = ({ results, onClose, isVisible, loading }) => {
  if (!results && !loading) {
    return (
      <Card
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease-in-out",
          transform: isVisible ? "scale(1)" : "scale(0)",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <Title level={4} type="secondary">
          Select an appointment to view results
        </Title>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease-in-out",
          transform: isVisible ? "scale(1)" : "scale(0)",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Title level={4} type="secondary">
              Loading results...
            </Title>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      style={{
        height: "100%",
        transition: "all 0.3s ease-in-out",
        transform: isVisible ? "scale(1)" : "scale(0)",
        opacity: isVisible ? 1 : 0,
        position: "relative",
        overflow: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Title level={3} style={{ color: "#1890ff", margin: 0 }}>
          Appointment Results
        </Title>
        <button
          type="text"
          onClick={onClose}
          style={{
            border: "none",
            padding: "4px",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease-in-out",
            background: "transparent",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f0f0f0";
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.transform = "scale(1)";
          }}
        >
          <CloseOutlined />
        </button>
      </div>

      {results && (
        <div style={{ padding: "16px 0" }}>
          {/* Medical Information Section */}
          <Card
            size="small"
            title={
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <FileTextOutlined style={{ color: "#1890ff" }} />
                <Text strong>Medical Information</Text>
              </div>
            }
            style={{ marginBottom: "16px" }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Symptoms">
                <Text>{results.medicalInfo?.symptoms || "Not specified"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Diagnosis">
                <Text>{results.medicalInfo?.diagnosis || "Not specified"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Note for Doctor">
                <Text>
                  {results.medicalInfo?.["note for the doctor"] ||
                    "Not specified"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Note for Patient">
                <Text>
                  {results.medicalInfo?.["note for the patient"] ||
                    "Not specified"}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Divider />

          {/* Prescription Section */}
          <Card
            size="small"
            title={
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <MedicineBoxOutlined style={{ color: "#52c41a" }} />
                <Text strong>Prescription</Text>
              </div>
            }
            style={{ marginBottom: "16px" }}
          >
            {results.prescription?.note && (
              <div style={{ marginBottom: "16px" }}>
                <Text strong>Prescription Note:</Text>
                <br />
                <Text>{results.prescription.note}</Text>
              </div>
            )}

            {results.prescription?.medicines?.data &&
            results.prescription.medicines.data.length > 0 ? (
              <div>
                <Text strong style={{ display: "block", marginBottom: "12px" }}>
                  Medicines ({results.prescription.medicines.data.length})
                </Text>
                <List
                  dataSource={results.prescription.medicines.data}
                  renderItem={(medicine, index) => (
                    <List.Item
                      style={{
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        padding: "12px",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <div style={{ width: "100%" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "8px",
                          }}
                        >
                          <Text strong style={{ fontSize: "16px" }}>
                            {medicine.name}
                          </Text>
                          <Tag color="blue">{medicine.strength}</Tag>
                        </div>

                        <Descriptions
                          column={2}
                          size="small"
                          style={{ marginBottom: "8px" }}
                        >
                          <Descriptions.Item label="Dose">
                            <Text>{medicine.dose}</Text>
                          </Descriptions.Item>
                          <Descriptions.Item label="Frequency">
                            <Text>{medicine.frequency}</Text>
                          </Descriptions.Item>
                          <Descriptions.Item label="When to Take">
                            <Text>{medicine.whenToTake}</Text>
                          </Descriptions.Item>
                          <Descriptions.Item label="Until">
                            <Text>{medicine.until}</Text>
                          </Descriptions.Item>
                        </Descriptions>

                        {medicine.note && (
                          <div style={{ marginTop: "8px" }}>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              <strong>Note:</strong> {medicine.note}
                            </Text>
                          </div>
                        )}
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            ) : (
              <Text type="secondary">No medicines prescribed</Text>
            )}
          </Card>
        </div>
      )}
    </Card>
  );
};

export default Results;
