// client/src/components/ChatMessage.jsx (UPDATE for Task 5: Delivery Acknowledgment)

import React from 'react';

const ChatMessage = ({ message, currentUsername }) => {
  const isMine = message.sender === currentUsername || message.sender === 'You'; // Use 'You' fallback for pending messages

  // System message for join/leave notifications (Task 4)
  if (message.system) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full italic">
          {message.message}
        </span>
      </div>
    );
  }

  // Regular chat message
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`flex mb-4 ${
        isMine ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-xl shadow-md ${
          isMine
            ? 'bg-indigo-500 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
        }`}
      >
        {!isMine && (
          <div className="font-bold text-sm mb-1">
            {message.sender}
          </div>
        )}
        <p className="text-base wrap-break-words">{message.message}</p>
        <div
          className={`text-xs mt-1 flex justify-end items-center ${
            isMine ? 'text-indigo-200' : 'text-gray-500'
          }`}
        >
          {time}
          
          {/* Status Indicator (Task 5: Delivery Acknowledgment) */}
          {isMine && message.status === 'pending' && (
            <span className="ml-2 text-yellow-300">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v.01M12 20v.01M4 12h.01M20 12h.01M6.34 6.34l-.01.01M17.65 17.65l-.01-.01M6.34 17.65l-.01-.01M17.65 6.34l-.01-.01"></path></svg>
            </span>
          )}
          {isMine && message.status === 'failed' && (
            <span className="ml-2 text-red-400 font-bold">
              !
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;