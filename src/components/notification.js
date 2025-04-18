// src/components/NavbarNotification.js
import React from "react";
import useNotificationStore from "../store/useNotificationStore";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavbarNotification = () => {
  const { notifications } = useNotificationStore();
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  return (
    <div className="relative">
      <button
        onClick={handleNotificationClick}
        className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative dark:text-gray-200 dark:hover:text-white"
        aria-label="Notifications"
      >
        <FaBell size={20} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>
    </div>
  );
};

export default NavbarNotification;