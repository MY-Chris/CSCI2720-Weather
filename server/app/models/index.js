const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

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

const db = {};
db.mongoose = mongoose;
module.exports = db;