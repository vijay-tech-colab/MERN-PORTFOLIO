const cookieParser = require('cookie-parser');
const express = require('express');
const { errorMiddleware } = require('./middlewares/globleErrorHandler');
const helmet = require('helmet');
const app = express();
require('dotenv').config({path : "./config/config.env"});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(helmet());

app.use(errorMiddleware);
module.exports = app;