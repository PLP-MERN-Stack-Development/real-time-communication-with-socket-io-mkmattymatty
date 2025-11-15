// client/src/components/MessageInput.jsx (UPDATED)

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from "../context/ChatContext";

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, sendPrivateMessage, setTyping, selectedUser } = useChat(); // Added selectedUser
  const typingTimerRef = useRef(null);

  const TYPING_TIMEOUT = 3000; // 3 seconds

  // Typing logic remains the same (assumes typing is only sent for global chat for simplicity)
  const handleTypingStart = () => {
    // Only send typing events if in global chat
    if (selectedUser !== null) return; 

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    
    setTyping(true);

    typingTimerRef.current = setTimeout(() => {
      setTyping(false);
    }, TYPING_TIMEOUT);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    handleTypingStart();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      if (selectedUser) {
        // Task 3: Send Private Message
        sendPrivateMessage(selectedUser.id, message.trim());
      } else {
        // Task 2: Send Global Message
        sendMessage(message.trim());
      }
      
      setMessage('');
      
      // Stop typing immediately
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      setTyping(false);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      setTyping(false);
    };
  }, [setTyping]);

  const placeholder = selectedUser 
    ? `Messaging ${selectedUser.username}...` 
    : 'Type a global message...';

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200 flex items-center shadow-lg">
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        className="grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg transition duration-150"
        placeholder={placeholder}
        autoFocus
      />
      <button
        type="submit"
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-r-lg hover:bg-indigo-700 transition duration-150 ease-in-out disabled:opacity-50"
        disabled={!message.trim()}
      >
        {selectedUser ? 'Send DM ✉️' : 'Send 📤'}
      </button>
    </form>
  );
};

export default MessageInput;