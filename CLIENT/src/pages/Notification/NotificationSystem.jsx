import React, { useState } from "react";
import { Trash2, CircleCheckIcon, Bell } from "lucide-react";
import {
  useUserNotifications,
  useDeleteNotification,
  useMarkAllAsRead,
  useMarkAsRead,
} from "../../hooks/useNotifications";
const NotificationSystem = ({ userId, isLoading }) => {
  // State to manage notifications
  const { data } = useUserNotifications(userId);
  const notifications = data?.notifications || [];
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const { mutate: deleteNotificationMutation, isPending: deletePending } =
    useDeleteNotification();

  // State to toggle the visibility of the notification panel
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = data?.unreadCount || 0;

  // Function to mark a notification as read
  const markAsRead = (id) => {
    markAsReadMutation.mutate(id);
  };

  // Function to delete a notification
  const deleteNotification = (id) => {
    deleteNotificationMutation(id);
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="relative">
        <BellIcon loading={true} />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Notification Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full cursor-pointer"
        aria-label={`${unreadCount} unread notifications`}
      >
        <Bell />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {Math.min(unreadCount, 99)}
          </span>
        )}
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-10">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <button
              className="text-sm text-blue-500 hover:underline"
              onClick={markAllAsRead}
            >
              Mark All as Read
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex justify-between items-center p-4 ${
                    !notification.read
                      ? "bg-white"
                      : "bg-gray-100 text-gray-600"
                  } border-b border-gray-200`}
                >
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <div
                      dangerouslySetInnerHTML={{ __html: notification.link }}
                    />
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read && (
                      <button
                        className="text-gray-500 hover:text-green-500 transition-colors"
                        onClick={() => markAsRead(notification.id)}
                        title="Mark as Read"
                      >
                        <CircleCheckIcon className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      className="text-gray-500 hover:text-red-500 transition-colors"
                      onClick={() => deleteNotification(notification.id)}
                      title="Delete"
                      disabled={deletePending}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No notifications available.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
