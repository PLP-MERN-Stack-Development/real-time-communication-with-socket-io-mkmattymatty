// client/src/App.jsx (CORRECTED CODE)

import React from 'react';
import { useChat } from "./context/ChatContext"; // Imports the hook only
import Auth from './pages/Auth';
import Chat from './pages/Chat';

const App = () => {
  // Use the useChat hook directly inside the App component
  const { isLoggedIn } = useChat();
  
  // The ChatProvider (formerly SocketProvider) is now in main.jsx,
  // so we just return the appropriate content based on login status.
  return (
    // Wrap the entire app in a div to ensure the h-screen style applies
    <div className="h-screen">
      {isLoggedIn ? <Chat /> : <Auth />}
    </div>
  );
};

export default App;