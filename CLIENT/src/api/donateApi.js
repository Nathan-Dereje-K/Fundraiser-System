import API from "./api";

export const initiatePayment = async ({ campaignId, amount }) => {
  const response = await API.post("/donate/initiatepayment", {
    campaignId,
    amount,
  });
  return response.data;
};

export const initiateToken = async () => {
  const response = await API.get("/donate/initiatetoken");
  return response.data.clientToken.clientToken;
};

export const processPayment = async ({ nonce, amount, campaignId }) => {
  const response = await API.post("/donate/processpayment", {
    nonce,
    amount,
    campaignId,
  });
  return response.data;
};

export const getTranStatusBraintree = async (id) => {
  const response = await API.get(`/donate/gettransactionstatus/${id}`);
  return response.data;
};

export const getTranStatusChapa = async (id) => {
  const response = await API.get(`/donate/gettransactionstatuschapa/${id}`);
  return response.data;
};
