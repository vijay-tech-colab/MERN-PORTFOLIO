const {catchAsyncErrors} = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../middlewares/error');
const Tool = require('../models/toolSchema');
const cloudinary = require('cloudinary').v2;

/**
 * Create a new tool
 * Route: POST /api/tools
 */
exports.createTool = catchAsyncErrors(async (req, res, next) => {
    const { name, description, category, officialLink } = req.body;
    if(!name || !description || !category){
        return next(new ErrorHandler("All field are required ?",404));
    }
    // Check if a file was uploaded
    if (!req.files || !Object.keys(req.files).length) {
        return next(new ErrorHandler('Icon file is required', 400));
    }

    // Upload the icon to Cloudinary
    const result = await cloudinary.uploader.upload(req.files.icon.tempFilePath, {
        folder: 'tools'
    });

    const icon = {
        url: result.secure_url,
        public_id: result.public_id
    };

    const tool = await Tool.create({
        name,
        description,
        category,
        officialLink,
        icon
    });

    res.status(201).json({
        success: true,
        message: 'Tool created successfully',
        tool
    });
});

/**
 * Get all tools
 * Route: GET /api/tools
 */
exports.getAllTools = catchAsyncErrors(async (req, res, next) => {
    const tools = await Tool.find();

    res.status(200).json({
        success: true,
        tools
    });
});

/**
 * Get a single tool by ID
 * Route: GET /api/tools/:id
 */
exports.getToolById = catchAsyncErrors(async (req, res, next) => {
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
        return next(new ErrorHandler('Tool not found', 404));
    }

    res.status(200).json({
        success: true,
        tool
    });
});

/**
 * Update a tool by ID
 * Route: PUT /api/tools/:id
 */
exports.updateTool = catchAsyncErrors(async (req, res, next) => {
    let tool = await Tool.findById(req.params.id);

    if (!tool) {
        return next(new ErrorHandler('Tool not found', 404));
    }

    // If a new file is uploaded, update the icon on Cloudinary
    if (req.files && req.files.icon) {
        // Delete the old icon from Cloudinary
        await cloudinary.uploader.destroy(tool.icon.public_id);

        // Upload the new icon to Cloudinary
        const result = await cloudinary.uploader.upload(req.files.icon.tempFilePath, {
            folder: 'tools',
            resource_type: 'image'
        });

        req.body.icon = {
            url: result.secure_url,
            public_id: result.public_id
        };
    }

    // Update the tool details
    tool = await Tool.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Return the updated tool
        runValidators: true
    });

    res.status(200).json({
        success: true,
        message: 'Tool updated successfully',
        tool
    });
});

/**
 * Delete a tool by ID
 * Route: DELETE /api/tools/:id
 */

exports.deleteTool = catchAsyncErrors(async (req,res,next) => {
    const {id} = req.params;
    const tool = await Tool.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: 'Tool updated successfully',
        tool
    });
});

