import { createContext, useState, useEffect } from "react";
import { useFetchLoggedUser } from "../hooks/useAuth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { data, isLoading } = useFetchLoggedUser();

  useEffect(() => {
    if (data) setUser(data.user);
  }, [data]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
