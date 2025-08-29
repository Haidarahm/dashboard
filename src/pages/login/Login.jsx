import { useState } from "react";
import RoleSelection from "./RoleSelection";
import LoginFormStep from "./LoginFormStep";

const Login = () => {
  const [currentStep, setCurrentStep] = useState("role-selection");
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentStep("login-form");
  };

  const handleBackToRoleSelection = () => {
    setCurrentStep("role-selection");
    setSelectedRole(null);
  };

  return (
    <>
      {currentStep === "role-selection" && (
        <RoleSelection onRoleSelect={handleRoleSelect} />
      )}

      {currentStep === "login-form" && (
        <LoginFormStep
          selectedRole={selectedRole}
          onBack={handleBackToRoleSelection}
        />
      )}
    </>
  );
};

export default Login;
