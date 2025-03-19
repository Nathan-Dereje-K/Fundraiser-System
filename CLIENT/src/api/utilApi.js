import API from "./api";

export const getSignature = async () => {
  const { data } = await API.get("/util/get-signature");
  return data;
};
