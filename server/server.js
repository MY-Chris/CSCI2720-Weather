const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hkn:csci2720@cluster0.quwtc.mongodb.net/test');
const cors = require('cors');
const res = require('express/lib/response');
app.use(cors());
const axios = require('axios');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log("Connection is open...");
});

const {Schema} = mongoose;

const UserSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    searchHistory: [{locName: String}],
    favoriteLocs: [{locName: String}],
    comments: [{commentId: {type: Schema.Types.ObjectId, ref: 'Comment'}}],
    preference: String
});

const LocationSchema = mongoose.Schema({
    locName: {type: String, required: true, unique: true},
    latitude: {type: String, required: true},
    longitude: {type: String, required: true},
    comments: [{commentId: {type: Schema.Types.ObjectId, ref: 'Comment'}}]
});

const CommentSchema = mongoose.Schema({
    commentUser: {type: String, required: true}, //just store the username of User
    commentLoc: {type: String, required: true}, //just store the locName of Location
    content: {type: String, required: true}
});

const RequestSchema = mongoose.Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    userIP: String,
    userBrowser: String,
    dateTime: Date,
    reqMethod: String,
    reqUrl: String
});

const User = mongoose.model('User', UserSchema);
const Location = mongoose.model('Location', LocationSchema);
const Comment = mongoose.model('Comment', CommentSchema);
const Request = mongoose.model('Request', RequestSchema);


function loadCurrentWeather(loc) {
    key = "072f5ae9c4c849f8858104048220805";
    url = "http://api.weatherapi.com/v1/current.json?key=" + key + "&q=" + loc;
    axios.get(url)
    .then(res => {
        let temp_c = res.data.current.temp_c;
        let wind_kph = res.data.current.wind_kph;
        let wind_dir = res.data.current.wind_dir;
        let humidity = res.data.current.humidity;
        let precip_mm = res.data.current.precip_mm;
        let vis_km = res.data.current.vis_km;
        //res.send(...)
    })
    .catch(err => console.log("Failed to load current weather from WeatherAPI"));
}

function addLocation (locName, userId) {
    const loc = {locName: locName};
    User.findOneAndUpdate(
        {_id: userId},
        {$push: {favoriteLocs: loc}},
        function (err, res) {
            if (err)
                console.log(err);
            else
                console.log(res);
        }
    );
}

function listAllLocations (userId) {
    let loclist = [];
    User.findById(userId, function (err, user) {
        let list = [];
        if (err)
            console.log(err);
        user.favoriteLocs.forEach(element => {
            list.push(element.locName);
        });
        return list; //change to res.send(...)
    });
}

//addLocation("Hong Kong", mongoose.Types.ObjectId('627a7853eb2897a49692e867'));
//console.log(listAllLocations (mongoose.Types.ObjectId('627a7853eb2897a49692e867')));

const server = app.listen(3000);
