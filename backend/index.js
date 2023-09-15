const express = require('express');
const cors = require('cors');
const connection = require('./connection');
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute');
const billRoute = require('./routes/billRoute');
const dashboardRoute = require('./routes/dashboardRoute');

const app = express();

app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use('/user',userRoute);
app.use('/category',categoryRoute);
app.use('/product',productRoute);
app.use('/bill',billRoute);
app.use('/dashboard',dashboardRoute);

module.exports = app;