const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail"); // A utility to send emails
const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const cloudinary = require('cloudinary');
const ErrorHandler = require("../middlewares/error");
const User = require("../models/userShema");
const { sendToken } = require("../utils/sendJwtToken");
const bcrypt = require('bcrypt');

exports.register = catchAsyncErrors(async (req, res, next) => {
    const { profilePicture } = req.files;
    const {
        name,
        email,
        password,
        phone,
        aboutMe,
        facebook,
        instagram,
        portfolio,
        twitter,
        github
    } = req.body;

    if (!name || !email || !password || !aboutMe || !phone) {
        return next(new ErrorHandler("All field requred !"));
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler('Image required !', 400));
    }
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(profilePicture.tempFilePath, {
        folder: "My_Avatar"
    });

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(new ErrorHandler('Cloudinary Error', 500));
    };

    

    const user = await User.create({
        name,
        email,
        phone,
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
    // (data);
    const {
        name,
        email,
        phone,
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
    if (phone) updatedData.phone = phone;
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
    (updatedData)
    (updatedUser)
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

//! CHANGE PASSWORD FUNCTIONALITY

exports.changePassword = catchAsyncErrors(async (req, res, next) => {
    const user = req.spesificUser;
    const { newPassword, oldPassword } = req.body;
    if (!newPassword || !oldPassword) {
        return next(new ErrorHandler("All fields required ?", 400));
    }
    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
        return next(new ErrorHandler("Invailid Password ?", 400));
    };

    user.password = newPassword;
    // user.password = await bcrypt.hash(newPassword,await bcrypt.genSalt(10));
    await user.save();
    res.status(200).json(
        {
            success: true,
            message: "Password Change successfully",
        }
    );
});

//! FORGET PASSWORD FUNCTIONALITY
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("User not found", 400));
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token and save it in the database with an expiry time
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
    await user.save();

    // Create reset URL
    const resetURL = `${req.protocol}://${req.get("host")}/password-reset/${resetToken}`;

    // Send the email
    const message = `You requested a password reset. Click the link below to reset your password: ${resetURL} If you didn't request this, please ignore this email.
    `;

    await sendEmail({
        email: user.email,
        subject: `Password Reset Request`,
        message,
    });

    res.status(200).json(
        {
            success: true,
            message: "Password reset email sent!"
        }
    );
});

//! RESET PASSWORD FUNCTIONALITY
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.params; // Token from the reset link
    const { newPassword } = req.body;

    // Hash the token to compare with the stored hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    (hashedToken);
    // Find the user with the token and check if the token is still valid
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }, // Check token expiry
    });

    if (!user) {
        return next(new ErrorHandler("Invalid or expired token", 400));
    }

    // Update the password
    user.password = newPassword;
    user.resetPasswordToken = undefined; // Remove token
    user.resetPasswordExpire = undefined; // Remove expiry
    await user.save();

    res.status(200).json(
        {
            success: true,
            message: "Password reset successful"
        }
    );

});