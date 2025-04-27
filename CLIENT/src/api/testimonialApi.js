import API from "./api";

export const postTestimonial = async (formData) => {
  const response = await API.post("/testimonial", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.report;
};

export const getAllTestimonials = async () => {
  const response = await API.get("/testimonial");
  return response.data.data;
};

export const deleteTestimonial = async (id) => {
  const response = await API.delete(`/testimonial/${id}`);
  return response.data.data;
};
