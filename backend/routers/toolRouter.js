const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { 
    createTool, 
    updateTool, 
    deleteTool, 
    getAllTools, 
    getToolById 
} = require('../controllers/toolsController');

const toollRouter = express.Router();
toollRouter.post('/create-tool',authMiddleware,createTool);
toollRouter.put('/update-tool/:id',authMiddleware,updateTool);
toollRouter.delete('/delete-tool/:id',authMiddleware,deleteTool);
toollRouter.get('/get-all-tool',getAllTools);
toollRouter.get('/get-tool/:id',getToolById);

module.exports = toollRouter;