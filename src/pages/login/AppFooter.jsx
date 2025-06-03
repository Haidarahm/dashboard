import React from "react";

const AppFooter = () => (
  <div className="login-footer">
    <p>&copy; 2024 ClinicCare. All rights reserved.</p>
    <div className="login-footer-links">
      {['Privacy Policy', 'Terms of Service', 'Support'].map((item, index) => (
        <React.Fragment key={item}>
          {index > 0 && <span className="login-footer-divider">•</span>}
          <button className="login-footer-link">{item}</button>
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default AppFooter;