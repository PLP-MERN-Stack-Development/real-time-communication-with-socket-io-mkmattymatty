// client/src/pages/Auth.jsx

import React, { useState } from 'react';
import { useChat } from "../context/ChatContext";

const Auth = () => {
  const [inputUsername, setInputUsername] = useState('');
  const { login } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      login(inputUsername.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-indigo-600">
          🚀 Join the Real-Time Chat
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-lg transition duration-150 ease-in-out shadow-sm"
            placeholder="Enter your username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            required
            minLength="3"
            maxLength="15"
          />
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
            disabled={!inputUsername.trim()}
          >
            Start Chatting
          </button>
        </form>
        <p className="text-sm text-center text-gray-500">
          Built with React & Socket.io for Week 5 Real-Time Communication.
        </p>
      </div>
    </div>
  );
};

export default Auth;