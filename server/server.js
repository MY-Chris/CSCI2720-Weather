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
    searchHistory: [{type: String}],
    favoriteLocs: [{type: String}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    preference: String
});

const LocationSchema = mongoose.Schema({
    locName: {type: String, required: true, unique: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});

const CommentSchema = mongoose.Schema({
    commentUser: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    commentLoc: {type: Schema.Types.ObjectId, ref: 'Location', required: true},
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
    console.log(loc);
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
        console.log(res);
        //res.send(...)
    })
    .catch(err => console.log("Failed to load current weather from WeatherAPI"));
}

function addFavoriteLocation (locName, userId) {
    User.findOneAndUpdate(
        {_id: userId},
        {$push: {favoriteLocs: locName}},
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
            list.push(element);
        });
        console.log(list);
        return list; //change to res.send(...)
    });
}

function showLocationDetail (locName) {
    Location.findOne({locName: locName})
    .populate('comments')
    .exec(function (err, loc) {
        if (err)
            console.log(err);
        if (loc != null) {
            console.log(loc.locName);
            console.log(loc.latitude);
            console.log(loc.longitude);
            loc.comments.forEach(element => {
                console.log(element.content);
            })
            //loadCurrentWeather(loc.locName);
            //change to res.send(...)
        }
    });
}

function addComment(content, locName, userId) {
    Location.findOne({locName: locName}, function (err, loc) {
        if (err)
            console.log(err);
        if (loc != null) {
            Comment.create({
                commentUser: mongoose.Types.ObjectId(userId),
                commentLoc: loc._id,
                content: content
            }, function (err, comment) {
                if (err)
                    console.log(err);
                if (comment != null) {
                    User.findOneAndUpdate(
                        {_id: userId},
                        {$push: {comments: comment._id}},
                        function (err, res) {
                            if (err)
                                console.log(err);
                            else
                                console.log(res);
                        }
                    );
                    Location.findOneAndUpdate(
                        {locName: locName},
                        {$push: {comments: comment._id}},
                        function (err, res) {
                            if (err)
                                console.log(err);
                            else
                                console.log(res);
                        }
                    );
                }
            });
        }
    })
}

const server = app.listen(3000);