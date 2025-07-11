import { useState } from "react";
import { Button, Select } from "antd";
import { MdPhone, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/admin/authStore";
import { useDoctorAuthStore } from "../../store/doctor/authStore";

const LoginForm = () => {
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();

  const adminLogin = useAuthStore((state) => state.login);
  const adminLoading = useAuthStore((state) => state.loading);
  const doctorLogin = useDoctorAuthStore((state) => state.login);
  const doctorLoading = useDoctorAuthStore((state) => state.loading);

  const login = role === "admin" ? adminLogin : doctorLogin;
  const loading = role === "admin" ? adminLoading : doctorLoading;

  const handleLogin = async () => {
    if (!formData.phone || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Comprehensive phone number validation
    const cleanedPhone = formData.phone.replace(/[\s\-()]/g, "");

    // Check if phone number has valid format and length
    // Supports: +1234567890, 1234567890, 0936820776, etc.
    const phoneRegex = /^([+]?[1-9]\d{7,15}|0\d{9,10})$/;
    if (!phoneRegex.test(cleanedPhone)) {
      toast.error(
        "Please enter a valid phone number (e.g., 0936820776 or +1234567890)"
      );
      return;
    }

    // Check minimum length after cleaning
    const digitsOnly = cleanedPhone.replace(/[^\d]/g, "");
    if (digitsOnly.length < 10) {
      toast.error("Phone number must be at least 10 digits long");
      return;
    }

    try {
      await login(formData.phone, formData.password, rememberMe);
    } catch (error) {
      // Error is already handled in the store (toast), but you can add extra handling if needed
    }
  };

  // Phone number formatter - only allows digits, +, -, (, ), and spaces
  const formatPhoneNumber = (value) => {
    // Remove all characters except digits, +, -, (, ), and spaces
    const cleaned = value.replace(/[^\d+\-() ]/g, "");

    // Ensure + can only be at the beginning
    if (cleaned.includes("+")) {
      const parts = cleaned.split("+");
      if (parts[0] === "") {
        // + is at the beginning, keep only the first +
        return "+" + parts.slice(1).join("").replace(/\+/g, "");
      } else {
        // + is not at the beginning, remove all +
        return cleaned.replace(/\+/g, "");
      }
    }

    return cleaned;
  };

  // Validate phone number format
  const isValidPhoneFormat = (phone) => {
    // Allow empty string for ongoing typing
    if (!phone) return true;

    // Basic format validation: optional +, followed by digits, spaces, hyphens, parentheses
    // Allow numbers starting with 0 or + or any digit
    const phoneRegex = /^[+0]?[\d\s\-()]+$/;
    return phoneRegex.test(phone);
  };

  // Handle keydown events for phone input
  const handlePhoneKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter
    if (
      [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40)
    ) {
      return;
    }

    // Allow: +, -, (, ), space, and digits
    const allowedChars = /[0-9+\-() ]/;
    const char = String.fromCharCode(e.keyCode);

    // If + is pressed, only allow it at the beginning
    if (char === "+" && e.target.selectionStart !== 0) {
      e.preventDefault();
      return;
    }

    // If character is not allowed, prevent it
    if (!allowedChars.test(char)) {
      e.preventDefault();
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "phone") {
      const formattedPhone = formatPhoneNumber(value);

      // Only update if the formatted value is valid
      if (isValidPhoneFormat(formattedPhone)) {
        setFormData((prev) => ({ ...prev, [field]: formattedPhone }));
      }
      // If invalid, don't update the state (prevents invalid characters from appearing)
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="login-form">
      <div className="login-form-header">
        <h2 className="login-form-title">Welcome Back</h2>
        <p className="login-form-subtitle">Sign in to your clinic dashboard</p>
      </div>

      <div className="login-form-fields">
        <div style={{ marginBottom: 16 }}>
          <label className="block text-gray-700 font-medium mb-2">Role</label>
          <Select
            value={role}
            onChange={setRole}
            style={{ width: "100%" }}
            options={[
              { label: "Admin", value: "admin" },
              { label: "Doctor", value: "doctor" },
            ]}
          />
        </div>
        <FormInput
          label="Phone Number"
          type="tel"
          icon={<MdPhone className="login-input-icon" />}
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          onKeyDown={handlePhoneKeyDown}
          placeholder="Enter your phone number (e.g., 0936820776)"
          maxLength="20"
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
            <input
              type="checkbox"
              className="login-remember-checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
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
          <button className="login-signup-link">Contact Administrator</button>
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
