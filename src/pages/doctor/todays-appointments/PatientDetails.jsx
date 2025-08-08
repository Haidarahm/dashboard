import React from "react";
import { Card, Typography, Tag, Descriptions, Button, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const { Title } = Typography;

const PatientDetails = ({ profile, onClose, isVisible, loading }) => {
  if (!profile && !loading) {
    return (
      <Card
        style={{
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease-in-out",
          transform: isVisible ? "scale(1)" : "scale(0)",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <Title level={4} type="secondary">
          Select a patient to view details
        </Title>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card
        style={{
          height: "200px",
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
              Loading patient details...
            </Title>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      style={{
        transition: "all 0.3s ease-in-out",
        transform: isVisible ? "scale(1)" : "scale(0)",
        opacity: isVisible ? 1 : 0,
        position: "relative",
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
          Patient Details
        </Title>
        <Button
          type="text"
          icon={<CloseOutlined />}
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
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f0f0f0";
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.transform = "scale(1)";
          }}
        />
      </div>
      <Descriptions column={1} bordered size="middle">
        <Descriptions.Item label="ID">{profile.id}</Descriptions.Item>
        <Descriptions.Item label="Name">
          {profile.first_name} {profile.last_name}
        </Descriptions.Item>
        <Descriptions.Item label="Birth Date">
          {profile.birth_date || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Gender">
          <Tag color={profile.gender === "female" ? "magenta" : "blue"}>
            {profile.gender}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Blood Type">
          {profile.blood_type || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Address">
          {profile.address || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Is Child">
          {profile.is_child ? "Yes" : "No"}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default PatientDetails;
