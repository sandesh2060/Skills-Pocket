// ============================================
// FILE: frontend/user/src/services/socketService.js
// Real-time messaging with Socket.io
// ============================================
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(token) {
    if (this.socket?.connected) {
      console.log('⚠️ Socket already connected');
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    console.log('🔌 Connecting to socket server:', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupListeners();
  }

  setupListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.reconnectAttempts = 0;
      window.dispatchEvent(new CustomEvent('socket:connected'));
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      window.dispatchEvent(new CustomEvent('socket:disconnected', { detail: { reason } }));
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        window.dispatchEvent(new CustomEvent('socket:maxReconnectFailed', {
          detail: { message: 'Unable to connect to messaging server. Please check your connection.' }
        }));
      }
    });

    // Message events
    this.socket.on('message:new', (data) => {
      console.log('📨 New message received:', data);
      window.dispatchEvent(new CustomEvent('socket:newMessage', { detail: data }));
    });

    this.socket.on('message:read', (data) => {
      console.log('✓ Message read:', data);
      window.dispatchEvent(new CustomEvent('socket:messageRead', { detail: data }));
    });

    // Typing events
    this.socket.on('typing:start', (data) => {
      window.dispatchEvent(new CustomEvent('socket:typingStart', { detail: data }));
    });

    this.socket.on('typing:stop', (data) => {
      window.dispatchEvent(new CustomEvent('socket:typingStop', { detail: data }));
    });

    // User status events
    this.socket.on('user:online', (data) => {
      window.dispatchEvent(new CustomEvent('socket:userOnline', { detail: data }));
    });

    this.socket.on('user:offline', (data) => {
      window.dispatchEvent(new CustomEvent('socket:userOffline', { detail: data }));
    });
  }

  // Emit events
  sendMessage(data) {
    if (this.socket?.connected) {
      this.socket.emit('message:send', data);
    }
  }

  startTyping(conversationId) {
    if (this.socket?.connected) {
      this.socket.emit('typing:start', { conversationId });
    }
  }

  stopTyping(conversationId) {
    if (this.socket?.connected) {
      this.socket.emit('typing:stop', { conversationId });
    }
  }

  markAsRead(conversationId) {
    if (this.socket?.connected) {
      this.socket.emit('message:read', { conversationId });
    }
  }

  // Join/leave conversation rooms
  joinConversation(conversationId) {
    if (this.socket?.connected) {
      this.socket.emit('conversation:join', { conversationId });
    }
  }

  leaveConversation(conversationId) {
    if (this.socket?.connected) {
      this.socket.emit('conversation:leave', { conversationId });
    }
  }

  // Custom event listeners
  on(event, callback) {
    const handler = (e) => callback(e.detail);
    this.listeners.set(event, handler);
    window.addEventListener(`socket:${event}`, handler);
  }

  off(event) {
    const handler = this.listeners.get(event);
    if (handler) {
      window.removeEventListener(`socket:${event}`, handler);
      this.listeners.delete(event);
    }
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  // Check connection status
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Create singleton instance
export const socketService = new SocketService();
export default socketService;