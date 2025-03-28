/* eslint-disable react/no-unescaped-entities */
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

export const SignInPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: emailLogin, isPending: isLoading, error } = useEmailLogin();
  const { user } = useAuth();
  const handleEmailLogin = () => {
    emailLogin({ email, password });
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div id="webcrumbs">
      <div className="w-full flex justify-center items-center h-screen">
        <div className="w-[400px] md:w-[500px] lg:w-[600px] bg-white rounded-xl shadow-lg p-6 md:p-10 space-y-4 md:space-y-6 hover:scale-[1.02] transition-all duration-300">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center md:text-left">
            Sign In
          </h2>
          <div className="flex flex-col space-y-3 md:space-y-4">
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
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-10 pr-3 md:px-10 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <div className="flex justify-end">
              <a
                href="/forgotpassword"
                className="font-medium text-gray-600 hover:underline text-sm md:text-base"
              >
                Forgot Password?
              </a>
            </div>
            {error && (
              <p className="text-red-500 text-sm">
                Your email or password is not correct.
              </p>
            )}
            <button
              onClick={handleEmailLogin}
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2.5 md:py-3 rounded-lg hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all duration-300 text-sm md:text-base ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Sign In
            </button>
          </div>
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3 md:px-4 text-sm md:text-base text-gray-500">
              or continue with
            </span>
            <div className="flex-1 border-t border-gray-300" />
          </div>
          <GoogleAuth setLoading={setLoading} />
          <div className="text-center mt-4 md:mt-6">
            <span className="text-sm md:text-base text-gray-600">
              Don't have an account?{" "}
            </span>
            <a
              href="/signup"
              className="text-sm md:text-base text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-300"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
