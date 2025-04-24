import API from "./api";

export const postReport = async (formData) => {
  const response = await API.post("/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.report;
};

export const getReportsByUserId = (userId) => {
  const response = API.get(`/reports/${userId}`, { withCredentials: true });
  return response.data.reports;
};

export const getAllReports = () => {
  const response = API.get("/reports", { withCredentials: true });
  return response.data.reports;
};
