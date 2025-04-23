import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Changed import

const NotificationBar = () => {
  const { user, isLoading } = useAuth(); // Now using useAuth

  const { data: apiResponse = { data: { count: 0 } } } = useQuery({
    queryKey: ['unread-notifications', user?._id],
    queryFn: async () => {
      if (!user?._id) return { data: { count: 0 } };
      
      try {
        const { data } = await axios.get('/api/notifications/unread-count', {
          withCredentials: true,
          
        });
        return data;
      } catch (error) {
        console.error('Error fetching unread count:', error);
        return { data: { count: 0 } }; // Fallback on error
      }
    },
    enabled: !!user?._id && !isLoading, // Added isLoading check
    refetchInterval: 60000,
    refetchOnWindowFocus: true // Added for better real-time updates
  });

  const unreadCount = apiResponse.data?.count || 0;

  if (isLoading) {
    return (
      <div className="relative">
        <BellIcon loading={true} />
      </div>
    );
  }

  return (
    <div className="relative">
      <Link
        to="/Notification" 
        className="flex items-center"
        aria-label={`${unreadCount} unread notifications`}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {Math.min(unreadCount, 99)}
          </span>
        )}
      </Link>
    </div>
  );
};

// Enhanced Bell Icon Component with loading state
const BellIcon = ({ loading = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-6 w-6 ${loading ? 'text-gray-400 animate-pulse' : 'text-gray-600 hover:text-blue-500 transition-colors'}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

export default NotificationBar;