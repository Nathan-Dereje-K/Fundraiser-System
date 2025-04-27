import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleAuth from "./GoogleAuth";
import { signUpSchema } from "../../schemas/authSchema";
import { useRegister } from "../../hooks/useAuth";
import { useUsers } from "../../hooks/useUsers";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const SignUpPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [googleLoading, setLoading] = useState(false);
  const { user } = useUsers();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    mutate(data);
    navigate("/");
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const { mutate, isPending: isLoading, isError, error } = useRegister();

  const getPasswordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W]/.test(password)) strength++;
    return strength;
  };

  const strengthLevel = getPasswordStrength();
  const strengthColors = [
    "bg-gray-300",
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];
  const strengthText = [
    t("Weak"),
    t("Weak"),
    t("Moderate"),
    t("Good"),
    t("Strong"),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-white via-orange-50 to-orange-100"
    >
      <div className="flex w-[90%] max-w-[1200px] rounded-md overflow-hidden shadow-2xl h-[100vh]">
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
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-6 md:p-10">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-center mb-4"
            >
              {t("Together, We Can Make a Difference")}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-sm md:text-base text-center"
            >
              {t(
                "Join thousands of donors supporting meaningful causes worldwide."
              )}
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          className="w-2/3 bg-white p-6 md:p-10 space-y-6"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold text-gray-800 text-center"
          >
            {t("Sign Up")}
          </motion.h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-5"
          >
            <div className="flex gap-4">
              <motion.div whileTap={{ scale: 0.98 }} className="w-1/2">
                <input
                  {...register("firstName")}
                  type="text"
                  placeholder={t("First Name")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {t(errors.firstName.message)}
                  </p>
                )}
              </motion.div>
              <motion.div whileTap={{ scale: 0.98 }} className="w-1/2">
                <input
                  {...register("lastName")}
                  type="text"
                  placeholder={t("Last Name")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {t(errors.lastName.message)}
                  </p>
                )}
              </motion.div>
            </div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <input
                {...register("email")}
                type="email"
                placeholder={t("Email Address")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {t(errors.email.message)}
                </p>
              )}
            </motion.div>

            <motion.div whileTap={{ scale: 0.98 }} className="relative">
              <input
                {...register("password")}
                type={showPassword1 ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("Password")}
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword1(!showPassword1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                aria-label={
                  showPassword1 ? t("Hide password") : t("Show password")
                }
              >
                {showPassword1 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {t(errors.password.message)}
                </p>
              )}
            </motion.div>

            <motion.div whileTap={{ scale: 0.98 }} className="relative">
              <input
                {...register("confirmPassword")}
                type={showPassword2 ? "text" : "password"}
                placeholder={t("Confirm Password")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className={`w-full px-4 py-3 rounded-lg border ${
                  confirmPassword && confirmPassword !== password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-orange-200"
                } focus:outline-none focus:border-orange-500 transition-all duration-300`}
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                aria-label={
                  showPassword2 ? t("Hide password") : t("Show password")
                }
              >
                {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {t(errors.confirmPassword.message)}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <p className="text-sm font-medium text-gray-700 mb-2">
                {t("Password strength")}: {strengthText[strengthLevel]}
              </p>
              <div className="flex gap-1 mb-1">
                {[...Array(4)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ width: "0%" }}
                    animate={{
                      width: index < strengthLevel ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.3 }}
                    className={`h-1.5 rounded-full ${
                      index < strengthLevel
                        ? strengthColors[strengthLevel]
                        : "bg-gray-300"
                    }`}
                  ></motion.div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                {t(
                  "Use at least 8 characters with letters, numbers, and symbols"
                )}
              </p>
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading || googleLoading}
              className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-0.5 transition-all duration-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-disabled={isLoading || googleLoading}
            >
              {isLoading ? t("Creating Account...") : t("Create Account")}
            </motion.button>
            {isError && (
              <p className="text-red-500 text-center">{t(error.message)}</p>
            )}
          </form>

          <div className="flex items-center my-5">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-4 text-sm text-gray-500">
              {t("or continue with")}
            </span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          <GoogleAuth setLoading={setLoading} />

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">
              {t("Already have an account?")}{" "}
            </span>
            <a
              href="/signin"
              className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline transition-all duration-300"
            >
              {t("Sign in")}
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
