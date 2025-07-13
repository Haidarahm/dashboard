import React, { useEffect } from "react";
import { useReviewsStore } from "../../../store/admin/reviewsStore"; // Update the path
import { Table, Tag, Rate, Button, message, Spin, Alert, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ReviewsTable = ({ doctor_id }) => {
  const { reviews, loading, error, fetchReviews, deleteReviewById } = useReviewsStore();

  useEffect(() => {
    fetchReviews(doctor_id);
  }, [doctor_id, fetchReviews]);

  const handleDelete = async (reviewId) => {
    try {
      await deleteReviewById(reviewId);
      message.success("Review deleted successfully");
    } catch (err) {
      message.error("Failed to delete review");
    }
  };

  const columns = [
    {
      title: "Patient ID",
      dataIndex: "patient_id",
      key: "patient_id",
    },
    {
      title: "Rating",
      dataIndex: ["review", "rate"],
      key: "rating",
      render: (rate) => <Rate disabled defaultValue={rate} />,
    },
    {
      title: "Comment",
      dataIndex: ["review", "comment"],
      key: "comment",
      render: (text) => <Text>{text || "No comment"}</Text>,
    },
    {
      title: "Date",
      dataIndex: ["review", "created_at"],
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        />
      ),
    },
  ];

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <Spin spinning={loading}>
      <Table
        columns={columns}
        dataSource={reviews}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          hideOnSinglePage: true,
        }}
      />
    </Spin>
  );
};

export default ReviewsTable;