# 💬 Real-Time Chat Application with Socket.io and React

This project implements a robust, feature-rich, and scalable real-time chat application using **Socket.io** for bidirectional communication, **React** for the frontend, and a modular **Node/Express** backend. It features both global and private (DM) messaging, advanced UX features like typing indicators and delivery acknowledgments, and performance optimizations like message pagination.

## 🌟 Project Overview

This application serves as a comprehensive demonstration of full-stack real-time communication patterns. The server maintains a clean, modular structure (Controllers, Models, Socket Handlers) while the client utilizes React Context and custom Hooks for state management, ensuring a highly maintainable codebase.

---

## ✨ Features Implemented

The project successfully implements all core and advanced requirements across five main task areas:

### Core Functionality (Tasks 2 & 3)
* ✅ **Global Chat:** Real-time public messaging accessible to all connected users.
* ✅ **User Management:** Tracking and displaying a real-time list of online users.
* ✅ **Private Messaging (DMs):** Isolated, secure communication between two users.
* ✅ **Typing Indicators:** Displaying user activity (e.g., "User A is typing...") in global chat.

### Notifications & UX (Task 4)
* ✅ **Unread Counts:** Real-time badges for unread messages in global and private chats.
* ✅ **System Messages:** Automated messages for user join/leave events.
* ✅ **Browser & Sound Notifications:** Alerts for new messages when the app is in the background.

### Performance & Optimization (Task 5)
* ✅ **Message Delivery Acknowledgement:** Client-side tracking of message status (Pending/Sent) using Socket.io acknowledgements.
* ✅ **Message Pagination (History):** Loading older global messages in batches upon request ("Load More") to ensure fast initial load times.
* ✅ **Reconnection Logic:** Robust handling of disconnections with automated reconnection attempts and system feedback.
* ✅ **Client-Side Message Search:** Instant filtering of currently loaded messages by content or sender.
* ✅ **Responsive Design:** A mobile-friendly layout with a toggleable user list on small screens.

---

## ⚙️ Setup Instructions

Follow these steps to set up and run the application locally. You will need **two separate terminals**.

### 1. Prerequisites

* Node.js (v18+) and npm
* A code editor (VS Code recommended)

### 2. Server Setup

Navigate to the `server` directory in your first terminal:

```bash
cd server
npm install
npm run dev


3. Client Setup
Navigate to the client directory in your second terminal:

cd ../client
npm install
npm run dev

4. Access the Application
Open your browser and navigate to http://localhost:5173/.

To test private messaging and real-time features, open a second tab or an incognito window and log in with a different username.
