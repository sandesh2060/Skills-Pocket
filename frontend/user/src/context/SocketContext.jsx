// ============================================
// FILE: frontend/user/src/context/SocketContext.jsx
// ============================================
import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { socketService } from '../services/socketService';
import { toast } from 'react-hot-toast';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, token, isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const connectionAttempted = useRef(false);
  const reconnectToastId = useRef(null);

  // Connect to socket when user is authenticated
  useEffect(() => {
    if (isAuthenticated && token && !connectionAttempted.current) {
      connectionAttempted.current = true;
      console.log('🔌 Initiating socket connection...');
      
      socketService.connect(token);
      
      // Set up connection status listeners
      const checkConnection = setInterval(() => {
        const isConnected = socketService.isConnected();
        setConnected(isConnected);
        
        if (isConnected && reconnectToastId.current) {
          toast.dismiss(reconnectToastId.current);
          toast.success('Connected to real-time messaging');
          reconnectToastId.current = null;
        }
      }, 1000);

      return () => {
        clearInterval(checkConnection);
      };
    } else if (!isAuthenticated && connectionAttempted.current) {
      // Disconnect when user logs out
      console.log('🔌 Disconnecting socket (user logged out)...');
      socketService.disconnect();
      connectionAttempted.current = false;
      setConnected(false);
    }
  }, [isAuthenticated, token]);

  // Listen for socket reconnection events
  useEffect(() => {
    const handleMaxReconnectFailed = (event) => {
      setReconnecting(false);
      reconnectToastId.current = toast.error(
        event.detail.message || 'Unable to connect to messaging server',
        { duration: 10000 }
      );
    };

    const handleReconnectFailed = (event) => {
      setReconnecting(false);
      reconnectToastId.current = toast.error(
        event.detail.message || 'Connection lost',
        { duration: 10000 }
      );
    };

    window.addEventListener('socket:maxReconnectFailed', handleMaxReconnectFailed);
    window.addEventListener('socket:reconnectFailed', handleReconnectFailed);

    return () => {
      window.removeEventListener('socket:maxReconnectFailed', handleMaxReconnectFailed);
      window.removeEventListener('socket:reconnectFailed', handleReconnectFailed);
    };
  }, []);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    if (isAuthenticated && token) {
      console.log('🔄 Manual reconnection attempt...');
      socketService.disconnect();
      connectionAttempted.current = false;
      setTimeout(() => {
        connectionAttempted.current = true;
        socketService.connect(token);
      }, 500);
    }
  }, [isAuthenticated, token]);

  const value = {
    socket: socketService,
    connected,
    reconnecting,
    reconnect,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};