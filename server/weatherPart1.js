// import schema
const schemas = require('./schema.js');
const axios = require('axios');

const weatherRequest = async (url) => {
    const res = await axios.get(url).then(res => res.data).catch(error =>{console.log(error);});
    console.log(res);
    return res;
};


// User feature 1, return all locations name lat long and weather info
const locationsWIthWeather = async function(res){
    let locations = await schemas.Location.find().select('_id locName latitude longitude').lean().exec();  
    console.log("Locations: ");
    console.log( locations);

    url = "http://api.weatherapi.com/v1/current.json?key=9035794a7a4444e99da32445220105&q=";
    for (loc of locations){
        let weather_info = await weatherRequest(url + loc.locName);
        //axios.get(url + loc.locName).then(res => res.data).catch(error =>{console.log(error);});
        loc.temp_c = weather_info.current.temp_c;
        loc.wind_kph = weather_info.current.wind_kph;
        loc.wind_dir = weather_info.current.wind_dir;
        loc.humidity = weather_info.current.humidity;
        loc.precip_mm = weather_info.current.precip_mm;
        loc.vis_km = weather_info.current.vis_km;
    }
    res.send(locations);
}


// User feature 2, return all locations name lat long
const locations = async function(res){
    let locations = await schemas.Location.find().select('_id locName latitude longitude').lean().exec();  
    console.log("Locations: ");
    console.log( locations);
    res.send(locations);
}

const searchLocations = async function(res, field, key1, key2 = undefined){
    let locations = [];
    if (key2 == undefined){
        // add partial search
        locations = await schemas.Location.find({locName: key1}).select('_id locName latitude longitude').lean().exec();  
    }else{
        locations = await schemas.Location.find({[field]: { $gte: key1, $lte: key2 } }).select('-_id locName latitude longitude').lean().exec();
    }
    console.log("Locations: ");
    console.log( locations);
    res.send(locations);
}

// this function is incomplete
const weatherHistory = async function(res){
    let locations = await schemas.Location.find({locName: "Beijing"}).select('_id locName latitude longitude').lean().exec();  
    console.log("Locations: ");
    console.log( locations);

    url = "http://api.weatherapi.com/v1/history.json?key=9035794a7a4444e99da32445220105&q=";
    for (loc of locations){
        let weather_info = await weatherRequest(url + loc.locName + "&dt=2022-05-9&hour=11");
        //axios.get(url + loc.locName).then(res => res.data).catch(error =>{console.log(error);});
        loc.weather1 = weather_info
        loc.weather2 = await weatherRequest(url + loc.locName + "&dt=2022-05-10&hour=11");
        loc.weather3 = await weatherRequest(url + loc.locName + "&dt=2022-05-11&hour=11");
    }
    res.send(locations);
}

// export function
module.exports = {weatherRequest, locationsWIthWeather, locations, searchLocations, weatherHistory};






