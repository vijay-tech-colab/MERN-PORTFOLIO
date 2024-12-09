const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const cloudinary = require('cloudinary');
const ErrorHandler = require("../middlewares/error");
const User = require("../models/userShema");
const { sendToken } = require("../utils/sendJwtToken");

exports.register = catchAsyncErrors(async (req,res,next) => {
    const {profilePicture} = req.files;
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler('Image required !',400));
    }
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(profilePicture.tempFilePath,{
        folder : "My_Avatar"
    });
    if(!cloudinaryResponse || cloudinaryResponse.error){
        return next(new ErrorHandler('Cloudinary Error',500));
    };
    const {name,email,password,aboutMe,facebook,instagram,portfolio,twitter,github} = req.body;
    if(!name || !email || !password || !aboutMe){
        return next(new ErrorHandler("All field requred !"));
    }
    const user = await User.create({
        name,
        email,
        password,
        aboutMe,
        profilePicture : {
            url : cloudinaryResponse.secure_url,
            public_id : cloudinaryResponse.public_id
        },
        facebook,
        instagram,
        portfolio,
        twitter,
        github
    });
    sendToken(user,201,res,"User created successfully");
});