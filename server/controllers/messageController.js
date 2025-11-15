// server/controllers/messageController.js (NEW FILE)

const Data = require('../models/data');

exports.getHistoricalMessages = (req, res) => {
    const messages = Data.getMessages();
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const totalMessages = messages.length;
    const start = totalMessages - offset - limit;
    const end = totalMessages - offset;
    
    // Slice the array and reverse to get oldest first
    const paginatedMessages = messages.slice(Math.max(0, start), end);
    const reversedMessages = paginatedMessages.reverse();

    res.json({
        messages: reversedMessages,
        total: totalMessages,
        hasMore: start > 0,
    });
};

exports.getOnlineUsers = (req, res) => {
    res.json(Data.getUsers());
};