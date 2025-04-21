/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmailLogin } from "../../hooks/useAuth";
import { useAuth } from "../../hooks/useAuth";
import GoogleAuth from "./GoogleAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

export const SignInPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode toggle
  const { mutate: emailLogin, isPending: isLoading, error } = useEmailLogin();
  const { user } = useAuth();

  const handleEmailLogin = () => {
    emailLogin({ email, password });
  };

  useEffect(() => {
    if (user && user.userId !== "_") {
      navigate("/");
    }
    if (user && user.role === "admin") {
      navigate("/dashboard");
    }
    if (user && user.role === "validator") {
      navigate("/validator_panel");
    }
    if (user && user.role === "manager") {
      navigate("/campaign_manager");
    }
  }, [user, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`w-full min-h-screen flex justify-center items-center ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
          : "bg-gradient-to-br from-white via-orange-50 to-orange-100"
      }`}
    >
      {/* Container */}
      <div className="flex w-[90%] max-w-[1200px] rounded-3xl overflow-hidden shadow-2xl h-[650px]">
        {/* Left Section: AI Image */}
        <motion.div
          className="w-1/3 bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('https://source.unsplash.com/1600x900/?helping,poor,girl,donate')",
          }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4 md:p-6">
            <h2 className="text-3xl font-bold text-center">
              Together, We Can Make a Difference
            </h2>
            <p className="text-sm mt-2 text-center">
              Join thousands of donors supporting meaningful causes worldwide.
            </p>
          </div>
        </motion.div>

        {/* Right Section: Sign-In Form */}
        <motion.div
          className="w-2/3 bg-white p-6 md:p-8 space-y-6"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Header Section */}
          <div className="space-y-3 text-center">
            <h2 className="text-4xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-base text-gray-600">
              Sign in to continue supporting your cause.
            </p>
          </div>

          {/* Form Section */}
          <form
            className="flex flex-col space-y-5"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Email Input */}
            <motion.div whileTap={{ scale: 0.98 }} className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                required
              />
            </motion.div>

            {/* Password Input */}
            <motion.div whileTap={{ scale: 0.98 }} className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </motion.div>

            {/* Forgot Password Link */}
            <a
              href="/forgotpassword"
              className="self-end text-sm text-orange-600 hover:underline transition-all duration-300"
            >
              Forgot Password?
            </a>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-500 text-center">
                Your email or password is incorrect.
              </p>
            )}

            {/* Sign In Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleEmailLogin}
              disabled={isLoading || loading}
              className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-lg hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-0.5 transition-all duration-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-disabled={isLoading || loading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-4 text-sm text-gray-500">or continue with</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* Google Auth */}
          <GoogleAuth setLoading={setLoading} />

          {/* Sign Up Link */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">
              Dont have an account?{" "}
            </span>
            <a
              href="/signup"
              className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline transition-all duration-300"
            >
              Sign up
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
