const FeatureList = () => (
  <div className="login-feature-list">
    {['Patient Management', 'Appointment Scheduling', 'Medical Records', 'Billing & Insurance'].map((feature) => (
      <div key={feature} className="login-feature-item">
        <div className="login-feature-dot"></div>
        <span className="login-feature-text">{feature}</span>
      </div>
    ))}
  </div>
);

export default FeatureList;