import { useState } from "react";
import { Button } from "antd";
import {
  MdPhone,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdArrowBack,
} from "react-icons/md";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/admin/authStore";
import { useDoctorAuthStore } from "../../store/doctor/authStore";
import useSecretaryAuthStore from "../../store/secretary/authStore";

const LoginFormStep = ({ selectedRole, onBack }) => {
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const adminLogin = useAuthStore((state) => state.login);
  const adminLoading = useAuthStore((state) => state.loading);
  const doctorLogin = useDoctorAuthStore((state) => state.login);
  const doctorLoading = useDoctorAuthStore((state) => state.loading);
  const secretaryLogin = useSecretaryAuthStore((state) => state.loginAction);
  const secretaryLoading = useSecretaryAuthStore((state) => state.loading);

  const getLoginFunction = () => {
    switch (selectedRole) {
      case "admin":
        return adminLogin;
      case "doctor":
        return doctorLogin;
      case "secretary":
        return secretaryLogin;
      default:
        return adminLogin;
    }
  };

  const getLoadingState = () => {
    switch (selectedRole) {
      case "admin":
        return adminLoading;
      case "doctor":
        return doctorLoading;
      case "secretary":
        return secretaryLoading;
      default:
        return adminLoading;
    }
  };

  const getRoleDisplayName = () => {
    switch (selectedRole) {
      case "admin":
        return "Admin";
      case "doctor":
        return "Doctor";
      case "secretary":
        return "Secretary";
      default:
        return "User";
    }
  };

  const login = getLoginFunction();
  const loading = getLoadingState();

  const handleLogin = async () => {
    if (!formData.phone || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Comprehensive phone number validation
    const cleanedPhone = formData.phone.replace(/[\s\-()]/g, "");

    // Check if phone number has valid format and length
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
    } catch (error) {}
  };

  // Phone number formatter
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/[^\d+\-() ]/g, "");

    if (cleaned.includes("+")) {
      const parts = cleaned.split("+");
      if (parts[0] === "") {
        return "+" + parts.slice(1).join("").replace(/\+/g, "");
      } else {
        return cleaned.replace(/\+/g, "");
      }
    }

    return cleaned;
  };

  // Validate phone number format
  const isValidPhoneFormat = (phone) => {
    if (!phone) return true;
    const phoneRegex = /^[+0]?[\d\s\-()]+$/;
    return phoneRegex.test(phone);
  };

  // Handle keydown events for phone input
  const handlePhoneKeyDown = (e) => {
    if (
      [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      (e.keyCode >= 35 && e.keyCode <= 40)
    ) {
      return;
    }

    const allowedChars = /[0-9+\-() ]/;
    const char = String.fromCharCode(e.keyCode);

    if (char === "+" && e.target.selectionStart !== 0) {
      e.preventDefault();
      return;
    }

    if (!allowedChars.test(char)) {
      e.preventDefault();
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "phone") {
      const formattedPhone = formatPhoneNumber(value);
      if (isValidPhoneFormat(formattedPhone)) {
        setFormData((prev) => ({ ...prev, [field]: formattedPhone }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <MdArrowBack className="mr-2" />
            Back to role selection
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in as {getRoleDisplayName()}</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <FormInput
              label="Phone Number"
              type="tel"
              icon={<MdPhone className="text-gray-400 text-xl" />}
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              onKeyDown={handlePhoneKeyDown}
              placeholder="Enter your phone number"
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

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            <Button
              type="primary"
              loading={loading}
              onClick={handleLogin}
              className="w-full h-12 bg-primary hover:bg-primary-dark border-primary hover:border-primary-dark rounded-lg font-medium text-base transition-all duration-200"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <button className="text-primary hover:text-primary-dark font-medium transition-colors">
                Contact Administrator
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormInput = ({ label, icon, ...props }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        {icon}
      </div>
      <input
        className="w-full h-12 pl-12 pr-4 rounded-lg border border-gray-300 hover:border-primary focus:border-primary focus:outline-none transition-colors"
        {...props}
      />
    </div>
  </div>
);

const PasswordInput = ({ label, showPassword, setShowPassword, ...props }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <div className="relative">
      <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
      <input
        type={showPassword ? "text" : "password"}
        className="w-full h-12 pl-12 pr-12 rounded-lg border border-gray-300 hover:border-primary focus:border-primary focus:outline-none transition-colors"
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

export default LoginFormStep;
