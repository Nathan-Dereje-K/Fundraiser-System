import API from "./api";

export const postReport = async (formData) => {
  const response = await API.post("/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.report;
};

export const getAllReports = async () => {
  const response = await API.get("/reports");
  return response.data.data;
};

export const deleteReport = async (id) => {
  const response = await API.delete(`/reports/${id}`);
  return response.data.data;
};
