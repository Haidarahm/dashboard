import { useState } from "react";
import { Button, message } from "antd";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      message.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success("Login successful!");
    } catch (error) {
      message.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="login-form">
      <div className="login-form-header">
        <h2 className="login-form-title">Welcome Back</h2>
        <p className="login-form-subtitle">Sign in to your clinic dashboard</p>
      </div>

      <div className="login-form-fields">
        <FormInput
          label="Email Address"
          type="email"
          icon={<MdEmail className="login-input-icon" />}
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Enter your email"
        />
        
        <PasswordInput
          label="Password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          placeholder="Enter your password"
        />

        <div className="login-form-options">
          <label className="login-remember-me">
            <input type="checkbox" className="login-remember-checkbox" />
            <span className="login-remember-text">Remember me</span>
          </label>
        </div>

        <Button
          type="primary"
          loading={loading}
          onClick={handleLogin}
          className="login-button"
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </div>

      <div className="login-signup-prompt">
        <p className="login-signup-text">
          Don't have an account?{" "}
          <button className="login-signup-link">
            Contact Administrator
          </button>
        </p>
      </div>
    </div>
  );
};

const FormInput = ({ label, icon, ...props }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <div className="login-input-group">
      {icon}
      <input className="login-input-field" {...props} />
    </div>
  </div>
);

const PasswordInput = ({ label, showPassword, setShowPassword, ...props }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <div className="login-input-group">
      <MdLock className="login-input-icon" />
      <input
        type={showPassword ? "text" : "password"}
        className="login-password-input"
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="login-password-toggle"
      >
        {showPassword ? (
          <MdVisibilityOff className="text-xl" />
        ) : (
          <MdVisibility className="text-xl" />
        )}
      </button>
    </div>
  </div>
);

export default LoginForm;