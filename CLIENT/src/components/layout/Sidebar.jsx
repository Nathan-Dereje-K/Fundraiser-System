/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  Home,
  User,
  Users,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Wallet,
  LayoutDashboard,
  MessageSquare,
  Calendar,
  FolderKanban,
  UserCircle,
  UsersRound,
  Flag,
} from "lucide-react";
import Avatar from "../ui/Avatar";

const Sidebar = ({ isCollapsed, onCollapse }) => {
  const location = useLocation();
  const { user: currentUser } = useUser();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/", icon: Home, label: "Home" },
    // { path: "/tracks", icon: FolderKanban, label: "Tracks" },
    // { path: "/problems", icon: Flag, label: "Problems" },
    // { path: "/contests", icon: Calendar, label: "Contests" },
    // { path: "/roadmap", icon: LayoutDashboard, label: "Roadmap" },
    // { path: "/users", icon: Users, label: "Users" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/withdraw", icon: Wallet, label: "Withdraw" },
    // { path: "/forum", icon: MessageSquare, label: "Forum" },
    // { path: "/sessions", icon: Calendar, label: "Sessions" },
  ];

  return (
    <div
      className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-14" : "w-56"}
      `}
    >
      <div className="flex flex-col h-full">
        {/* User Profile Section */}
        <div
          className={`p-3 border-b border-gray-200 ${
            isCollapsed ? "flex flex-col" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar
                src={currentUser?.avatar || null} // '' for typescript,
                alt={currentUser?.name || ""}
                size={isCollapsed ? "sm" : "md"}
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser?.role}
                  </p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={() => onCollapse(true)}
                className="flex items-center justify-center border-none rounded-full text-gray-400 hover:text-gray-600 hover:bg-orange-100 h-10 w-10 transition-colors"
              >
                <ChevronsLeft className="h-5 w-5" />
              </button>
            )}
          </div>

          {isCollapsed && (
            <button
              onClick={() => onCollapse(false)}
              className="flex justify-center items-center mt-1 h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-orange-100 border-none rounded-full transition-colors"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-2 py-3">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-2 py-2 text-sm font-medium rounded-md
                    transition-colors duration-200
                    ${
                      isActive(item.path)
                        ? "bg-green-50 text-green-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                    ${isCollapsed ? "justify-center" : "justify-start"}
                  `}
                >
                  <item.icon
                    className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
