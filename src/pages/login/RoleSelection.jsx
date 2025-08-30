import { useEffect } from "react";
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
      image: "/doctors.jpg",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      delay: 0,
    },
    {
      id: "secretary",
      title: "Secretary",
      description: "Manage appointments and patient registration",
      image: "/secretary.jpg",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      delay: 200,
    },
    {
      id: "admin",
      title: "Admin",
      description: "Full system access and user management",
      image: "/administrator.jpg",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      delay: 400,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-down">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/logo.webp"
              alt="Clinic Management System Logo"
              className="h-20 w-auto object-contain"
            />
          </div>

          <h1 className="text-5xl h-[80px] font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Clinic Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose your role to access the appropriate dashboard and features
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <div
              key={role.id}
              data-aos="fade-up"
              data-aos-delay={role.delay}
              className="group cursor-pointer"
              onClick={() => onRoleSelect(role.id)}
            >
              <div
                className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 ${role.borderColor} overflow-hidden`}
              >
                {/* Card Header with Image */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-90`}
                  />
                  <img
                    src={role.image}
                    alt={role.title}
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                      {role.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className={`p-8 ${role.bgColor}`}>
                  <p className="text-gray-700 text-center mb-6 text-lg leading-relaxed">
                    {role.description}
                  </p>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-full py-3 px-6 bg-white rounded-xl shadow-md border border-gray-200 group-hover:shadow-lg transition-all duration-300">
                      <span className="font-semibold text-gray-800 group-hover:text-gray-900">
                        Continue as {role.title}
                      </span>
                      <svg
                        className="ml-3 w-5 h-5 text-gray-600 group-hover:text-gray-800 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
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
          className="text-center mt-16"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <div className="inline-flex items-center space-x-2 text-gray-500 text-sm bg-white px-6 py-3 rounded-full shadow-md">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Need help? Contact your system administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
