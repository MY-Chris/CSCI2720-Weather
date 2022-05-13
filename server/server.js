const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');

const express = require('express');
const app = express();
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


const morgan = require('morgan');
const fs = require('fs');
const {ApolloServer, gql} = require('apollo-server-express');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hkn:csci2720@cluster0.quwtc.mongodb.net/test');
const cors = require('cors');
const res = require('express/lib/response');
app.use(cors());
const axios = require('axios');
const moment = require('moment-timezone');

const schemas = require('./schema.js');
const myfunctions1 = require('./weatherPart1.js');
const myfunctions2 = require('./weatherPart2.js');

const db = mongoose.connection;

// use react 
app.use( express.static('../weather/build'));

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log("Connection is open...");
});

console.log(moment().tz('Asia/Beijing').format());
morgan.token('date', (req, res, tz) => {
    return moment().tz(tz).format();
});
morgan.format('myformat', ':remote-addr - [:date[Asia/Beijing]] ":method :url HTTP/:http-version" ":user-agent"');
const accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
app.use(morgan('myformat', {"stream": accessLogStream}));

AdminBro.registerAdapter(AdminBroMongoose);
const locale = {
    translations: {
        labels: {
        // change Heading for Login
        loginWelcome: 'Weather Admin',
        },
        messages: {
            loginWelcome: 'Please login',
        },
    },
};
const AdminBroOptions = {
    resources: [{resource: schemas.User,}, {resource: schemas.Comment,}, {
        resource: schemas.Location,
        options: {
            actions: {
                requestUpdatedData: {
                    actionType: 'resource',
                    handler: async () => {
                        const locs = await schemas.Location.find().lean().exec();
                        locs.forEach(async loc => {
                            let url = 'http://api.weatherapi.com/v1/current.json?key=072f5ae9c4c849f8858104048220805&q=' + loc.locName;
                            const weather_info = await myfunctions1.weatherRequest(url);
                            const updatedLoc = await schemas.Location.findOneAndUpdate({locName: loc.locName}, {
                                latitude: weather_info.location.lat,
                                longitude: weather_info.location.lon,
                                temp_c: weather_info.current.temp_c,
                                wind_kph: weather_info.current.wind_kph,
                                wind_dir: weather_info.current.wind_dir,
                                humidity: weather_info.current.humidity,
                                precip_mm: weather_info.current.precip_mm,
                                vis_km: weather_info.current.vis_km
                            });
                        });
                    },
                    component: false,
                }
            }
        }
    }],
    rootPath: '/admin',
    locale,
    branding: {
        companyName: 'Weather',
        softwareBrothers: false,
        logo:'',
    },
};
const adminBro = new AdminBro(AdminBroOptions)
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: (username, password) => {
        let currentuser = {};
        currentuser.email = 'admin';
        if (username === 'admin' && password === 'admin')
            return currentuser;
        else
            return false;
    },
    cookiePassword: "CSCI2720weather",
});
app.use(adminBro.options.rootPath, router);

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//Add Routes here
// app.get('/to_admin',(req,res)=>{
//     res.redirect('/admin');
// })

// User login
app.post('/auth/signup', (req, res) => {

    schemas.User.findOne({ username: req.body['username'] }, (err, e) => {
            if (err)
                res.status(400).send(err);
            else {
                if(e!=null)
                {
                    res.status(400).send({message: "Account already exists!"});

                }
                else{
                    schemas.User.create({
                        username: req.body['username'],
                        password: req.body['password'],
                        preference: "light"
                    }, (err, e) => {
                        if (err)
                            res.status(400).send({message: err});
                        else
                            res.send({message:"Successfully signed up."});
                    });
                }
            }
        });
});
// User sign up
app.post('/auth/signin', (req, res) => {

    schemas.User.findOne({ username: req.body['username'] }, (err, e) => {
        if (err)
            res.status(400).send({message: err});
        else {
            if (e==null){
                res.status(400).send({message: "Invalid username"});
            }
            else{
                if (req.body['password'] == e.password) {
                    req.session.loggedin = true;
                    req.session.username = req.body['username'];
                    res.send({user:req.body['username'],userid:JSON.stringify(e._id),message: "Successfully logged in."});
                }
                else
                    res.status(400).send({message: "Incorrect password"});
            }
        }
    });
});

// User logout
app.get('/logout',(req,res)=> {req.session.destroy((err)=>{})});
//User feature 4
app.get('/locations/:locName/users/:userId', (req, res) => {
    myfunctions2.showLocationDetail(req.params.locName, req.params.userId, res);
});

app.put('/locations/:locName/users/:userId', (req, res) => {
    myfunctions2.addComment(req.body['content'], req.params.locName, req.params.userId);
});

//User feature 5
app.get('/locations/:locName/users/:userId/fav/:status', (req, res) => {
    if(req.params.status === '1') {
        myfunctions2.removeFavoriteLocation(req.params.locName, req.params.userId);
        res.send("removed!");
    }
    else {
        myfunctions2.addFavoriteLocation(req.params.locName, req.params.userId);
        res.send("added!");
    }
})
app.get('/users/:userId/favorites', (req, res) => {
    myfunctions2.listAllLocations(req.params.userId, res);
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

//estr feature history
app.get('/history/past5days/:locName', (req, res) => {
    myfunctions1.weatherHistoryP5d(req.params.locName, res);
});

app.get('/history/past10hours/:locName', (req, res) => {
    myfunctions1.weatherHistoryP10h(req.params.locName, res);
});

// estr feature color theme
app.put('/users/theme', (req, res) => {
    myfunctions1.updateTheme(req.body['userId'], req.body['theme'], res);
});

app.get('/users/theme/:userId', (req, res) => {
    myfunctions1.getTheme(req.params.userId, res);
});

//GraphQL
const typeDefs = gql`
    type Location {
        locName: String!
        latitude: Float!
        longitude: Float!
        comments: [Comment]
        temp_c: Float
        wind_kph: Float
        wind_dir: String
        humidity: Float
        precip_mm: Float
        vis_km: Float
    }
    type Comment {
        commentUser: String!
        commentLoc: String!
        content: String
    }
    type Query {
        location(locName: String!): Location
        locations: [Location]
    }
`;

const resolvers = {
    Query: {
        location: async (parent, {locName}) => {
            const loc = await schemas.Location.findOne({locName: locName}).lean().populate('comments').exec();
            url = "http://api.weatherapi.com/v1/current.json?key=9035794a7a4444e99da32445220105&q=";
            let weather_info = await myfunctions1.weatherRequest(url + loc.locName);
            loc.temp_c = weather_info.current.temp_c;
            loc.wind_kph = weather_info.current.wind_kph;
            loc.wind_dir = weather_info.current.wind_dir;
            loc.humidity = weather_info.current.humidity;
            loc.precip_mm = weather_info.current.precip_mm;
            loc.vis_km = weather_info.current.vis_km;
            console.log(loc);
            return loc;
        },
        locations: async () => {
            const locs = await schemas.Location.find().lean().populate('comments').exec();
            url = "http://api.weatherapi.com/v1/current.json?key=9035794a7a4444e99da32445220105&q=";
            for (loc of locs) {
                let weather_info = await myfunctions1.weatherRequest(url + loc.locName);
                loc.temp_c = weather_info.current.temp_c;
                loc.wind_kph = weather_info.current.wind_kph;
                loc.wind_dir = weather_info.current.wind_dir;
                loc.humidity = weather_info.current.humidity;
                loc.precip_mm = weather_info.current.precip_mm;
                loc.vis_km = weather_info.current.vis_km;
            }
            console.log(locs);
            return locs;
        }
    }
}

const s = new ApolloServer({typeDefs, resolvers});
s.start().then(res => {
    s.applyMiddleware({app});
});

const server = app.listen(80);

