import API from "./api";

export const loginUser = async ({ email, password }) => {
  const response = await API.post("/auth/signin", { email, password });
  if (response.status == 200) {
    window.location.reload();
  }
  return response.data;
};

export const registerUser = async (formData) => {
  const response = await API.post("/auth/signup", formData);
  if (response.status == 200) {
    window.location.reload();
  }
  return response.data;
};

export const fetchLoggedUser = async () => {
  try {
    const response = await API.get("/auth/me");
    return response?.data;
  } catch (error) {
    return null;
  }
};

export const logoutUser = async () => {
  await API.post("/auth/logout");
  window.location.reload();
};

export const changePassword = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
  const response = await API.post("/auth/changepassword", {
    userId,
    currentPassword,
    newPassword,
  });
  return response.data;
};

export const forgetPassword = async ({ email }) => {
  const response = await API.post("/auth/forgotpassword", { email });
  return response.data;
};

export const resetPassword = async ({ token, password }) => {
  const response = await API.post("/auth/verifyforgotpasswordtoken", {
    token,
    password,
  });
  return response.data;
};

export const verifyEmail = async ({ email }) => {
  const response = await API.post("/auth/verifyemail", { email });
  return response.data;
};

export const verifyEmailToken = async ({ token }) => {
  const response = await API.post("/auth/verifyemailtoken", { token });
  return response.data;
};
