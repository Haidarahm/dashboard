import React from "react";
import { Card, Typography, Tag, Descriptions } from "antd";

const { Title } = Typography;

const PatientDetails = ({ profile }) => {
  if (!profile) {
    return (
      <Card
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Title level={4} type="secondary">
          Select a patient to view details
        </Title>
      </Card>
    );
  }

  return (
    <Card style={{ height: "100%" }}>
      <Title level={3} style={{ color: "#1890ff" }}>
        Patient Details
      </Title>
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
