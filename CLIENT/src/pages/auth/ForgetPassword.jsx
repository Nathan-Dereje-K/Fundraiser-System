import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForggotPassword } from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import AlertMessage from "../../components/ui/AlertMessage";
//this page is to request a password reset link
const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const {
    mutate: forgetPassword,
    isPending,
    isError,
    isSuccess,
    error,
  } = useForggotPassword();

  const handleForgetPassword = async () => {
    forgetPassword({ email });
  };

  return (
    <div className=" flex flex-col justify-center items-center h-screen">
      <div className="w-[450px] bg-gray-50 p-10 rounded-3xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Forgot password
        </h2>

        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Please enter your registered email address and we will send you
          password reset instructions to this email.
        </p>

        <div className="mb-7">
          <div className="relative">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-3 md:px-10 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {isSuccess && (
          <AlertMessage
            type="success"
            message="We have emailed instructions on how to reset your password to the email address you specified."
          />
        )}

        {isError && (
          <AlertMessage
            type="error"
            message="An error occurred while processing your request. Please try again later."
          />
        )}

        <button
          onClick={handleForgetPassword}
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-gray-700 text-white py-3.5 px-5 rounded-full transition duration-300 mb-5 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transform hover:scale-[1.02] text-base font-medium"
        >
          Forgot password?
        </button>

        <div className="text-center text-sm mt-2">
          Back to{" "}
          <a
            href="/signin"
            className="text-blue-500 hover:text-blue-600 transition duration-200 font-medium"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
