const jwt = require('jsonwebtoken');
const { catchAsyncErrors } = require("./catchAsyncError");
const ErrorHandler = require("./error");
const User = require('../models/userShema');

const authMiddleware = catchAsyncErrors(async (req,res,next) => {
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("UnAthorized user ?"));
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.spesificUser = await User.findById(decoded.id);
    next();
})