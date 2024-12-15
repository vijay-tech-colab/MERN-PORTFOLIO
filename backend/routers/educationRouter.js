const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
    createEducation,
    getAllEducation,
    getEducationById,
    updateEducation,
    deleteEducation
} = require('../controllers/educationController');

const educationRouter = express.Router();
educationRouter.post('/post-education',authMiddleware, createEducation);
educationRouter.get('/get-education', getAllEducation);
educationRouter.get('/get-education/:id', getEducationById);
educationRouter.put('/update-education',authMiddleware, updateEducation);
educationRouter.delete('/delete-education', authMiddleware, deleteEducation);


module.exports = educationRouter;