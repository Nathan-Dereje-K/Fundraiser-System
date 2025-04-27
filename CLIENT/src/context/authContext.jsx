import { createContext, useState, useEffect } from "react";
import { useFetchLoggedUser } from "../hooks/useAuth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data, isPending: isLoading } = useFetchLoggedUser();

  useEffect(() => {
    if (data) {
      setUser(data.user);
      setIsLoggedIn(data.loggedIn);
    }
  }, [data, isLoading]);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
