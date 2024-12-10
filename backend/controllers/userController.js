const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const cloudinary = require('cloudinary');
const ErrorHandler = require("../middlewares/error");
const User = require("../models/userShema");
const { sendToken } = require("../utils/sendJwtToken");

exports.register = catchAsyncErrors(async (req, res, next) => {
    const { profilePicture } = req.files;

    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler('Image required !', 400));
    }
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(profilePicture.tempFilePath, {
        folder: "My_Avatar"
    });

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(new ErrorHandler('Cloudinary Error', 500));
    };

    const {
        name,
        email,
        password,
        aboutMe,
        facebook,
        instagram,
        portfolio,
        twitter,
        github
    } = req.body;

    if (!name || !email || !password || !aboutMe) {
        return next(new ErrorHandler("All field requred !"));
    }

    const user = await User.create({
        name,
        email,
        password,
        aboutMe,
        profilePicture: {
            url: cloudinaryResponse.secure_url,
            public_id: cloudinaryResponse.public_id
        },
        facebook,
        instagram,
        portfolio,
        twitter,
        github
    });
    sendToken(user, 201, res, "User created successfully");
});

//! LOGIN FUNCTINALITY USER

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("All fields required ?", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid User ?", 401));
    }
    const isPassword = await user.comparePassword(password);
    if (!isPassword) {
        return next(new ErrorHandler("Invalid email and password ?", 400));
    }
    sendToken(user, 200, res, "User Login successfully");
})


//! UPDATE USER DATA
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const user = req.spesificUser;
    // console.log(data);
    const {
        name,
        email,
        aboutMe,
        facebook,
        instagram,
        portfolio,
        twitter,
        github
    } = req.body;

    // Prepare the updated data object dynamically
    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (aboutMe) updatedData.aboutMe = aboutMe;
    if (facebook) updatedData.facebook = facebook;
    if (instagram) updatedData.instagram = instagram;
    if (portfolio) updatedData.portfolio = portfolio;
    if (twitter) updatedData.twitter = twitter;
    if (github) updatedData.github = github;

    // Handle profile picture update
    if (req.files && req.files.profilePicture) {

        // Delete the old image from Cloudinary
        if (user.profilePicture && user.profilePicture.public_id) {
            await cloudinary.v2.uploader.destroy(user.profilePicture.public_id);
        }

        // Upload the new image to Cloudinary
        const result = await cloudinary.v2.uploader.upload(
            req.files.profilePicture.tempFilePath, // Path to the uploaded file
            { folder: "users/profile_pictures" } // Organize images in a folder
        );

        // Save new image URL and public_id
        updatedData.profilePicture = {
            public_id: result.public_id,
            url: result.secure_url,
        };
    }
    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(user._id, updatedData);
    console.log(updatedData)
    console.log(updatedUser)
    if (!updatedUser) {
        return res.status(500).json({
            success: false,
            message: "Failed to update user",
        });
    }
    
    // Respond with the updated user data
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        user,
    });
});

