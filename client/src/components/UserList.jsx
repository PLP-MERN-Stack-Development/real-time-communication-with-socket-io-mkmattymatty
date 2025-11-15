// client/src/components/UserList.jsx (UPDATE for Unread Count Display)

import React from 'react';
import { useChat } from "../context/ChatContext";

const UnreadBadge = ({ count }) => (
    count > 0 ? (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
            {count > 99 ? '99+' : count}
        </span>
    ) : null
);

const UserList = () => {
  const { users, username: currentUsername, selectedUser, setSelectedUser, unreadCounts } = useChat();

  const handleSelectUser = (user) => {
    // If user is null, it's the global chat button
    if (!user || selectedUser?.id === user.id) {
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
    }
  };

  const globalUnreadCount = unreadCounts.global || 0;

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
      <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
        Online Users ({users.length})
      </h3>
      
      {/* Global Chat Button */}
      <button
        onClick={() => handleSelectUser(null)}
        className={`w-full flex items-center justify-between text-left p-3 rounded-lg transition duration-150 ease-in-out mb-4 ${
          selectedUser === null
            ? 'bg-indigo-600 font-semibold shadow-inner border border-indigo-500'
            : 'hover:bg-gray-700 bg-gray-700'
        }`}
      >
        <span># Global Chat</span>
        <UnreadBadge count={globalUnreadCount} />
      </button>

      <ul className="space-y-1 overflow-y-auto grow">
        {users
          .filter(user => user.username !== currentUsername)
          .sort((a, b) => a.username.localeCompare(b.username))
          .map((user) => {
            const userUnreadCount = unreadCounts[user.id] || 0;
            return (
              <li
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`flex items-center p-2 rounded-lg transition duration-150 ease-in-out cursor-pointer ${
                  selectedUser?.id === user.id
                    ? 'bg-purple-600 font-semibold' 
                    : 'hover:bg-gray-700'
                }`}
              >
                <div className="grow flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3 bg-green-400 border-2 border-white"></div>
                  <span className="truncate">{user.username}</span>
                </div>
                
                {selectedUser?.id === user.id && (
                  <span className="text-xs bg-white text-purple-600 rounded-full px-2 py-0.5 ml-2 font-bold">
                    DM
                  </span>
                )}
                
                <UnreadBadge count={userUnreadCount} />
              </li>
            );
          })}
      </ul>
      
      {/* Current User Info */}
      <div className='mt-auto pt-4 border-t border-gray-700'>
        <div className="flex items-center p-2 rounded-lg bg-indigo-600 font-semibold">
            <div className={`w-3 h-3 rounded-full mr-3 bg-green-400 border-2 border-white`}></div>
            <span className="truncate">{currentUsername} (You)</span>
        </div>
      </div>
    </div>
  );
};

export default UserList;