/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import { useCurrentUser } from "../hooks/useUsers";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { data, isLoading } = useCurrentUser();

  useEffect(() => {
    if (data) setUser(data);
  }, [data]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const { user, isLoading } = useContext(UserContext);
  return { user, isLoading };
};
