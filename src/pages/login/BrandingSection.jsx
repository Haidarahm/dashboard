import { FaClinicMedical, FaHeartbeat, FaShieldAlt, FaStethoscope } from "react-icons/fa";
import FeatureList from "./FeatureList";

const BrandingSection = () => (
  <div className="login-left-side">
    <div className="login-left-overlay"></div>
    
    <div className="login-pattern-container">
      <div className="login-pattern-icon-1"><FaHeartbeat /></div>
      <div className="login-pattern-icon-2"><FaClinicMedical /></div>
      <div className="login-pattern-icon-3"><FaShieldAlt /></div>
      <div className="login-pattern-icon-4"><FaStethoscope /></div>
    </div>

    <div className="login-left-content">
      <div className="login-left-inner">
        <div className="login-brand-container">
          <div className="login-brand-icon">
            <FaClinicMedical className="login-brand-icon-inner" />
          </div>
          <div>
            <h1 className="login-brand-text">ClinicCare</h1>
            <p className="login-brand-subtext">Management System</p>
          </div>
        </div>
        
        <h2 className="login-left-title">
          Streamline Your<br />
          <span className="login-left-highlight">Healthcare Practice</span>
        </h2>
        
        <p className="login-left-description">
          Manage patients, appointments, and medical records with our
          comprehensive clinic management solution.
        </p>
        
        <FeatureList />
      </div>
    </div>
  </div>
);

export default BrandingSection;