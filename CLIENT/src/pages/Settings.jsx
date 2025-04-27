import React, { useState, Fragment, useEffect } from "react";
import { Shield, Lock, X, Check, Loader } from "lucide-react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useUser } from "../context/UserContext";
import { useChangePassword } from "../hooks/useAuth";
import LanguageSwitcher from "../components/language/i18com";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useUser();
  const {
    mutate: updateUserPassword,
    isPending,
    isError,
    isSuccess,
    error,
  } = useChangePassword();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage(t("Passwords do not match"));
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    } else if (
      formData.currentPassword === "" ||
      formData.newPassword === "" ||
      formData.confirmPassword === ""
    ) {
      setErrorMessage(t("All fields are required"));
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    } else if (
      formData.newPassword.length < 8 ||
      formData.currentPassword.length < 8
    ) {
      setErrorMessage(t("Password must be at least 8 characters long"));
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    } else {
      updateUserPassword({
        userId: currentUser._id,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
    }
    setIsPasswordModalOpen(false);
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setSuccessMessage(t("Password updated successfully"));
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    }
    if (isError) {
      setErrorMessage(error.response?.data?.message || t("Something went wrong"));
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    }
  }, [isSuccess, isError]);

  const SuccessMessage = () => (
    <div className="flex items-center bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg">
      <Check className="h-5 w-5 mr-2" />
      {successMessage}
    </div>
  );

  const ErrorMessage = () => (
    <div className="flex items-center bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg">
      <X className="h-5 w-5 mr-2" />
      {errorMessage}
    </div>
  );

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t("Account Settings")}
      </h1>

      <div className="space-y-6">
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <Shield className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {t("Security Settings")}
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {t("Change Password")}
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  {t("Update your password to maintain account security.")}
                </p>
                <div className="my-3">
                  <Button
                    onClick={() => setIsPasswordModalOpen(true)}
                    variant="outline"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {t("Change Password")}
                  </Button>
                </div>
                {successMessage && <SuccessMessage />}
                {errorMessage && <ErrorMessage />}
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        <Transition appear show={isPasswordModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsPasswordModalOpen(false)}
          >
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <DialogTitle
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        {t("Change Password")}
                      </DialogTitle>
                      <button
                        onClick={() => setIsPasswordModalOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <form className="space-y-4">
                      <Input
                        label={t("Current Password")}
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                      />

                      <Input
                        label={t("New Password")}
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                      <Input
                        label={t("Confirm New Password")}
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <div className="mt-6 flex justify-end space-x-3">
                        <Button
                          variant="secondary"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsPasswordModalOpen(false);
                            setFormData({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                          }}
                        >
                          {t("Cancel")}
                        </Button>
                        <Button
                          variant="primary"
                          disabled={isPending}
                          onClick={handleUpdatePassword}
                        >
                          {isPending ? (
                            <>
                              <Loader className="h-4 w-4 mr-2 animate-spin" />
                              {t("Updating...")}
                            </>
                          ) : (
                            t("Update Password")
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
      <div className="mt-4">
        <LanguageSwitcher/>
      </div>
    </div>
  );
};

export default Settings;