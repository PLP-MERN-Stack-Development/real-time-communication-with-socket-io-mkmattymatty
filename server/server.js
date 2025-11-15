// server.js (FINAL REFACTORED ORCHESTRATOR)

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// --- NEW IMPORTS ---
const connectDB = require('./config/db'); // Import DB initializer
// const { log } = require('./utils/utils'); // Example: Import utility function
// -------------------

// Load environment variables
dotenv.config();

// Initialize DB connection (Note: Currently uses in-memory store)
connectDB(); 

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Import Controllers and Handlers
const socketHandler = require('./socket/handler');
const messageController = require('./controllers/messageController');

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  socketHandler(io, socket);
});

// API routes
app.get('/api/messages', messageController.getHistoricalMessages);
app.get('/api/users', messageController.getOnlineUsers);

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };