import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../api/notificationApi"; // Adjust the import path as needed

// Hook to fetch user notifications
export const useUserNotifications = (userId) => {
  return useQuery({
    queryKey: ["userNotifications", userId],
    queryFn: () => getUserNotifications(userId),
    staleTime: 1000 * 10, // Cache for 15 seconds
  });
};

// Hook to fetch unread notification count
export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["unreadCount"],
    queryFn: getUnreadCount,
    staleTime: 1000 * 60, // Cache for 1 minute
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};

// Hook to mark a single notification as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: (_, notificationId) => {
      queryClient.invalidateQueries(["userNotifications"]); // Refresh user notifications
      queryClient.invalidateQueries(["unreadCount"]); // Refresh unread count
    },
    onError: (error) => {
      console.error("Failed to mark notification as read:", error);
    },
  });
};

// Hook to mark all notifications as read
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["userNotifications"]); // Refresh user notifications
      queryClient.invalidateQueries(["unreadCount"]); // Refresh unread count
    },
    onError: (error) => {
      console.error("Failed to mark all notifications as read:", error);
    },
  });
};

// Hook to delete a notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: (_, notificationId) => {
      queryClient.invalidateQueries(["userNotifications"]); // Refresh user notifications
      queryClient.invalidateQueries(["unreadCount"]); // Refresh unread count
    },
    onError: (error) => {
      console.error("Failed to delete notification:", error);
    },
  });
};
