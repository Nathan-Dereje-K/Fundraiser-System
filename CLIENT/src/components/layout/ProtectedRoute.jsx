import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loader } from "lucide-react";
import { useEffect } from "react";

function ProtectedRoute({ allowedRoles, children }) {
  const { user, isLoading, isLoggedIn } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 items-center justify-center">
        <Loader size={80} color="text-blue-500" />
      </div>
    );
  } else if (user && !isLoggedIn) {
    return <Navigate to="/signin" replace />;
  } else if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}

export default ProtectedRoute;
