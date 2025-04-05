import API from "./api";

export const getCampaigns = async () => {
  const response = await API.get("/campaigns");
  return response.data.data;
};

export const getCampaign = async (id) => {
  const response = await API.get(`/campaigns/${id}`);
  return response.data.data;
};

export const postCampaign = async (campaignData) => {
  const response = await API.post("/campaigns", campaignData);
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
