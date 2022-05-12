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
const myfunctions1 = require('./weatherPart1.js');
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

// User feature 2, send all locations 
app.get('/locations', (req, res) => {
    myfunctions1.locations( res);
});

// User feature 1, send all locations with weather info
app.get('/locations_weather', (req, res) => {
    myfunctions1.locationsWIthWeather( res);
});

// User feature 3, search by locName, send all locations whose locName contain key
app.get('/locations_search/locName/:key', (req, res) => {
    myfunctions1.searchLocations(res, "locName", req.params.key);
});

// User feature 3, search by other fields, send all locations whose key1 <= field <= key2
app.get('/locations_search/:field/:key1/:key2', (req, res) => {
    myfunctions1.searchLocations(res, req.params.field, req.params.key1, req.params.key2);
});



const server = app.listen(3000);

