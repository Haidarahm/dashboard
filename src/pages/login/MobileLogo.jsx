import { FaClinicMedical } from "react-icons/fa";

const MobileLogo = () => (
  <div className="login-mobile-logo">
    <div className="login-mobile-logo-icon">
      <FaClinicMedical className="login-mobile-logo-icon-inner" />
    </div>
    <div>
      <h1 className="login-mobile-logo-text">ClinicCare</h1>
      <p className="login-mobile-logo-subtext">Management System</p>
    </div>
  </div>
);

export default MobileLogo;