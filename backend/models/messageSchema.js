const mongoose = require('mongoose');

// Define the Message Schema
const MessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true, // Name of the sender
    },
    email: {
        type: String,
        required: true, // Email of the sender (for contact form messages)
    },
    message: {
        type: String,
        required: true, // The actual message content
        maxlength: 2000, // Optional: Limit the message length
    },
    sentAt: {
        type: Date,
        default: Date.now, // Automatically set the timestamp for when the message was sent
    },
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
