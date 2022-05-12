// import schema
const schemas = require('./schema.js');
const axios = require('axios');

const weatherRequest = async (url) => {
    const res = await axios.get(url).then(res => res.data).catch(error =>{console.log(error);});
    //console.log(res);
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
    //console.log("Locations: ");
    //console.log( locations);
    res.send(locations);
}

const searchLocations = async function(res, field, key1, key2 = undefined){
    let locations = [];
     
    if (key2 == undefined){
        // add partial search
        locations = await schemas.Location.find({locName: key1}).select('_id locName latitude longitude').lean().exec();  
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

// this function is incomplete
const weatherHistoryP5d = async function(locName, res){
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let hour = today.getHours();
    let result = {label:[], data:[]};

    url = "http://api.weatherapi.com/v1/history.json?key=9035794a7a4444e99da32445220105&q=";
    for (let i = 0; i < 5 ; i++ ){
        today.setDate(today.getDate() - 1);
        date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let weather_info = await weatherRequest(url + locName + "&dt=" + date + "&hour=" + hour);
        result.label.push((today.getMonth()+1)+'.'+today.getDate());
        result.data.push({
            temp_c : weather_info.forecast.forecastday[0].hour[0].temp_c,
            wind_kph : weather_info.forecast.forecastday[0].hour[0].wind_kph,
            wind_dir : weather_info.forecast.forecastday[0].hour[0].wind_dir,
            wind_degree : weather_info.forecast.forecastday[0].hour[0].wind_degree,
            humidity : weather_info.forecast.forecastday[0].hour[0].humidity,
            precip_mm : weather_info.forecast.forecastday[0].hour[0].precip_mm,
            vis_km : weather_info.forecast.forecastday[0].hour[0].vis_km
        })
    }
    res.send(result);
}

const weatherHistoryP10h = async function(locName, res){
    
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
module.exports = {weatherRequest, locationsWIthWeather, locations, searchLocations, weatherHistoryP5d, weatherHistoryP10h};






