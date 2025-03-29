/* eslint-disable react/prop-types */
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="flex pt-16">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onCollapse={setIsSidebarCollapsed}
        />
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarCollapsed ? "ml-14" : "ml-56"
          } py-6 px-4 sm:px-6 lg:px-8`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
