import API from "./api";

//get user notifications
export const getUserNotifications = async (id) => {
  const response = await API.get(`/notifications/user/${id}`);
  return response.data.data;
};

export const getUnreadCount = async () => {
  const response = await API.get("/notifications/unread-count");
  return response.data.data;
};

export const markAsRead = async (id) => {
  const response = await API.patch(`/notifications/${id}/read`);
  return response.data.data;
};

export const markAllAsRead = async () => {
  const response = await API.patch(`/notifications/readall`);
  return response.data.data;
};

export const deleteNotification = async (id) => {
  const response = await API.delete(`/notifications/${id}`);
  return response.data.data;
};
