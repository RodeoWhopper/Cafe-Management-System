const express = require('express');
const cors = require('cors');
const connection = require('./connection');
const userAccess = require('./routes/userRoute');

const app = express();

app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use('/user',userAccess);

module.exports = app;