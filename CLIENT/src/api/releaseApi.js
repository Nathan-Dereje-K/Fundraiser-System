import API from "./api";

export const releaseMoney = async (id) => {
  const response = await API.post(`/release/releasemoney/${id}`);
  return response.data;
};

export const suspendCampaign = async (id) => {
  const response = await API.post(`/release/suspendcampaign/${id}`);
  return response.data;
};

export const withdrawMoney = async ({ account_number, amount, bank_code }) => {
  const response = await API.post(`/release/withdraw`, {
    account_number,
    amount,
    bank_code,
  });
  return response.data;
};
