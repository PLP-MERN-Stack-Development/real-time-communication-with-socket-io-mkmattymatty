// client/src/pages/Chat.jsx (FINAL UPDATE for Task 5: Responsive Design)

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { useChat } from "../context/ChatContext";
import MessageInput from '../components/MessageInput';
import ChatMessage from '../components/ChatMessage';
import UserList from '../components/UserList';

const Chat = () => {
  const { 
    messages, typingUsers, username, isConnected, logout, 
    selectedUser, hasMoreMessages, isFetchingHistory, fetchHistoricalMessages 
  } = useChat();
  
  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); 
  
  // NEW STATE: Control UserList visibility on mobile
  const [isUserListOpen, setIsUserListOpen] = useState(false); 

  // --- Filtering and Loading Logic remains the same (omitted for brevity) ---
  const filteredMessages = useMemo(() => {
    // 1. Filter by Global/Private Chat
    let currentChatMessages;
    if (selectedUser) {
      currentChatMessages = messages.filter(
        (msg) => 
          msg.isPrivate && 
          ((msg.senderId === selectedUser.id) || (msg.recipientId === selectedUser.id)) 
      );
    } else {
      currentChatMessages = messages.filter((msg) => !msg.isPrivate);
    }

    // 2. Filter by Search Query
    if (!searchQuery.trim()) {
      return currentChatMessages; 
    }

    const query = searchQuery.toLowerCase().trim();
    
    return currentChatMessages.filter(msg => {
      if (msg.system) return true; 
      const senderMatch = msg.sender.toLowerCase().includes(query);
      const contentMatch = msg.message.toLowerCase().includes(query); 
      return senderMatch || contentMatch;
    });

  }, [messages, selectedUser, searchQuery]);

  const currentMessageCount = filteredMessages.filter(m => !m.system).length;

  const loadMore = useCallback(() => {
    const oldScrollHeight = scrollRef.current.scrollHeight;
    
    fetchHistoricalMessages(currentMessageCount).then((newCount) => {
        if (newCount > 0 && scrollRef.current) {
            const newScrollHeight = scrollRef.current.scrollHeight;
            scrollRef.current.scrollTop = newScrollHeight - oldScrollHeight;
        }
    });
  }, [currentMessageCount, fetchHistoricalMessages]);
  
  // --- Effects remain the same (omitted for brevity) ---
  useEffect(() => {
    if (initialLoad && username) {
        fetchHistoricalMessages(0); 
        setInitialLoad(false);
    }
  }, [username, initialLoad, fetchHistoricalMessages]);

  useEffect(() => {
    const lastMessage = filteredMessages[filteredMessages.length - 1];
    const shouldScrollToBottom = initialLoad || lastMessage?.sender === username || lastMessage?.system || lastMessage?.sender === 'You';

    if (shouldScrollToBottom && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: initialLoad ? 'auto' : 'smooth' });
    }
  }, [filteredMessages, username, initialLoad]);
  
  // Close UserList when a private chat is selected on mobile
  useEffect(() => {
      if (selectedUser !== null) {
          setIsUserListOpen(false);
      }
  }, [selectedUser]);


  const typingMessage = (selectedUser === null && typingUsers.length > 0)
    ? `${typingUsers.join(', ')} ${typingUsers.length > 1 ? 'are' : 'is'} typing...`
    : '';
    
  const chatTitle = selectedUser 
    ? `Private Chat with ${selectedUser.username}` 
    : 'Global Chat Room';
    
  // --- RENDER ---
  return (
    <div className="flex h-screen antialiased text-gray-800">
      
      {/* UserList Component: Conditional rendering and fixed positioning for mobile */}
      <div className={`absolute inset-y-0 left-0 z-20 transition-transform duration-300 transform md:relative md:translate-x-0 ${isUserListOpen ? 'translate-x-0' : '-translate-x-full'} md:flex`}>
          <UserList />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 z-10">
        
        {/* Header (Added Mobile Toggle Button) */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-md">
          <div className='flex items-center'>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsUserListOpen(!isUserListOpen)}
                className="p-2 mr-3 text-indigo-600 md:hidden rounded-lg hover:bg-gray-100"
                aria-label="Toggle user list"
            >
                {isUserListOpen ? '⬅️' : '👥'}
            </button>
            <h1 className="text-xl font-bold text-indigo-600">
                {chatTitle} {isConnected ? '🟢' : '🔴'}
            </h1>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-150"
          >
            Logout
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
          <input
            type="text"
            placeholder={`Search ${selectedUser ? selectedUser.username : 'Global'} chat...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Message Area */}
        <div ref={scrollRef} className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
          
          {/* Load More Button */}
          {selectedUser === null && hasMoreMessages && !searchQuery.trim() && (
            <div className="text-center py-2">
              <button
                onClick={loadMore}
                disabled={isFetchingHistory}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 disabled:opacity-50 transition duration-150"
              >
                {isFetchingHistory ? 'Loading...' : 'Load Older Messages'}
              </button>
            </div>
          )}
          
          {filteredMessages.length === 0 && searchQuery.trim() && (
            <div className="text-center py-4 text-gray-500 italic">
                No results found for "{searchQuery}".
            </div>
          )}
          
          {filteredMessages.map((msg) => (
            <ChatMessage
              key={msg.id || msg.tempId}
              message={msg}
              currentUsername={username}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing Indicator */}
        <div className="p-2 text-sm text-gray-500 bg-gray-100 italic min-h-8">
          {typingMessage}
        </div>

        {/* Message Input */}
        <MessageInput />
      </div>
      
      {/* Overlay to close UserList when clicking outside on mobile */}
      {isUserListOpen && (
          <div 
              className="absolute inset-0 bg-black opacity-50 z-10 md:hidden" 
              onClick={() => setIsUserListOpen(false)}
          />
      )}
      
    </div>
  );
};

export default Chat;