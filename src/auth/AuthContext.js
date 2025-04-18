import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { io } from 'socket.io-client';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'connecting', 'connected', 'error'

  // Initialize socket with recovery and auth
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      withCredentials: true,
      autoConnect: false,
      reconnectionAttempts: 3,
      reconnectionDelay: 5000,
      transports: ['websocket'],
      auth: (cb) => {
        cb({ token: localStorage.getItem('token') })
      }
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Socket connected');
      setConnectionStatus('connected');
      if (user?._id) {
        newSocket.emit('authenticate', user._id);
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setConnectionStatus('disconnected');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setConnectionStatus('error');
      setTimeout(() => newSocket.connect(), 5000);
    });

    setSocket(newSocket);
    newSocket.connect(); // Start connection immediately

    return () => {
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.off('connect_error');
      newSocket.disconnect();
    };
  }, []);

  // Handle authentication
  const login = async (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    
    if (socket) {
      socket.emit('authenticate', userData._id);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    socket?.emit('unauthorize');
    setUser(null);
  };

  // Memoized context value
  const contextValue = useMemo(() => ({
    user,
    socket,
    connectionStatus,
    login,
    logout,
    isAuthenticated: !!user,
  }), [user, socket, connectionStatus]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}