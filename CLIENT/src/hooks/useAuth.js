import { useQuery, useMutation } from "@tanstack/react-query";
import { googleLogout } from "@react-oauth/google";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import {
  loginUser,
  fetchLoggedUser,
  logoutUser,
  changePassword,
  registerUser,
  forgetPassword,
  resetPassword,
  verifyEmail,
  verifyEmailToken,
} from "../api/authApi";
import { useNavigate } from "react-router-dom";

export const useEmailLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("Signup successful:", data);
    },
    onError: (error) => {
      console.error("Signup failed:", error);
    },
  });
};
export const useFetchLoggedUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchLoggedUser,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};
export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, setUser, isLoading } = useContext(AuthContext);
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
    googleLogout();
    setUser(null);
    navigate("/");
  };

  return { user, handleLogout, isLoading };
};

export const useForggotPassword = () => {
  return useMutation({
    mutationFn: forgetPassword,
  });
};
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,
  });
};
export const useVerifyEmailToken = () => {
  return useMutation({
    mutationFn: verifyEmailToken,
  });
};
