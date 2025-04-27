import API from "./api";

export const getCampaigns = async (search) => {
  console.log(search);

  const response = await API.get(`/campaigns?search=${search}`);
  return response.data.data;
};

export const getCampaign = async (id) => {
  const response = await API.get(`/campaigns/${id}`);
  return response.data.data;
};

export const getCategoryCampaign = async (category, status = "approved") => {
  const response = await API.get("/campaigns", {
    params: {
      category: category.toLowerCase(),
      status,
    },
  });
  return response.data.data;
};

export const getPendingCampaigns = async () => {
  const response = await API.get("/campaigns", {
    params: { status: "pending" },
  });
  return response.data.data;
};

export const postCampaign = async (formData) => {
  const response = await API.post("/campaigns", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

export const putCampaign = async ({ id, ...campaignData }) => {
  const response = await API.put(`/campaigns/${id}`, campaignData);
  return response.data.data;
};

export const deleteCampaign = async (id) => {
  const response = await API.delete(`/campaigns/${id}`);
  return response.data.data;
};

export const getMyCampaigns = async (userId) => {
  const response = await API.get("/campaigns/me", {
    params: { userId },
  });
  return response.data.data;
};

export const searchCampaigns = async (search) => {
  if (!search || search.length < 2) return [];
  const response = await API.get(`/campaigns/search?q=${search}`, {
    params: { search },
  });
  return response.data.data;
};

export const doesUserOwnCampaign = async (status) => {
  const response = await API.get(
    `/campaigns/userhavecampaign?status=${status}`
  );
  return response.data.data;
};
