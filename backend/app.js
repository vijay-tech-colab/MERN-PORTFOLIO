const cookieParser = require('cookie-parser');
const express = require('express');
const { errorMiddleware } = require('./middlewares/globleErrorHandler');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const userRouter = require('./routers/userRouter');
const messageRouter = require('./routers/messageRouter');
const skillRouter = require('./routers/skillRouter');
const educationRouter = require('./routers/educationRouter');
const toollRouter = require('./routers/toolRouter');
const cors = require('cors');
const app = express();
require('dotenv').config({path : "./config/config.env"});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(helmet());
//! cors policy implementation || 
app.use(cors({
    origin: [process.env.FRONTEND_URL ,process.env.DASHBOARD_URL], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Enable cookies for cross-origin requests if needed
}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));

app.use("/api/v1/user",userRouter);
app.use("/api/v1/message",messageRouter);
app.use("/api/v1/skill",skillRouter);
app.use("/api/v1/education",educationRouter);
app.use("/api/v1/tool",toollRouter);
app.use(errorMiddleware);
module.exports = app;