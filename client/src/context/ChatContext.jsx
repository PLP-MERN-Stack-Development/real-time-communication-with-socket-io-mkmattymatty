// client/src/context/ChatContext.jsx (UPDATED & MOVED)

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket'; // Import the hook
import { socketInstance } from '../socket/socketInstance'; // Import instance for convenience

// Create a context
const ChatContext = createContext();

// Custom hook to use the chat context
export const useChat = () => {
  return useContext(ChatContext);
};

// Provider component
export const ChatProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); 
  // NEW STATE: { global: 0, [userId]: 0, ... }
  const [unreadCounts, setUnreadCounts] = useState({ global: 0 });
  
  const socketData = useSocket();
  const { messages: socketMessages, sendMessage: socketSendMessage, sendPrivateMessage: socketSendPrivateMessage } = socketData; 
  
  // --- High-level functions for components ---
  
  const login = (name) => {
    if (name) {
      setUsername(name);
      socketData.connect(name);
      setIsLoggedIn(true);
      setSelectedUser(null);
      setUnreadCounts({ global: 0 });
    }
  };

  const logout = () => {
    socketData.disconnect();
    setUsername('');
    setIsLoggedIn(false);
    setSelectedUser(null);
    setUnreadCounts({ global: 0 });
  };
  
  // Simplified Send Functions (using the socket hook's internal logic)
  const sendMessage = (message) => socketSendMessage(message);
  const sendPrivateMessage = (to, message) => socketSendPrivateMessage(to, message);

  // EFFECT: Handle updating unread counts when a new message arrives
  useEffect(() => {
    const message = socketData.lastMessage;

    if (message && message.sender !== username && !message.system) {
        const chatKey = message.isPrivate 
            ? message.senderId
            : 'global';

        const isViewingChat = (chatKey === 'global' && selectedUser === null) ||
                              (message.isPrivate && selectedUser?.id === message.senderId);

        if (!isViewingChat) {
            setUnreadCounts(prev => ({
                ...prev,
                [chatKey]: (prev[chatKey] || 0) + 1,
            }));
        }
    }
  }, [socketData.lastMessage, username, selectedUser]);


  // EFFECT: Handle clearing unread counts when the selected chat changes
  useEffect(() => {
    const keyToClear = selectedUser ? selectedUser.id : 'global';
    
    setUnreadCounts(prev => {
        if (prev[keyToClear] > 0) {
            return {
                ...prev,
                [keyToClear]: 0,
            };
        }
        return prev;
    });
  }, [selectedUser]);


  // The value exposed by the context
  const value = {
    ...socketData,
    socket: socketInstance,
    username,
    isLoggedIn,
    selectedUser,
    setSelectedUser,
    unreadCounts,
    messages: socketMessages, // Expose messages from hook
    sendMessage,
    sendPrivateMessage,
    login,
    logout,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};