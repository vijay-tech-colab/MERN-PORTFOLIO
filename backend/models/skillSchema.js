const mongoose = require("mongoose");

// Define the Skill Schema
const SkillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // The name of the skill (e.g., "JavaScript", "React")
    },
    category: {
        type: String,
        required: true, // Category of the skill (e.g., "Frontend", "Backend", "Soft Skill")
        enum: ["Frontend", "Backend", "Database", "DevOps", "Soft Skill", "Other"], // Restrict to predefined categories
    },
    proficiency: {
        type: Number, // Proficiency level as a percentage (e.g., 80 for 80%)
        required: true,
        min: 0,
        max: 100,
    },
    icon: {
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
});

// Export the model
const Skill = mongoose.model("Skill", SkillSchema);

module.exports = Skill;
