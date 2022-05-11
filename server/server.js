const express = require('express');
const app = express();

const cors = require('cors');
const res = require('express/lib/response');
var corsOptions = {
    origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

const axios = require('axios');

const db = require("./app/models/index");
db.mongoose.connect('mongodb+srv://hkn:csci2720@cluster0.quwtc.mongodb.net/test');
// const db = mongoose.connection;
db.mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));
db.mongoose.connection.once('open', function () {
    console.log("Connection is open...");
});




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

