// HUANG Kaining 1155141441
// HUANG Sida 1155124414
// MA Yuan 1155124344
// ZHANG Wenxuan 1155141413
// ZHAO Jinpei 1155124239

const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hkn:csci2720@cluster0.quwtc.mongodb.net/test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log("Connection is open...");
});

const {Schema} = mongoose;

const UserSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    searchHistory: [{type: String}],
    favoriteLocs: [{type: String}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    preference: {type: String}
});

const LocationSchema = mongoose.Schema({
    locName: {type: String, required: true, unique: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    temp_c: {type: Number},
    wind_kph: {type: Number},
    wind_dir: {type: String},
    humidity: {type: Number},
    precip_mm: {type: Number},
    vis_km: {type: Number}
});

const CommentSchema = mongoose.Schema({
    commentUser: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    commentLoc: {type: Schema.Types.ObjectId, ref: 'Location', required: true},
    content: {type: String, required: true}
});

const User = mongoose.model('User', UserSchema);
const Location = mongoose.model('Location', LocationSchema);
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = {User, Location, Comment};