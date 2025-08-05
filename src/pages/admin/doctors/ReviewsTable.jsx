import React, { useEffect, useState } from "react";
import { useReviewsStore } from "../../../store/admin/reviewsStore";
import { Table, Tag, Rate, Button, Spin, Alert, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const { Text } = Typography;

const ReviewsTable = ({ doctor_id }) => {
  const { reviews, loading, error, fetchReviews, deleteReviewById, total } =
    useReviewsStore();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page on doctor change
  }, [doctor_id]);

  useEffect(() => {
    fetchReviews(doctor_id, pagination.current, pagination.pageSize);
  }, [doctor_id, fetchReviews, pagination.current, pagination.pageSize]);

  const handleDelete = async (reviewId) => {
    try {
      await deleteReviewById(reviewId);
      toast.success("Review deleted successfully");
      fetchReviews(doctor_id, pagination.current, pagination.pageSize);
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  const handleTableChange = (pag) => {
    setPagination({ current: pag.current, pageSize: pag.pageSize });
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
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total,
          hideOnSinglePage: true,
        }}
        onChange={handleTableChange}
      />
    </Spin>
  );
};

export default ReviewsTable;
