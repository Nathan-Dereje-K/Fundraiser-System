import API from "./api";

export const getTrasactOfUserForCampaign = async (id) => {
  const response = await API.get(`/transaction/campaign/${id}`);
  return response.data;
};
