import API from "./api";

export const getCampaigns = async () => {
  const response = await API.get("/campaigns");
  return response.data;
};

export const getCampaign = async (id) => {
  const response = await API.get(`/campaigns/${id}`);
  return response.data.data;
};
