const mongoose = require('mongoose');

// Define the Tool Schema
const ToolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // The name of the tool (e.g., "Visual Studio Code")
    },
    description: {
        type: String,
        required: true, // A brief description of the tool
        maxlength: 1000, // Optional: Limit description length
    },
    category: {
        type: String,
        required: true, // Category of the tool (e.g., "IDE", "Database", "Version Control")
        enum: ['IDE', 'Database', 'Version Control', 'Framework', 'Library', 'Other'], // Restrict categories
    },
    version: {
        type: String, // Version of the tool (e.g., "1.0.0")
        required: false,
    },
    officialLink: {
        type: String, // URL to the official tool website
        required: false,
    },
    icon: {
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
});

// Export the model
const Tool = mongoose.model('Tool', ToolSchema);

module.exports = Tool;
