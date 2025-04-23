import API from "./api";

export const getTrasactOfUserForCampaign = async (id) => {
  const response = await API.get(`/transaction/campaign/user/${id}`);
  return response.data;
};

export const getTrasactOfUser = async (id) => {
  const response = await API.get(`/transaction/user/${id}`);
  return response.data;
};

export const getTrasactOfCampaign = async (id) => {
  const response = await API.get(`/transaction/campaign/${id}`);
  console.log(response.data);

  return response.data;
};
