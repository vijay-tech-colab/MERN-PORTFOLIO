const mongoose = require('mongoose');


const educationSchema = new mongoose.Schema({
    school: {
        type: String,
        required: [true,'School/College must be required !']
    }, // e.g., "Harvard University"
    degree: {
        type: String,
        required: [true,'Degree must be required!']
    }, // e.g., "Bachelor's in Computer Science"
    fieldOfStudy: {
        type: String,
        required: [true,"Field of study must required !"]
    }, // e.g., "Computer Science"
    from: {
        type: String,
        required: true
    }, // Start date
    to: {
        type: String,
        required : true
    }, // End date
    current: {
        type: Boolean,
        default: false
    }, // If currently studying
    description: {
        type: String
    }, // Additional details
})

const Education = mongoose.model('Education',educationSchema);
module.exports = Education