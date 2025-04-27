/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useUpdateUser } from "../hooks/useUsers";
import { useVerifyEmail } from "../hooks/useAuth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import {
  User,
  Mail,
  FileText,
  Camera,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import Settings from "./Settings";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useCreateTestimonial } from "../hooks/useTestimonial";
import { useDoesUserOwnCampaign } from "../hooks/useCampaign";

const ProfileManagement = () => {
  const { user: currentUser } = useUser();
  const { data: isOwner } = useDoesUserOwnCampaign("completed");
  const { mutate: updateUser, isPending, error } = useUpdateUser();
  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmail();
  const { mutateAsync: submitTestimonial, isPending: isSubmitting } =
    useCreateTestimonial();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    message: "",
    type: null,
  });
  const [isTestiModalOpen, setIsTestiModalOpen] = useState(false);
  const [testimonial, setTestimonial] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmitTestimonial = async (e) => {
    e.preventDefault();
    if (!testimonial.trim()) {
      alert("Please provide a reason for reporting.");
      return;
    }
    if (!currentUser) {
      return;
    }

    const formData = new FormData();
    formData.append("message", testimonial);
    formData.append("userName", currentUser.name);
    if (imageFile) formData.append("image", imageFile);

    try {
      await submitTestimonial(formData);
      toast.success("Testimonial posted successfuly !");
      setIsTestiModalOpen(false);
      setTestimonial("");
      setImageFile(null);
    } catch (error) {
      console.error("Error submitting report:", error);
      setIsTestiModalOpen(false);
      setTestimonial("");
      setImageFile(null);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        bio: currentUser.bio,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentUser) {
      updateUser({
        userId: currentUser._id,
        userData: {
          name: formData.name,
          bio: formData.bio,
        },
      });
      setIsEditing(false);
    }
  };

  const handleImageChange = (imageUrl) => {
    if (currentUser) {
      updateUser({ userId: currentUser._id, userData: { avatar: imageUrl } });
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  const handleVerifyEmail = () => {
    if (currentUser) {
      verifyEmail(
        { email: currentUser.email },
        {
          onSuccess: () => {
            setVerificationStatus({
              message: "Verification email sent! Please check your inbox.",
              type: "success",
            });
            setTimeout(() => {
              setVerificationStatus({ message: "", type: null });
            }, 5000);
          },
        }
      );
    }
  };
  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="px-4 py-6">
        {/* Email Verification Banner */}
        {!currentUser.verified && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                <div>
                  <p className="text-sm text-yellow-700">
                    Your email address ({currentUser.email}) is not verified.
                  </p>
                  {verificationStatus.message && (
                    <p
                      className={`text-sm mt-1 ${
                        verificationStatus.type === "success"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {verificationStatus.message}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="warning"
                size="sm"
                disabled={isVerifying}
                onClick={handleVerifyEmail}
                className="ml-4"
              >
                Send Verification
              </Button>
            </div>
          </div>
        )}

        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Profile Management
          </h1>
          <div className="mt-4 sm:mt-0 sm:ml-4 flex space-x-2">
            {currentUser?.role === "user" && (
              <>
                {isOwner && (
                  <Button
                    variant="success"
                    onClick={() => setIsTestiModalOpen(true)}
                  >
                    Testimony
                  </Button>
                )}

                <Button
                  variant="success"
                  onClick={() => window.open(`/donor/${currentUser._id}`)}
                >
                  Share Your Donor Profile
                </Button>
              </>
            )}
            {!isEditing && (
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                User Profile
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Personal details and account information
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {currentUser.verified ? (
                <Badge variant="success" className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="warning" className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Unverified
                </Badge>
              )}
              <Badge
                variant={
                  currentUser.role === "admin"
                    ? "danger"
                    : currentUser.role === "moderator"
                    ? "warning"
                    : "default"
                }
              >
                {currentUser.role.charAt(0).toUpperCase() +
                  currentUser.role.slice(1)}
              </Badge>
            </div>
          </div>

          {isEditing ? (
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="sm:w-1/3">
                    <div className="flex flex-col items-center">
                      <Avatar
                        src={formData.avatar}
                        alt={formData.name}
                        size="xl"
                        editable={true}
                        onImageChange={handleImageChange}
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Click to change photo
                      </p>
                    </div>
                  </div>

                  <div className="sm:w-2/3 space-y-4">
                    <Input
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      icon={<User className="h-5 w-5 text-gray-400" />}
                    />

                    <Textarea
                      label="Bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      if (currentUser) {
                        setFormData({
                          name: currentUser.name,
                          email: currentUser.email,
                          bio: currentUser.bio,
                          avatar: currentUser.avatar,
                        });
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Profile Picture
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center">
                      <Avatar
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        size="lg"
                        editable={true}
                        onImageChange={handleImageChange}
                      />
                    </div>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {currentUser.name}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center space-x-2">
                      <span>{currentUser.email}</span>
                    </div>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Bio
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {currentUser.bio}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>
      <Settings />
      <AnimatePresence>
        {isTestiModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4">Report Campaign</h2>
              <form onSubmit={handleSubmitTestimonial}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submit a Testimony
                  </label>
                  <textarea
                    value={testimonial}
                    onChange={(e) => setTestimonial(e.target.value)}
                    placeholder="Write your testimony..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows="3"
                    maxLength={80}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload a Photo of Yours
                  </label>
                  <div className="space-y-2">
                    <label htmlFor="">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsTestiModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-red-300"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileManagement;
