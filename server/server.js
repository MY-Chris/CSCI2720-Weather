const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hkn:csci2720@cluster0.quwtc.mongodb.net/test');
const cors = require('cors');
const res = require('express/lib/response');
app.use(cors());
const axios = require('axios');

const schemas = require('./schema.js');
const myfunctions = require('./weatherPart2.js');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log("Connection is open...");
});


//Add Routes here

const server = app.listen(3000);
