const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { postSkill, updateSkill, deleteSkill, getAllSkill, getSkillById } = require('../controllers/skillController');
const skillRouter = express.Router();
skillRouter.post('/create-skill',authMiddleware,postSkill);
skillRouter.put('/update-skill/:id',authMiddleware,updateSkill);
skillRouter.delete('/delete-skill/:id',authMiddleware,deleteSkill);
skillRouter.get('/get-all-skill',getAllSkill);
skillRouter.get('/get-skill/:id',getSkillById);

module.exports = skillRouter;