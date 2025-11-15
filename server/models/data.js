// server/models/data.js (NEW FILE)

const users = {};
const messages = [];
const typingUsers = {};
const MESSAGE_LIMIT = 100;

const Data = {
    // User management
    addUser: (id, username) => {
        users[id] = { username, id };
    },
    removeUser: (id) => {
        const user = users[id];
        delete users[id];
        delete typingUsers[id];
        return user;
    },
    getUsers: () => Object.values(users),
    getUserById: (id) => users[id],

    // Message management
    addMessage: (message) => {
        messages.push(message);
        // Limit stored messages
        if (messages.length > MESSAGE_LIMIT) {
            messages.shift();
        }
    },
    getMessages: () => messages,
    
    // Typing management
    setTyping: (id, isTyping) => {
        if (!users[id]) return;
        const username = users[id].username;
        
        if (isTyping) {
            typingUsers[id] = username;
        } else {
            delete typingUsers[id];
        }
    },
    getTypingUsers: () => Object.values(typingUsers),
};

module.exports = Data;