const { catchAsyncErrors } = require('../middlewares/catchAsyncError');
const Skill = require('../models/skillSchema');
const ErrorHandler = require('../middlewares/error');
const cloudinary = require('cloudinary');

exports.postSkill = catchAsyncErrors(async (req, res, next) => {
    const { name, category, proficiency } = req.body;
    (req.files);
    // Validate required fields
    if (!name || !category || !proficiency || !req.files || !Object.keys(req.files).length) {
        return next(new ErrorHandler("All fields are required, including the icon file.",400));
    }
    // Upload the icon to Cloudinary
    const result = await cloudinary.v2.uploader.upload(req.files.icon.tempFilePath, {
        folder: "skills/icons", // Optional: Set a specific folder for organization
    });

    // Create a new skill document
    const skill = new Skill({
        name,
        category,
        proficiency,
        icon: {
            url: result.secure_url,
            public_id: result.public_id,
        },
    });

    // Save the skill to the database
    await skill.save();

    res.status(201).json({
        message: "Skill created successfully!",
        skill,
    });
})

exports.getAllSkill = catchAsyncErrors(async (req, res, next) => {
    const skills = await Skill.find();
    res.status(200).json({
        message: "Skills fetched successfully!",
        skills,
    });
});

exports.getSkillById = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const skill = await Skill.findById(id);

    if (!skill) {
        return next(new ErrorHandler("Skill not found.", 400));
    }

    res.status(200).json({
        message: "Skill fetched successfully!",
        skill,
    });
})

exports.updateSkill = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { name, category, proficiency } = req.body;
    const updates = { name, category, proficiency };

    // Check if a new file is uploaded
    if (req.files) {
        const skill = await Skill.findById(id);

        if (!skill) {
            return next(new ErrorHandler("Skill not found.", 400));
        }

        // Delete the old icon from Cloudinary
        await cloudinary.uploader.destroy(skill.icon.public_id);

        // Upload the new icon to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "skills/icons",
        });

        updates.icon = {
            url: result.secure_url,
            public_id: result.public_id,
        };
    }

    const updatedSkill = await Skill.findByIdAndUpdate(id, updates, {
        new: true, // Return the updated document
        runValidators: true, // Validate the updates
    });

    if (!updatedSkill) {
        return next(new ErrorHandler("Skill not found.", 400));
    }

    res.status(200).json({
        message: "Skill updated successfully!",
        skill: updatedSkill,
    });
})

exports.deleteSkill = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const skill = await Skill.findById(id);

    if (!skill) {
        return res.status(404).json({
            message: "Skill not found.",
        });
    }

    // Delete the icon from Cloudinary
    await cloudinary.uploader.destroy(skill.icon.public_id);

    // Delete the skill from the database
    await skill.deleteOne();

    res.status(200).json({
        message: "Skill deleted successfully!",
    });
})


