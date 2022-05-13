// import schema
const schemas = require('./schema.js');
const axios = require('axios');
const res = require('express/lib/response');

const weatherRequest = async (url) => {
    const res = await axios.get(url).then(res => res.data).catch(error =>{console.log(error);});
    console.log(res);
    return res;
};

const pushWeather = (data, info) => {
    data.temp_c.push(info.temp_c);
    data.wind_kph.push(info.wind_kph);
    data.wind_dir.push(info.wind_dir);
    data.wind_degree.push(info.wind_degree);
    data.humidity.push(info.humidity);
    data.precip_mm.push(info.precip_mm);
    data.vis_km.push(info.vis_km);
}

// User feature 1, return all locations name lat long and weather info
const locationsWIthWeather = async function(res){
    let locations = await schemas.Location.find().select('_id locName latitude longitude').lean().exec();  

    url = "http://api.weatherapi.com/v1/current.json?key=9035794a7a4444e99da32445220105&q=";
    for (loc of locations){
        let weather_info = await weatherRequest(url + loc.locName);
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
    res.send(locations);
}

const searchLocations = async function(res, field, key1, key2 = undefined){
    let locations = [];
     
    if (key2 == undefined){
        // partial search
        locations = await schemas.Location.find({locName: { $regex:  ".*" + key1 + ".*", $options: 'i' } }).select('_id locName latitude longitude').lean().exec();  
    }else{
        if (key1 > key2){
            [key1, key2] = [key2, key1];
        }
        locations = await schemas.Location.find({[field]: { $gte: key1, $lte: key2 } }).select('-_id locName latitude longitude').lean().exec();
    }
    console.log("Locations: ");
    console.log( locations);
    res.send(locations);
}


// estr feature 1, return weather info in the past 5 days of the same hour 
const weatherHistoryP5d = async function(locName, res){
    let url = "http://api.weatherapi.com/v1/current.json?key=9035794a7a4444e99da32445220105&q=";
    let locInfo = await weatherRequest(url + locName );
    let today = new Date(locInfo.location.localtime);
    let hour = today.getHours();
    today.setDate(today.getDate() - 1);
    let endDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    today.setDate(today.getDate() - 4);
    let startDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    
    let result = {label:[], "data":{temp_c: [], wind_kph: [], wind_dir:[], wind_degree: [], humidity: [], precip_mm: [], vis_km: []}};
    url = "http://api.weatherapi.com/v1/history.json?key=9035794a7a4444e99da32445220105&q=";
    let weather_info = await weatherRequest(url + locName + "&dt=" + startDate + "&end_dt=" + endDate + "&hour=" + hour);
    //console.log(weather_info);

    for (let i = 0; i < 5 ; i++ ){
        result.label.push((today.getMonth()+1)+'.'+today.getDate());
        pushWeather(result.data, weather_info.forecast.forecastday[i].hour[0]);
        today.setDate(today.getDate() + 1);
    }
    res.send(result);
}


// estr feature 1, return weather info in the past 10 hours
const weatherHistoryP10h = async function(locName,  res){
    let url = "http://api.weatherapi.com/v1/current.json?key=9035794a7a4444e99da32445220105&q=";
    let locInfo = await weatherRequest(url + locName );
    let today = new Date(locInfo.location.localtime);
    let hour = today.getHours();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    
    let result = {label:[], "data":{temp_c: [], wind_kph: [],  wind_dir:[], wind_degree: [], humidity: [], precip_mm: [], vis_km: []}};
    url = "http://api.weatherapi.com/v1/history.json?key=9035794a7a4444e99da32445220105&q=";
    let weather_info = await weatherRequest(url + locName + "&dt=" + date );
    //console.log(weather_info);

    if (hour < 10){ // need data from yesterday
        today.setDate(today.getDate() - 1);
        let date_yes = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let weather_info_yes = await weatherRequest(url + locName + "&dt=" + date_yes );
        // [ 14 + hour ,  23 ]
        for (let i = 14 + hour; i < 24 ; i++){
            result.label.push( i +':00');
            pushWeather(result.data, weather_info_yes.forecast.forecastday[0].hour[i]);
        }
    }
    for (let i = Math.max( 0, hour - 10) ; i < hour ; i++ ){
        result.label.push( i +':00');
        pushWeather(result.data, weather_info.forecast.forecastday[0].hour[i]);
    }
    res.send(result);
}

const updateTheme = function( userId, theme, res){
    schemas.User.findOneAndUpdate(
        {_id: userId},
        {preference: theme},
        function (err, response) {
            if (err)
                console.log(err);
            else
                console.log(response);
                res.send("Successful!")
        }
    );
    
}

const getTheme = function( userId, res){
    schemas.User.findOne(
        {_id: userId},
        function (err, response) {
            if (err)
                console.log(err);
            else
                console.log(response);
                res.send(JSON.stringify(response));
        }
    );
    
}

// export function
module.exports = {weatherRequest, locationsWIthWeather, locations, searchLocations, weatherHistoryP5d, weatherHistoryP10h, updateTheme, getTheme};






