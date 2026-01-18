// ============================================
// FILE: frontend/user/src/services/socketService.js
// ============================================
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.connected = true;
      this.socket.emit('user_online');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit:', event);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Message events
  joinConversation(conversationId) {
    this.emit('join_conversation', conversationId);
  }

  leaveConversation(conversationId) {
    this.emit('leave_conversation', conversationId);
  }

  sendMessage(data) {
    this.emit('send_message', data);
  }

  sendTyping(data) {
    this.emit('typing', data);
  }

  sendStopTyping(data) {
    this.emit('stop_typing', data);
  }

  markAsRead(data) {
    this.emit('mark_read', data);
  }

  // Listeners
  onNewMessage(callback) {
    this.on('new_message', callback);
  }

  onMessageSent(callback) {
    this.on('message_sent', callback);
  }

  onUserTyping(callback) {
    this.on('user_typing', callback);
  }

  onUserStopTyping(callback) {
    this.on('user_stop_typing', callback);
  }

  onMessagesRead(callback) {
    this.on('messages_read', callback);
  }

  onUserStatusChange(callback) {
    this.on('user_status_change', callback);
  }

  // Remove listeners
  removeNewMessageListener(callback) {
    this.off('new_message', callback);
  }

  removeMessageSentListener(callback) {
    this.off('message_sent', callback);
  }

  removeTypingListener(callback) {
    this.off('user_typing', callback);
  }

  removeStopTypingListener(callback) {
    this.off('user_stop_typing', callback);
  }

  removeMessagesReadListener(callback) {
    this.off('messages_read', callback);
  }

  removeUserStatusListener(callback) {
    this.off('user_status_change', callback);
  }

  isConnected() {
    return this.connected && this.socket?.connected;
  }
}

export default new SocketService();