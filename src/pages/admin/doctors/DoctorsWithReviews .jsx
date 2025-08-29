import React, { useState, useRef, useEffect } from "react";
import { Card, Typography } from "antd";
import DoctorsTable from "./DoctorsTable";
import ReviewsTable from "./ReviewsTable";
import { useReviewsStore } from "../../../store/admin/reviewsStore";

const { Title } = Typography;

const DoctorsWithReviews = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  const reviewsCardRef = useRef(null);

  // Get loading state from reviews store
  const { loading: reviewsLoading } = useReviewsStore();

  // This function will be passed to DoctorsTable to handle star icon clicks
  const handleShowReviews = (doctor) => {
    setSelectedDoctor(doctor);
    setShouldScroll(true);
  };

  // Scroll to reviews card when reviews are loaded and scroll is requested
  useEffect(() => {
    if (shouldScroll && !reviewsLoading && reviewsCardRef.current) {
      // Add a small delay to ensure the DOM is fully rendered
      setTimeout(() => {
        if (reviewsCardRef.current) {
          // Get the element's position and scroll with offset
          const element = reviewsCardRef.current;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 120; // 120px offset from top for better visibility

          // Add smooth scroll class to body for enhanced scrolling
          document.body.classList.add("smooth-scroll");

          // Use smooth scrolling with enhanced options
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Add highlight effect with CSS animation
          setIsHighlighted(true);

          // Remove smooth scroll class after animation
          setTimeout(() => {
            document.body.classList.remove("smooth-scroll");
          }, 1000);

          // Remove highlight after animation completes
          setTimeout(() => setIsHighlighted(false), 2500);

          // Reset scroll flag
          setShouldScroll(false);
        }
      }, 150); // Slightly longer delay for better rendering
    }
  }, [shouldScroll, reviewsLoading]);

  return (
    <div style={{ padding: "24px" }}>
      {/* Doctors Table with the ability to show reviews */}
      <DoctorsTable onShowReviews={handleShowReviews} />

      {/* Reviews Table that appears when a doctor is selected */}
      {selectedDoctor && (
        <Card
          ref={reviewsCardRef}
          style={{
            marginTop: "24px",
            transition: "all 0.3s ease",
            border: isHighlighted ? "2px solid #1890ff" : "1px solid #d9d9d9",
            boxShadow: isHighlighted
              ? "0 0 0 2px rgba(24, 144, 255, 0.2)"
              : "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
            transform: isHighlighted ? "scale(1.01)" : "scale(1)",
          }}
          className={isHighlighted ? "reviews-card-highlight" : ""}
        >
          <Title level={4} style={{ marginBottom: "16px" }}>
            Reviews for Dr. {selectedDoctor.first_name}{" "}
            {selectedDoctor.last_name}
          </Title>
          <ReviewsTable doctor_id={selectedDoctor.id} />
        </Card>
      )}
    </div>
  );
};

export default DoctorsWithReviews;
