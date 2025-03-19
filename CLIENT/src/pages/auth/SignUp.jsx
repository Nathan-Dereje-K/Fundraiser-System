import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleAuth from "./GoogleAuth";
import { signUpSchema } from "../../schemas/authSchema";
import { useAuth, useRegister } from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [googleLoading, setLoading] = useState(false);
  const { user } = useAuth();
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
    mutate(data); // This will trigger the mutation
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Mutation for handling signup request
  const { mutate, isPending: isLoading, isError, error } = useRegister();

  // Function to determine password strength
  const getPasswordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W]/.test(password)) strength++;
    return strength;
  };

  // Get strength level
  const strengthLevel = getPasswordStrength();
  const strengthColors = [
    "bg-gray-300",
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];
  const strengthText = ["Weak", "Weak", "Moderate", "Good", "Strong"];

  return (
    <div id="webcrumbs">
      <div className="w-full flex justify-center items-center h-screen">
        <div className="w-[400px] md:w-[500px] lg:w-[600px] bg-white rounded-xl shadow-lg p-6 md:p-10 space-y-4 md:space-y-6 hover:scale-[1.02] transition-all duration-300">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center">
            Sign Up
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-3 md:space-y-4"
          >
            <div className="flex space-x-2 md:space-x-4">
              <div className="w-1/2">
                <input
                  {...register("firstName")}
                  type="text"
                  placeholder="First Name"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <input
                  {...register("lastName")}
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="Email Address"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                {...register("password")}
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
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                {...register("confirmPassword")}
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
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Password strength: {strengthText[strengthLevel]}
              </p>
              <div className="flex gap-1 mb-1">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1/4 rounded-full ${
                      index < strengthLevel
                        ? strengthColors[strengthLevel]
                        : "bg-gray-300"
                    }`}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-gray-500 ">
                Use at least 8 characters with letters, numbers, and symbols
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 md:py-3 rounded-lg hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all duration-300 text-sm md:text-base font-semibold"
              disabled={isLoading || googleLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
            {isError && (
              <p className="text-red-500 text-center">{error.message}</p>
            )}
          </form>

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
              Already have an account?{" "}
            </span>
            <a
              href="/signin"
              className="text-sm md:text-base text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-300"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
