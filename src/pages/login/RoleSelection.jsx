import { useEffect } from "react";
import { FaUserMd, FaUserSecret, FaUserShield } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const RoleSelection = ({ onRoleSelect }) => {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out",
      once: true,
    });
  }, []);

  const roles = [
    {
      id: "doctor",
      title: "Doctor",
      description: "Access patient records and manage appointments",
      icon: FaUserMd,
      color: "from-blue-500 to-blue-600",
      delay: 0,
    },
    {
      id: "secretary",
      title: "Secretary",
      description: "Manage appointments and patient registration",
      icon: FaUserSecret,
      color: "from-green-500 to-green-600",
      delay: 200,
    },
    {
      id: "admin",
      title: "Admin",
      description: "Full system access and user management",
      icon: FaUserShield,
      color: "from-purple-500 to-purple-600",
      delay: 400,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Clinic Management
          </h1>
          <p className="text-lg text-gray-600">Select your role to continue</p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              data-aos="fade-up"
              data-aos-delay={role.delay}
              className="group cursor-pointer"
              onClick={() => onRoleSelect(role.id)}
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                {/* Card Header */}
                <div
                  className={`bg-gradient-to-r ${role.color} p-6 text-center rounded-t-xl`}
                >
                  <div className="bg-white/20 p-3 rounded-full inline-block mb-3">
                    <role.icon className="text-3xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{role.title}</h3>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-gray-600 text-center mb-4">
                    {role.description}
                  </p>

                  <div className="text-center">
                    <div className="inline-flex items-center text-primary font-medium group-hover:text-primary-dark transition-colors">
                      <span>Continue as {role.title}</span>
                      <svg
                        className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="text-center mt-8"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <p className="text-gray-500 text-sm">
            Need help? Contact your system administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
