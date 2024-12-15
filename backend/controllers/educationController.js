const Education = require('../models/educationSchema');
const {catchAsyncErrors} = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../middlewares/error');

// Create Education
exports.createEducation = catchAsyncErrors(async (req, res, next) => {
    const { school, degree, fieldOfStudy, from, to, current, description } = req.body;

    if(!school || !degree || !fieldOfStudy || !from || !to){
        return next(new ErrorHandler("All field required !",404));
    }
    const education = await Education.create({
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    });

    res.status(201).json({
        success: true,
        message: "Education created successfully",
        education
    });
});

// Get all Education records
exports.getAllEducation = catchAsyncErrors(async (req, res, next) => {
    const educationRecords = await Education.find();

    res.status(200).json({
        success: true,
        count: educationRecords.length,
        educationRecords
    });
});

// Get a single Education record by ID
exports.getEducationById = catchAsyncErrors(async (req, res, next) => {
    const education = await Education.findById(req.params.id);

    if (!education) {
        return next(new ErrorHandler("Education record not found", 404));
    }

    res.status(200).json({
        success: true,
        education
    });
});

// Update Education record by ID
exports.updateEducation = catchAsyncErrors(async (req, res, next) => {
    let education = await Education.findById(req.params.id);

    if (!education) {
        return next(new ErrorHandler("Education record not found", 404));
    }

    education = await Education.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        message: "Education updated successfully",
        education
    });
});

// Delete Education record by ID
exports.deleteEducation = catchAsyncErrors(async (req, res, next) => {
    const education = await Education.findById(req.params.id);

    if (!education) {
        return next(new ErrorHandler("Education record not found", 404));
    }

    await education.remove();

    res.status(200).json({
        success: true,
        message: "Education deleted successfully"
    });
});
