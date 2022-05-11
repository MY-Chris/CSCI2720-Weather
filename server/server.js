const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs');
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

const accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
app.use(morgan(':remote-addr - [:date[clf]] ":method :url HTTP/:http-version" ":user-agent"', {"stream": accessLogStream}));

//Add Routes here

//User feature 4
app.get('/locations/:locName', (req, res) => {
    myfunctions.showLocationDetail(req.params.locName, res);
});
app.put('/locations/:locName/users/:userId', (req, res) => {
    myfunctions.addComment(req.body['content'], req.params.locName, req.params.userId);
});

//User feature 5
app.put('/users/:userId/favorites', (req, res) => {
    myfunctions.addFavoriteLocation(req.body['locName'], req.params.userId);
});
app.get('/users/:userId/favorites', (req, res) => {
    myfunctions.listAllLocations(req.params.userId, res);
});

const server = app.listen(3000);

