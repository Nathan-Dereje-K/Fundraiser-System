import API from "./api";

export const fetchUsers = async ({ queryKey }) => {
  const [, page, limit] = queryKey;
  const { data } = await API.get(`/users?page=${page}&limit=${limit}`);
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await API.get("/users/me");
  return data;
};

export const updateUser = async ({ userId, userData }) => {
  const response = await API.put(`/users/${userId}`, userData);
  return response.data;
};
