const mongoose = require('mongoose');
const mongoose = require('mongoose');
const validator = require("validator")

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
  },
  aboutMe: {
    type: String, // Add the 'About Me' field
    required: false, // Make it optional if desired
    maxlength: 500, // Limit character count to keep it concise
  },
  profilePicture: {
    type: String, // URL of the profile picture
    required: false,
  },
  socialLinks: {
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    portfolio: { type: String },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
const User = mongoose.model('User', UserSchema);

module.exports = User;
