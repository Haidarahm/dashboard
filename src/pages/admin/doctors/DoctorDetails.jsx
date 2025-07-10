import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag, Avatar, Descriptions, Spin } from "antd";
import {
  Mail,
  Phone,
  User,
  Clock,
  DollarSign,
  Star,
  CheckCircle2,
  XCircle,
  IdCard,
  Stethoscope,
  Award,
  Users,
} from "lucide-react";
import { getClinicById } from "../../../api/admin/clinics";

const statusMap = {
  available: {
    color: "green",
    text: "Available",
    icon: <CheckCircle2 size={18} color="#22c55e" />,
  },
  notAvailable: {
    color: "red",
    text: "Not Available",
    icon: <XCircle size={18} color="#ef4444" />,
  },
  busy: {
    color: "orange",
    text: "Busy",
    icon: <Clock size={18} color="#f59e42" />,
  },
};

const labelStyle = {
  fontWeight: 600,
  color: "#444",
  display: "flex",
  alignItems: "center",
  gap: 8,
};
const contentStyle = { color: "#222", fontSize: 15 };

const DoctorDetails = ({ doctor }) => {
  const [clinicName, setClinicName] = useState("");
  const [clinicLoading, setClinicLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (doctor && doctor.clinic_id) {
      setClinicLoading(true);
      getClinicById(doctor.clinic_id)
        .then((data) => {
          if (isMounted) setClinicName(data?.name || "");
        })
        .catch(() => {
          if (isMounted) setClinicName("");
        })
        .finally(() => {
          if (isMounted) setClinicLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [doctor]);

  if (!doctor) return null;
  const status = statusMap[doctor.status] || {
    color: "default",
    text: doctor.status,
    icon: <Clock size={18} color="#64748b" />,
  };

  return (
    <Card
      bordered={false}
      style={{
        boxShadow: "0 2px 16px #e6eaf1",
        borderRadius: 18,
        background: "linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)",
        padding: 0,
      }}
      bodyStyle={{ padding: 0 }}
    >
      <Row gutter={[32, 0]} align="middle">
        <Col xs={24} sm={8} style={{ textAlign: "center", padding: 32 }}>
          <Avatar
            size={100}
            src={doctor.photo}
            icon={<User size={40} />}
            style={{
              backgroundColor: doctor.photo ? "#fff" : "#3b82f6",
              marginBottom: 18,
            }}
          />
          <div
            style={{
              fontWeight: 700,
              fontSize: 22,
              marginBottom: 6,
              color: "#222",
            }}
          >
            {doctor.first_name} {doctor.last_name}
          </div>
          <div style={{ color: "#64748b", fontSize: 15, marginBottom: 10 }}>
            {doctor.professional_title || (
              <span style={{ color: "#cbd5e1" }}>No title</span>
            )}
          </div>
          <Tag
            color={status.color}
            icon={status.icon}
            style={{ fontSize: 15, padding: "3px 16px", borderRadius: 8 }}
          >
            {status.text}
          </Tag>
        </Col>
        <Col
          xs={24}
          sm={16}
          style={{
            background: "#fff",
            borderTopRightRadius: 18,
            borderBottomRightRadius: 18,
            padding: 32,
          }}
        >
          <Descriptions
            column={1}
            size="middle"
            labelStyle={labelStyle}
            contentStyle={contentStyle}
            bordered={false}
          >
            <Descriptions.Item
              label={
                <>
                  <Mail size={16} color="#2563eb" /> Email
                </>
              }
            >
              {doctor.email}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <Phone size={16} color="#10b981" /> Phone
                </>
              }
            >
              {doctor.phone}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <IdCard size={16} color="#6366f1" /> Clinic
                </>
              }
            >
              {clinicLoading ? <Spin size="small" /> : clinicName}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <Stethoscope size={16} color="#f59e42" /> Speciality
                </>
              }
            >
              {doctor.speciality || (
                <span style={{ color: "#cbd5e1" }}>Not specified</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <Award size={16} color="#fbbf24" /> Experience
                </>
              }
            >
              {doctor.experience ? (
                `${doctor.experience} years`
              ) : (
                <span style={{ color: "#cbd5e1" }}>Not specified</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <Clock size={16} color="#0ea5e9" /> Avg. Visit Duration
                </>
              }
            >
              {doctor.average_visit_duration || (
                <span style={{ color: "#cbd5e1" }}>Not specified</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <DollarSign size={16} color="#22c55e" /> Visit Fee
                </>
              }
            >
              {doctor.visit_fee !== null && doctor.visit_fee !== undefined ? (
                `$${doctor.visit_fee}`
              ) : (
                <span style={{ color: "#cbd5e1" }}>Not specified</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <Users size={16} color="#6366f1" /> Patients Treated
                </>
              }
            >
              {doctor.treated || 0}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <Star size={16} color="#f59e42" /> Rating
                </>
              }
            >
              {doctor.finalRate ? (
                `${doctor.finalRate}/5`
              ) : (
                <span style={{ color: "#cbd5e1" }}>No rating</span>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );
};

export default DoctorDetails;
