// HUANG Kaining 1155141441
// HUANG Sida 1155124414
// MA Yuan 1155124344
// ZHANG Wenxuan 1155141413
// ZHAO Jinpei 1155124239
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const res = require('express/lib/response');
app.use(cors());
const axios = require('axios');

const schemas = require('./schema.js');
const myfunctions1 = require('./weatherPart1.js');

//User feature 5, add location into a list of user's favorite locations
function addFavoriteLocation (locName, userId) {
    schemas.User.findOneAndUpdate(
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

//User feature 5, remove location from a list of user's favorite locations
async function removeFavoriteLocation (locName, userId) {
    schemas.User.findOneAndUpdate(
        {_id: userId},
        {$pull: {favoriteLocs: locName}},
        function (err, res) {
            console.log(res);
            if (err)
                res.send("Something Wrong!")
            else {
                res.s
            }
        }
    );
}

//User feature 5, list all favorite locations of a user
function listAllLocations (userId, res) {
    let loclist = [];
    schemas.User.findById(userId, function (err, user) {
        let list = [];
        if (err)
            console.log(err);
        user.favoriteLocs.forEach(element => {
            list.push(element);
        });
        res.send(JSON.stringify(list));
    });
}

//User feature 4, show location details
async function showLocationDetail (locName, userId, res) {
    const loc = await schemas.Location.findOne({locName: locName}).lean().populate({path: "comments", populate: {path: "commentUser"}}).exec();
    const user = await schemas.User.findById(userId).lean().exec();
    url = "http://api.weatherapi.com/v1/current.json?key=9035794a7a4444e99da32445220105&q=";
    const weather_info = await myfunctions1.weatherRequest(url + loc.locName);
    let result = {};
    result.data = weather_info;
    result.data.location.lat = loc.latitude;
    result.data.location.lon = loc.longitude;
    result.comments = loc.comments;
    result.comments.forEach(comment => {
        comment.username = comment.commentUser.username;
    });
    result.favourite = false;
    user.favoriteLocs.forEach(element => {
        if (element === locName)
            result.favourite = true;
    });
    console.log(result);
    res.send(JSON.stringify(result));
}

//User feature 4, add a new comment
function addComment(content, locName, userId) {
    schemas.Location.findOne({locName: locName}, function (err, loc) {
        if (err)
            console.log(err);
        if (loc != null) {
            schemas.Comment.create({
                commentUser: mongoose.Types.ObjectId(userId),
                commentLoc: loc._id,
                content: content
            }, function (err, comment) {
                if (err)
                    console.log(err);
                if (comment != null) {
                    schemas.User.findOneAndUpdate(
                        {_id: userId},
                        {$push: {comments: comment._id}},
                        function (err, res) {
                            if (err)
                                console.log(err);
                            else
                                console.log(res);
                        }
                    );
                    schemas.Location.findOneAndUpdate(
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

module.exports = {addFavoriteLocation, removeFavoriteLocation, listAllLocations, showLocationDetail, addComment};
