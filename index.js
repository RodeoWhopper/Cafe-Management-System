const express = require('express');
const cors = require('cors');
const connection = require('./connection');
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoute');

const app = express();

app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use('/user',userRoute);
app.use('/category',categoryRoute);

module.exports = app;