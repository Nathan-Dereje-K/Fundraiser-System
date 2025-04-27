import API from "./api";

export const releaseMoney = async (id) => {
  const response = await API.post(`/release/releasemoney/${id}`);
  return response.data;
};

export const suspendAndReallocate = async ({ id, allocations }) => {
  const response = await API.post(`/release/suspendreallocate`, {
    suspendedCampaignId: id,
    allocations,
  });
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
