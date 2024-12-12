const mongoose = require('mongoose');
const validator = require('validator');

// Define the Message Schema
const MessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true, // Name of the sender
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid Email!"],
    },
    message: {
        type: String,
        required: true, // The actual message content
        maxlength: 2000, // Optional: Limit the message length,
        minlength : [10,"message should be at least 10  charactor"]
    },
    sentAt: {
        type: Date,
        default: Date.now, // Automatically set the timestamp for when the message was sent
    },
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
