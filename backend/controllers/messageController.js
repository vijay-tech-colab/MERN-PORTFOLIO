// Import necessary modules and middleware
const { catchAsyncErrors } = require('../middlewares/catchAsyncError'); // Middleware to catch async errors
const ErrorHandler = require('../middlewares/error'); // Custom error handler class
const Message = require('../models/messageSchema'); // Message schema for MongoDB
const sendEmail = require('../utils/sendEmail');

// Controller to send a message
exports.sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { sender, email, message } = req.body; // Extract fields from request body

    // Validate required fields
    if (!sender || !email || !message) {
        return next(new ErrorHandler("All fields are required", 400)); // Return error if fields are missing
    }

    // Create and save the message to the database
    const msg = await Message.create({
        sender,
        email,
        message
    });

    await sendEmail({
        email: msg.email,
        subject: `Thank You for Visiting My Portfolio 🙏`,
        message : `
        Dear ${msg.sender},

I hope this email finds you well. I noticed that you recently visited my portfolio, and I wanted to personally thank you for taking the time to explore my work.

If you have any feedback, questions, or would like to discuss potential collaborations or projects, please feel free to reach out. I’d love to connect and learn more about your interests.

Looking forward to hearing from you!

Best regards,
Vijay Kumar
[Full-Stack Developer (MERN STACK)]
[Portfolio URL : ]
[LinkedIn Profile : ${'https://www.linkedin.com/in/vijay-kumar45/'}]
[Github Profile : ${'https://github.com/vijay-tech-colab'}]
        `,
    });

    // Send success response
    res.status(201).json({
        success: true,
        message: "Message sent successfully!"
    });
});

// Controller to delete a message by ID
exports.deleteMessage = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params; // Extract message ID from request parameters

    // Find and delete the message by ID
    const message = await Message.findByIdAndDelete(id);

    // Handle case where message is not found
    if (!message) {
        return next(new ErrorHandler("Message not found or already deleted!", 404));
    }

    // Send success response
    res.status(200).json({
        success: true,
        message: "Message deleted successfully!"
    });
});

// Controller to read all messages with sorting
exports.getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const { sortBy = 'createdAt', order = 'desc' } = req.query; // Extract sorting parameters from query, with defaults

    // Fetch messages from the database with sorting
    const messages = await Message.find().sort({ [sortBy]: order === 'asc' ? 1 : -1 });

    // Send response with the sorted messages
    res.status(200).json({
        success: true,
        messages
    });
});

exports.getMessageById = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params; // Extract message ID from request parameters

    // Find the message by ID
    const message = await Message.findById(id);

    // Handle case where message is not found
    if (!message) {
        return next(new ErrorHandler("Message not found!", 404));
    }

    // Send success response with the message data
    res.status(200).json({
        success: true,
        message
    });
});

// Controller to reply to a message and send an email
exports.repliedMassage = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params; // Extract message ID from request parameters
    const { reply } = req.body; // Extract reply from request body

    // Validate reply
    if (!reply) {
        return next(new ErrorHandler("Reply is required", 400));
    }

    // Find the message by ID
    const user = await Message.findById(id);

    // Handle case where user is not found
    if (!user) {
        return next(new ErrorHandler("Message not found!", 404));
    }

    await sendEmail({
        email: user.email,
        subject: `Thank You for Visiting My Portfolio 🙏`,
        message : reply,
    });
    
    // Send success response
    res.status(200).json({
        success: true,
        message: "Reply sent successfully!"
    });
});