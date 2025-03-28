/* eslint-disable react/prop-types */
import { useGoogleLogin } from "@react-oauth/google";
import googleIcon from "../../assets/google-icon.png";
import API from "../../api/api";
import { useState } from "react";

const GoogleAuth = ({ setLoading }) => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      setGoogleLoading(true);
      setLoading(true);
      try {
        const response = await API.post("/auth/google", { code });
        if (response.status === 200) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Google login failed", error);
      } finally {
        setLoading(false);
        setGoogleLoading(false);
      }
    },
    flow: "auth-code", // Ensure you're using the correct flow
  });

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {googleLoading ? (
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <img
          src={googleIcon}
          onClick={googleLogin}
          alt="Google"
          className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform duration-300"
        />
      )}
    </div>
  );
};

export default GoogleAuth;
