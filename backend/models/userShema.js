const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const validator = require('validator');
const jwt = require('jsonwebtoken');

// Define the User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid Email!"],
    },
    password: {
        type: String,
        required: true,
        select : false
    },
    aboutMe: {
        type: String, // Add the 'About Me' field
        required: false, // Make it optional if desired
        maxlength: 500, // Limit character count to keep it concise
    },
    profilePicture: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },

    portfolio: {
        type: String,
        required : true
    },
    twitter: {
        type: String
    },
    facebook: {
        type: String
    },
    instagram: {
        type: String
    },
    linkedin: {
        type: String
    },
    github: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre('save', async function (next) {
    try {
        const user = this;
        if (!user.isModified('password')) {
            next();
        }
        const genSalt = await bcrypt.genSalt(10);
        const hashPasswoord = await bcrypt.hash(this.password, genSalt);
        this.password = hashPasswoord;
        next();
    } catch (error) {
        console.log(error);
    }
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
    const isMathPassword = await bcrypt.compare(enteredPassword, this.password);
    return isMathPassword
};

UserSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES
    });
}

// Export the model
const User = mongoose.model('User', UserSchema);

module.exports = User;
