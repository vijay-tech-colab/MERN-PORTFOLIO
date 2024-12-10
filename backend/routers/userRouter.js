const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {register, loginUser, updateUser} = require('../controllers/userController');
const userRouter = express.Router();
userRouter.post('/register',register);
userRouter.post('/login',loginUser);
userRouter.put('/update',authMiddleware,updateUser);
module.exports = userRouter;