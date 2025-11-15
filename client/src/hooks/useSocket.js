// client/src/hooks/useSocket.js (UPDATED & MOVED)

import { useEffect, useState, useCallback } from 'react';
import { socketInstance } from '../socket/socketInstance'; // Import instance

// Helper function to request and send browser notification
const sendBrowserNotification = (title, body) => {
    if (Notification.permission === 'granted') {
        new Notification(title, { body });
    }
};

// Custom hook for using socket.io
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socketInstance.connected);
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  // Pagination States
  const [totalMessages, setTotalMessages] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  
  // Sound Notifications Setup
  const messageSound = new Audio('/new-message.mp3'); 
  
  // Request notification permission on first load
  useEffect(() => {
      if (typeof Notification !== 'undefined' && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
          Notification.requestPermission();
      }
  }, []);

  // Fetch historical messages
  const fetchHistoricalMessages = useCallback(async (currentLoadedCount, limit = 20) => {
    if (!hasMoreMessages || isFetchingHistory) return;

    setIsFetchingHistory(true);
    try {
      const response = await fetch(`${socketInstance.io.uri}/api/messages?limit=${limit}&offset=${currentLoadedCount}`);
      const data = await response.json();
      
      const newMessages = data.messages.map(msg => ({
        ...msg,
        status: 'sent',
        content: msg.content,
        message: msg.content,
      }));

      setMessages(prev => [...newMessages, ...prev.filter(m => !m.isHistorical)]);
      setTotalMessages(data.total);
      setHasMoreMessages(data.hasMore);

      return newMessages.length; 
    } catch (error) {
      console.error('Error fetching message history:', error);
      setHasMoreMessages(false);
      return 0;
    } finally {
      setIsFetchingHistory(false);
    }
  }, [hasMoreMessages, isFetchingHistory]);

  // Connect/Disconnect logic
  const connect = useCallback((username) => {
    socketInstance.io.opts.query = { username }; // Set username as query param for reconnect
    socketInstance.connect();
    if (username) {
      socketInstance.emit('user_join', username);
    }
  }, []);

  const disconnect = useCallback(() => {
    socketInstance.disconnect();
  }, []);

  // Message Status Management (for Delivery Acknowledgment)
  const createPendingMessage = (message, isPrivate, recipientId = null) => {
    const tempId = Date.now();
    const pendingMessage = {
      id: tempId,
      tempId: tempId,
      content: message,
      message: message,
      sender: socketInstance.io.opts.query.username || 'You', // Use query username if available
      senderId: socketInstance.id,
      recipientId: recipientId,
      timestamp: new Date().toISOString(),
      isPrivate: isPrivate,
      status: 'pending',
    };
    setMessages(prev => [...prev, pendingMessage]);
    return pendingMessage;
  };

  const updateMessageStatus = (tempId, serverId, status) => {
    setMessages(prev => prev.map(msg => {
      if (msg.tempId === tempId) {
        return {
          ...msg,
          id: serverId || tempId,
          status: status,
        };
      }
      return msg;
    }));
  };

  // Send Message (Global)
  const sendMessage = useCallback((message) => {
    const pendingMessage = createPendingMessage(message, false);

    socketInstance.emit('send_message', { content: message, tempId: pendingMessage.tempId }, (serverId) => {
      if (serverId) {
        updateMessageStatus(pendingMessage.tempId, serverId, 'sent');
      } else {
        updateMessageStatus(pendingMessage.tempId, null, 'failed');
      }
    });
  }, []);

  // Send Private Message
  const sendPrivateMessage = useCallback((to, message) => {
    const pendingMessage = createPendingMessage(message, true, to);
    
    socketInstance.emit('private_message', { to, message: { content: message, tempId: pendingMessage.tempId } }, (serverId) => {
      if (serverId) {
        updateMessageStatus(pendingMessage.tempId, serverId, 'sent');
      } else {
        updateMessageStatus(pendingMessage.tempId, null, 'failed');
      }
    });
  }, []);

  // Set typing status
  const setTyping = useCallback((isTyping) => {
    socketInstance.emit('typing', isTyping);
  }, []);

  // Socket event listeners
  useEffect(() => {
    const handleNotification = (message) => {
        messageSound.play().catch(e => console.log("Sound failed to play:", e));

        if (!document.hasFocus()) {
            const title = message.isPrivate ? `New DM from ${message.sender}` : 'New Message in Global Chat';
            sendBrowserNotification(title, message.message);
        }
    };
    
    const onConnect = () => {
      setIsConnected(true);
      setMessages(prev => [...prev, { id: Date.now(), system: true, message: 'Connection established. Welcome back!', timestamp: new Date().toISOString() }]);
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setMessages(prev => [...prev, { id: Date.now(), system: true, message: 'Connection lost. Reconnecting...', timestamp: new Date().toISOString() }]);
    };
    
    const onReceiveMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => {
        if (prev.some(m => m.id === message.id && m.id !== undefined)) return prev;
        return [...prev, { ...message, status: 'sent', message: message.content || message.message }];
      });
      handleNotification(message);
    };

    const onPrivateMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => {
        if (prev.some(m => m.id === message.id && m.id !== undefined)) return prev;
        return [...prev, { ...message, status: 'sent', message: message.content || message.message }];
      });
      handleNotification(message);
    };
    
    const onUserList = (userList) => setUsers(userList);
    const onTypingUsers = (users) => setTypingUsers(users);

    const onUserJoined = (user) => {
      const systemMessage = { id: Date.now(), system: true, message: `${user.username} joined the chat`, timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, systemMessage]);
      sendBrowserNotification('User Status', `${user.username} joined the chat.`);
    };

    const onUserLeft = (user) => {
      const systemMessage = { id: Date.now(), system: true, message: `${user.username} left the chat`, timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, systemMessage]);
      sendBrowserNotification('User Status', `${user.username} left the chat.`);
    };

    // Register event listeners
    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    socketInstance.on('receive_message', onReceiveMessage);
    socketInstance.on('private_message', onPrivateMessage);
    socketInstance.on('user_list', onUserList);
    socketInstance.on('user_joined', onUserJoined);
    socketInstance.on('user_left', onUserLeft);
    socketInstance.on('typing_users', onTypingUsers);

    // Clean up event listeners
    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      socketInstance.off('receive_message', onReceiveMessage);
      socketInstance.off('private_message', onPrivateMessage);
      socketInstance.off('user_list', onUserList);
      socketInstance.off('user_joined', onUserJoined);
      socketInstance.off('user_left', onUserLeft);
      socketInstance.off('typing_users', onTypingUsers);
    };
  }, [messageSound, fetchHistoricalMessages]); // fetchHistoricalMessages added as dependency

  return {
    socket: socketInstance,
    isConnected,
    lastMessage,
    messages,
    users,
    typingUsers,
    totalMessages,
    hasMoreMessages,
    isFetchingHistory,
    fetchHistoricalMessages,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
  };
};