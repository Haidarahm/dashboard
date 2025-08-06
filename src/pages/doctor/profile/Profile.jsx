import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Switch,
  Upload,
  Button,
  Tabs,
  Avatar,
  message,
  Row,
  Col,
  Spin,
} from "antd";
import {
  User,
  Upload as UploadIcon,
  Edit,
  Building,
  Mail,
  Phone,
  Briefcase,
  Award,
  Calendar,
  Lock,
  Camera,
  FileText,
} from "lucide-react";
import { useProfileStore } from "../../../store/doctor/profileStore";
import { toast } from "react-toastify";

const { Option } = Select;

const Profile = () => {
  const [updating, setUpdating] = useState(false);

  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("personal");
  const [fileList, setFileList] = useState([]);
  const [signatureList, setSignatureList] = useState([]);

  const {
    profile,
    loading,
    fetchProfile,
    updateProfile,
    getInitialFormValues,
  } = useProfileStore();

  // Initialize form with profile data
  useEffect(() => {
    const init = async () => {
      await fetchProfile(); // Wait for profile to be fetched
      const initialValues = getInitialFormValues(); // Now has correct data
      console.log("Initial Form Values:", initialValues);
      form.setFieldsValue(initialValues); // Set form fields correctly
    };
    init();
  }, []);

  useEffect(() => {
    if (profile) {
      if (profile.photo) {
        setFileList([
          {
            uid: "-1",
            name: "profile.jpg",
            status: "done",
            url: `http://127.0.0.1:8000${profile.photo}`,
          },
        ]);
      }
      if (profile.sign) {
        setSignatureList([
          {
            uid: "-2",
            name: "signature.png",
            status: "done",
            url: profile.sign,
          },
        ]);
      }
    }
  }, [profile, form]);

  const handleSubmit = async (values) => {
    try {
      setUpdating(true); // Start loading spinner

      const formValues = {
        ...values,
        profileImage: fileList,
        signature: signatureList,
      };

      await updateProfile(formValues); // First update

      await fetchProfile(); // Then refresh profile

      toast.success("Profile updated successfully!");
      setActiveTab("personal");
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.[0] || "Failed to update profile"
      );
    } finally {
      setUpdating(false); // Stop spinner
    }
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    fileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }
      return false; // Prevent auto-upload
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList.slice(-1)); // Keep only the last uploaded file
    },
  };

  const signatureUploadProps = {
    name: "file",
    multiple: false,
    accept: "image/*",
    fileList: signatureList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setSignatureList([
          {
            uid: file.uid,
            name: file.name,
            status: "done",
            url: reader.result,
            originFileObj: file, // ✅ add this
          },
        ]);
      };
      reader.readAsDataURL(file);

      return false;
    },
    onChange: ({ fileList: newFileList }) => {
      setSignatureList(newFileList);
    },
  };

  const tabItems = [
    {
      key: "personal",
      label: (
        <span className="flex items-center">
          <User className="w-4 h-4 mr-2" />
          Personal Information
        </span>
      ),
      children: (
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="First Name" name="firstName">
              <Input placeholder="Enter your first name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Last Name" name="lastName">
              <Input placeholder="Enter your last name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Email Address" name="email">
              <Input placeholder="doctor@example.com" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Phone Number" name="phone">
              <Input placeholder="+1 (555) 123-4567" />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: "workspace",
      label: (
        <span className="flex items-center">
          <Building className="w-4 h-4 mr-2" />
          Workspace Information
        </span>
      ),
      children: (
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Professional Title" name="professionalTitle">
              <Input placeholder="e.g., Chief of Cardiology" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Speciality" name="speciality">
              <Input placeholder="e.g., Cardiology, Neurology" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Years of Experience" name="experienceYears">
              <Input type="number" placeholder="10" min={0} max={50} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Booking Type" name="bookType">
              <Select placeholder="Select booking type">
                <Option value="auto">Auto Booking</Option>
                <Option value="manual">Manual Booking</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Current Status" name="status">
              <Select placeholder="Select status">
                <Option value="available">Available</Option>
                <Option value="notavailable">Not Available</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Visit Fee" name="visitFee">
              <Input
                type="number"
                placeholder="Enter visit fee"
                prefix="$"
                min={0}
                step="0.1"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Visit Duration (minutes)" name="visitDuration">
              <Select placeholder="Select duration">
                <Option value={10}>10 minutes</Option>
                <Option value={15}>15 minutes</Option>
                <Option value={20}>20 minutes</Option>
                <Option value={30}>30 minutes</Option>
                <Option value={45}>45 minutes</Option>
                <Option value={60}>60 minutes</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: "security",
      label: (
        <span className="flex items-center">
          <Lock className="w-4 h-4 mr-2" />
          Security
        </span>
      ),
      children: (
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Current Password" name="oldPassword">
              <Input.Password placeholder="Enter current password" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="New Password" name="newPassword">
              <Input.Password placeholder="Enter new password" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
            >
              <Input.Password placeholder="Confirm new password" />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: "multimedia",
      label: (
        <span className="flex items-center">
          <Camera className="w-4 h-4 mr-2" />
          Multimedia
        </span>
      ),
      children: (
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <div className="text-center mb-4">
              {profile?.photo ? (
                <Avatar
                  size={120}
                  src={`http://127.0.0.1:8000${profile.photo}`}
                  className="mx-auto mb-3"
                />
              ) : (
                <Avatar
                  size={120}
                  icon={<User className="w-8 h-8" />}
                  className="mx-auto mb-3"
                />
              )}
              <h4 className="font-medium text-gray-700 mb-2">Profile Image</h4>
              <p className="text-sm text-gray-500 mb-4">
                Upload a professional photo for your profile. Recommended size:
                400x400px
              </p>
            </div>
            <Form.Item name="profileImage">
              <Upload {...uploadProps} listType="picture" multiple={false}>
                <Button
                  icon={<UploadIcon className="w-4 h-4" />}
                  className="w-full"
                >
                  Upload Profile Image
                </Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <div className="text-center mb-4">
              {profile?.sign ? (
                <div className="w-48 h-24 mx-auto mb-3 flex items-center justify-center">
                  <img
                    src={`http://127.0.0.1:8000${profile.sign}`}
                    alt="Signature"
                    className="max-w-full max-h-full"
                  />
                </div>
              ) : (
                <div className="w-48 h-24 mx-auto mb-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <h4 className="font-medium text-gray-700 mb-2">
                Digital Signature
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Upload your digital signature for medical documents. Recommended
                format: PNG with transparent background
              </p>
            </div>
            <Form.Item name="signature">
              <Upload {...signatureUploadProps}>
                <Button
                  icon={<UploadIcon className="w-4 h-4" />}
                  className="w-full"
                >
                  Upload Signature
                </Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                File Requirements
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Profile Image: JPG, PNG, or GIF (max 5MB)</li>
                <li>• Signature: PNG with transparent background (max 2MB)</li>
                <li>• All images should be high quality and professional</li>
              </ul>
            </div>
          </Col>
        </Row>
      ),
    },
  ];

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <div className="flex items-center space-x-4">
            {profile?.photo ? (
              <Avatar
                size={64}
                src={`http://127.0.0.1:8000${profile.photo}`}
                className="bg-blue-500"
              />
            ) : (
              <Avatar
                size={64}
                icon={<User className="w-6 h-6" />}
                className="bg-blue-500"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile
                  ? `${profile.first_name} ${profile.last_name}`
                  : "Doctor Profile"}
              </h1>
              <p className="text-gray-600">
                Manage your professional information and account settings
              </p>
            </div>
          </div>
        </Card>

        {/* Form Content */}
        <Card>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              className="mb-6"
            />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                size="large"
                onClick={() => form.resetFields()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={updating}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
