import React from "react";
import {
  Modal,
  Card,
  Descriptions,
  Tag,
  Typography,
  Spin,
  Alert,
  Divider,
  Empty,
} from "antd";
import {
  FaBaby,
  FaCalendarAlt,
  FaRuler,
  FaWeight,
  FaCircle,
  FaStickyNote,
  FaExclamationTriangle,
  FaBabyCarriage,
  FaUserMd,
} from "react-icons/fa";

const { Text, Title } = Typography;

const ChildRecord = ({ visible, onCancel, childRecord, loading, error }) => {
  if (!visible) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFeedingTypeColor = (type) => {
    const colorMap = {
      natural: "green",
      formula: "blue",
      mixed: "orange",
    };
    return colorMap[type] || "default";
  };

  const getFeedingTypeLabel = (type) => {
    const labelMap = {
      natural: "Natural",
      formula: "Formula",
      mixed: "Mixed",
    };
    return labelMap[type] || type;
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FaBaby className="text-blue-500" />
          <span>Child Record Details</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
      className="my-8"
      bodyStyle={{ padding: "24px" }}
    >
      {loading ? (
        <div className="text-center py-8">
          <Spin size="large" />
          <div className="mt-2">
            <Text type="secondary">Loading record...</Text>
          </div>
        </div>
      ) : error ? (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      ) : childRecord ? (
        <div className="space-y-4">
          {/* Visit Dates */}
          <Card size="small" title="Visit Information">
            <Descriptions column={2} size="small">
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-green-500" />
                    Last Visit
                  </span>
                }
              >
                <Text strong>{formatDate(childRecord.last_visit_date)}</Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" />
                    Next Visit
                  </span>
                }
              >
                <Text strong>{formatDate(childRecord.next_visit_date)}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Growth Measurements */}
          <Card size="small" title="Growth Measurements">
            <Descriptions column={3} size="small">
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaRuler className="text-blue-500" />
                    Height
                  </span>
                }
              >
                <Text strong>{childRecord.height_cm} cm</Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaWeight className="text-green-500" />
                    Weight
                  </span>
                }
              >
                <Text strong>{childRecord.weight_kg} kg</Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaCircle className="text-purple-500" />
                    Head Circumference
                  </span>
                }
              >
                <Text strong>{childRecord.head_circumference_cm} cm</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Feeding Information */}
          <Card size="small" title="Feeding Information">
            <Descriptions column={1} size="small">
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaBabyCarriage className="text-orange-500" />
                    Feeding Type
                  </span>
                }
              >
                <Tag color={getFeedingTypeColor(childRecord.feeding_type)}>
                  {getFeedingTypeLabel(childRecord.feeding_type)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Allergies */}
          {childRecord.allergies && (
            <Card size="small" title="Allergies">
              <Descriptions column={1} size="small">
                <Descriptions.Item
                  label={
                    <span className="flex items-center gap-2">
                      <FaExclamationTriangle className="text-red-500" />
                      Known Allergies
                    </span>
                  }
                >
                  <Text>{childRecord.allergies}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}

          {/* Growth Notes */}
          {childRecord.growth_notes && (
            <Card size="small" title="Growth Notes">
              <Descriptions column={1} size="small">
                <Descriptions.Item
                  label={
                    <span className="flex items-center gap-2">
                      <FaStickyNote className="text-blue-500" />
                      Notes
                    </span>
                  }
                >
                  <Text>{childRecord.growth_notes}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}

          {/* Developmental Observations */}
          {childRecord.developmental_observations && (
            <Card size="small" title="Developmental Observations">
              <Descriptions column={1} size="small">
                <Descriptions.Item
                  label={
                    <span className="flex items-center gap-2">
                      <FaBaby className="text-green-500" />
                      Observations
                    </span>
                  }
                >
                  <Text>{childRecord.developmental_observations}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}

          {/* Doctor Notes */}
          {childRecord.doctor_notes && (
            <Card size="small" title="Doctor's Notes">
              <Descriptions column={1} size="small">
                <Descriptions.Item
                  label={
                    <span className="flex items-center gap-2">
                      <FaUserMd className="text-purple-500" />
                      Recommendations
                    </span>
                  }
                >
                  <Text>{childRecord.doctor_notes}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}

          {/* Timestamps */}
          <Card size="small" title="Record Information">
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Created">
                <Text type="secondary">
                  {formatDate(childRecord.created_at)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                <Text type="secondary">
                  {formatDate(childRecord.updated_at)}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      ) : (
        <Empty description="No record data available" />
      )}
    </Modal>
  );
};

export default ChildRecord;
