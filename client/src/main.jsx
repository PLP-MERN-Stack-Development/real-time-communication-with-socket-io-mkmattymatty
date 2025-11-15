// client/src/main.jsx (Update imports)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// Import the new provider name and location
import { ChatProvider } from './context/ChatContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Use the new provider */}
    <ChatProvider>
      <App />
    </ChatProvider>
  </React.StrictMode>,
);