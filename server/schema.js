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

module.exports = {User, Location, Comment, Request};