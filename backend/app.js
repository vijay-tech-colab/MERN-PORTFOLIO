const cookieParser = require('cookie-parser');
const express = require('express');
const { errorMiddleware } = require('./middlewares/globleErrorHandler');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const userRouter = require('./routers/userRouter');
const app = express();
require('dotenv').config({path : "./config/config.env"});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(helmet());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}))
app.use("/api/v1/user",userRouter);
app.use(errorMiddleware);
module.exports = app;