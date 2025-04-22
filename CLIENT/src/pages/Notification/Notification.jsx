import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { useUser } from '../../context/UserContext';
import { Link } from 'react-router-dom';

const NotificationPage = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Fetch notifications (with read status support)
  const { data: apiResponse = { data: { notifications: [] } } } = useQuery({
    queryKey: ['notifications', user?._id],
    queryFn: async () => {
      console.log('Fetching notifications for user:', user?._id); // Debug log
      if (!user?._id) {
        console.log('No user ID - returning empty array');
        return { data: { notifications: [] } };
      }
      
      try {
        const { data } = await axios.get(`/api/notifications/user/${user._id}`, {
          withCredentials: true,
        });
        console.log('API Response:', data); // Debug log
        return data;
      } catch (error) {
        console.error('Notification fetch error:', error);
        return { data: { notifications: [] } };
      }
    },
    enabled: !!user?._id,
  });

  const notifications = apiResponse.data?.notifications || [];

  // Mark as read mutation (now properly uses read field)
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId) => {
      await axios.patch(`/api/notifications/${notificationId}/read`, {}, {
        withCredentials: true,
      });
    },
    onMutate: async (notificationId) => {
      // Optimistic update
      queryClient.setQueryData(['notifications', user?._id], (old) => ({
        ...old,
        data: {
          ...old.data,
          notifications: old.data.notifications.map(n => 
            n._id === notificationId ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, old.data.unreadCount - 1),
        },
      }));
    },
  });

  // Group by date
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const date = format(new Date(notification.createdAt), 'MMMM d, yyyy');
    if (!acc[date]) acc[date] = [];
    acc[date].push(notification);
    return acc;
  }, {});

  if (!user) return <div className="p-4">Please log in</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {apiResponse.data?.unreadCount > 0 && (
          <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
            {apiResponse.data.unreadCount} unread
          </span>
        )}
      </div>

      {Object.entries(groupedNotifications).map(([date, dayNotifications]) => (
        <div key={date} className="mb-8">
          <h2 className="text-gray-500 text-sm mb-3">{date}</h2>
          <div className="space-y-2">
            {dayNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  !notification.read
                    ? 'bg-blue-50 border-blue-200 font-medium'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => !notification.read && markAsReadMutation.mutate(notification._id)}
              >
                <div className="flex justify-between">
                  <p>{notification.message}</p>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                    <span className="text-xs text-gray-500">
                      {format(new Date(notification.createdAt), 'h:mm a')}
                    </span>
                  </div>
                </div>
                {notification.campaignId && (
                  <Link
                    to={`/campaigns/${notification.campaignId._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-block text-blue-500 text-sm mt-1 hover:underline"
                  >
                    View Campaign
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {notifications.length === 0 && (
        <p className="text-gray-500 text-center py-8">No notifications found</p>
      )}
    </div>
  );
};

export default NotificationPage;