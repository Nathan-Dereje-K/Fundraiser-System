import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { FaBell, FaCheckCircle, FaTimesCircle, FaTrash } from 'react-icons/fa';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    hasMore: true
  });
  const { user } = useAuth();

  // Fetch notifications with pagination
  const fetchNotifications = async (page = 1) => {
    try {
      const res = await fetch(
        `/api/notifications?page=${page}&limit=${pagination.limit}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      
      if (!res.ok) throw new Error(res.statusText);
      
      const data = await res.json();
      
      setNotifications(prev => 
        page === 1 ? data : [...prev, ...data]
      );
      setPagination(prev => ({
        ...prev,
        page,
        hasMore: data.length === prev.limit
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Mark as read handler
  const markAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setNotifications(prev => 
        prev.map(n => 
          n._id === id ? { ...n, read: true, readAt: new Date() } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  // Delete handler
  const deleteNotification = async (id) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setNotifications([]);
      setPagination(prev => ({ ...prev, page: 1, hasMore: true }));
    } catch (err) {
      console.error("Failed to clear all:", err);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FaBell className="mr-2" /> Notifications
        </h1>
        {notifications.length > 0 && (
          <button 
            onClick={clearAll} 
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notification => (
            <div 
              key={notification._id} 
              className={`p-4 rounded-lg border ${
                notification.read ? "bg-white" : "bg-blue-50"
              }`}
              onClick={() => !notification.read && markAsRead(notification._id)}
            >
              <div className="flex justify-between items-start">
                <p>{notification.message}</p>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification._id);
                    }}
                    className="text-gray-500 hover:text-red-500"
                    title="Delete notification"
                  >
                    <FaTrash />
                  </button>
                  {notification.read ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaTimesCircle className="text-gray-400" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
                {notification.readAt && (
                  <span> • Read at: {new Date(notification.readAt).toLocaleTimeString()}</span>
                )}
              </p>
            </div>
          ))}
          
          {pagination.hasMore && (
            <button 
              onClick={() => fetchNotifications(pagination.page + 1)}
              className="w-full mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;