const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { sendMessage, deleteMessage, getAllMessages ,getMessageById,repliedMassage} = require('../controllers/messageController');
const messageRouter = express.Router();
messageRouter.post('/send-message', sendMessage);
messageRouter.delete('/delete-message/:id',authMiddleware,deleteMessage);
messageRouter.get('/get-all-message', authMiddleware,getAllMessages);
messageRouter.get('/get-message/:id', authMiddleware,getMessageById);
// Route to reply to a message and send an email
messageRouter.post('/message-reply/:id',authMiddleware, repliedMassage);

module.exports = messageRouter;