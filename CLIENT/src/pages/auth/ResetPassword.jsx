import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useResetPassword } from "../../hooks/useAuth";
import { useSearchParams, useNavigate } from "react-router-dom";
import AlertMessage from "../../components/ui/AlertMessage";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const {
    mutate: resetPassword,
    isError,
    isSuccess,
    error: resetError,
  } = useResetPassword();
  const handleSubmit = (event) => {
    event.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
    } else if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else if (
      token === "undefined" ||
      token == null ||
      token == undefined ||
      token == "" ||
      token === null ||
      token === undefined
    ) {
      setError("Invalid token");
    } else {
      setError("");
      console.log(token);
      resetPassword({ token, password });
    }
  };
  useEffect(() => {
    if (isError || isSuccess) {
      setTimeout(() => navigate("/signin"), 2000);
    }
  }, [isError, isSuccess]);
  return (
    <div className=" flex flex-col justify-center items-center h-screen">
      <div className="w-[450px] bg-gray-50 p-10 rounded-3xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          {t("Reset password")}
        </h2>

        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
           {t("Please enter your new password and confirm it to reset your password. ")}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mb-8">
          <div className="relative">
            <input
              type={showPassword1 ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword1(!showPassword1)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
            >
              <FontAwesomeIcon icon={showPassword1 ? faEyeSlash : faEye} />
            </button>
          </div>

          <div className="relative">
            <input
              type={showPassword2 ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border focus:outline-none transition-all duration-300 ${
                confirmPassword && confirmPassword !== password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword2(!showPassword2)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
            >
              <FontAwesomeIcon icon={showPassword2 ? faEyeSlash : faEye} />
            </button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {isError && (
            <AlertMessage
              type="error"
              message={resetError.response.data.message}
            />
          )}
          {isSuccess && (
            <AlertMessage type="success" message="Password reset" />
          )}
          <button className="w-full bg-blue-500 hover:bg-gray-700 text-white py-3.5 px-5 rounded-full transition duration-300 mb-5 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transform hover:scale-[1.02] text-base font-medium">
             {t("Reset password")}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
