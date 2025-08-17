import { useState } from "react";
import { Button, Select } from "antd";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { toast } from "react-toastify";
import { signInUser, createUser, resetPassword } from "../../firebase";

const LoginFormWithFirebase = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState("admin");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Sign in existing user
        const result = await signInUser(formData.email, formData.password);

        if (result.success) {
          toast.success("Successfully signed in!");
          // Here you would typically redirect to the appropriate dashboard
          // based on the user's role
          console.log("User signed in:", result.user);
        } else {
          toast.error(result.error);
        }
      } else {
        // Create new user
        const result = await createUser(formData.email, formData.password);

        if (result.success) {
          toast.success(
            "Account created successfully! Please check your email for verification."
          );
          console.log("User created:", result.user);
        } else {
          toast.error(result.error);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(formData.email);

      if (result.success) {
        toast.success("Password reset email sent! Please check your inbox.");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Password reset error:", error);
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
        <h2 className="login-form-title">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="login-form-subtitle">
          {isLogin
            ? "Sign in to your clinic dashboard"
            : "Create a new account for your clinic"}
        </p>
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
              { label: "Secretary", value: "secretary" },
            ]}
          />
        </div>

        <FormInput
          label="Email Address"
          type="email"
          icon={<MdEmail className="login-input-icon" />}
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Enter your email address"
        />

        <PasswordInput
          label="Password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          placeholder="Enter your password"
        />

        {isLogin && (
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
        )}

        <Button
          type="primary"
          loading={loading}
          onClick={handleLogin}
          className="login-button"
        >
          {loading
            ? isLogin
              ? "Signing In..."
              : "Creating Account..."
            : isLogin
            ? "Sign In"
            : "Create Account"}
        </Button>

        {isLogin && (
          <Button
            type="link"
            onClick={handlePasswordReset}
            disabled={loading || !formData.email}
            style={{ marginTop: 8 }}
          >
            Forgot Password?
          </Button>
        )}
      </div>

      <div className="login-signup-prompt">
        <p className="login-signup-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            className="login-signup-link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Sign In"}
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

export default LoginFormWithFirebase;
