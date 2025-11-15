// server/socket/handler.js (NEW FILE)

const Data = require('../models/data');

module.exports = (io, socket) => {
    // User Joining
    const userJoin = (username) => {
        Data.addUser(socket.id, username);
        io.emit('user_list', Data.getUsers());
        io.emit('user_joined', { username, id: socket.id });
        console.log(`${username} joined the chat`);
    };

    // Global Messages
    const sendMessage = (messageData, ackCallback) => {
        const serverId = Date.now();
        const sender = Data.getUserById(socket.id)?.username || 'Anonymous';
        
        const message = {
            id: serverId, 
            tempId: messageData.tempId, 
            content: messageData.content, 
            sender,
            senderId: socket.id,
            timestamp: new Date().toISOString(),
            isPrivate: false,
        };
        
        Data.addMessage(message);
        io.emit('receive_message', message);

        if (ackCallback) {
            ackCallback(serverId);
        }
    };

    // Typing Indicator
    const handleTyping = (isTyping) => {
        Data.setTyping(socket.id, isTyping);
        io.emit('typing_users', Data.getTypingUsers());
    };

    // Private Messages
    const sendPrivateMessage = ({ to, message }, ackCallback) => {
        const recipientSocket = io.sockets.sockets.get(to);
        const serverId = Date.now();
        
        if (!recipientSocket) {
            console.log(`Error: Recipient with ID ${to} not found.`);
            if (ackCallback) ackCallback(null);
            return; 
        }

        const sender = Data.getUserById(socket.id)?.username || 'Anonymous';
        
        const messageData = {
            id: serverId, 
            tempId: message.tempId, 
            content: message.content, 
            sender,
            senderId: socket.id,
            recipientId: to, 
            timestamp: new Date().toISOString(),
            isPrivate: true,
        };
        
        recipientSocket.emit('private_message', messageData);
        socket.emit('private_message', messageData);
        
        if (ackCallback) {
            ackCallback(serverId);
        }
    };

    // Disconnection
    const handleDisconnect = () => {
        const user = Data.removeUser(socket.id);
        
        if (user) {
            io.emit('user_left', { username: user.username, id: socket.id });
            console.log(`${user.username} left the chat`);
        }
        
        io.emit('user_list', Data.getUsers());
        io.emit('typing_users', Data.getTypingUsers());
    };

    // Register Handlers
    socket.on('user_join', userJoin);
    socket.on('send_message', sendMessage);
    socket.on('typing', handleTyping);
    socket.on('private_message', sendPrivateMessage);
    socket.on('disconnect', handleDisconnect);
};