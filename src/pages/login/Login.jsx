import BrandingSection from "./BrandingSection";
import LoginForm from "./LoginForm";
import MobileLogo from "./MobileLogo";
import AppFooter from "./AppFooter";
import "./Login.css";

const Login = () => (
  <div className="login-container">
    <BrandingSection />
    
    <div className="login-right-side">
      <div className="login-right-inner">
        <MobileLogo />
        <LoginForm />
        <AppFooter />
      </div>
    </div>
  </div>
);

export default Login;