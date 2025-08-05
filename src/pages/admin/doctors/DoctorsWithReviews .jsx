import React, { useState } from 'react';
import { Card, Typography } from 'antd';
import DoctorsTable from './DoctorsTable';
import ReviewsTable from './ReviewsTable';

const { Title } = Typography;

const DoctorsWithReviews = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // This function will be passed to DoctorsTable to handle star icon clicks
  const handleShowReviews = (doctor) => {
    setSelectedDoctor(doctor);
  };

  return (
    <div style={{ padding: '24px' }}>
      
      {/* Doctors Table with the ability to show reviews */}
      <DoctorsTable onShowReviews={handleShowReviews} />
      
      {/* Reviews Table that appears when a doctor is selected */}
      {selectedDoctor && (
        <Card style={{ marginTop: '24px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            Reviews for Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}
          </Title>
          <ReviewsTable doctor_id={selectedDoctor.id} />
        </Card>
      )}
    </div>
  );
};

export default DoctorsWithReviews;