// import schema
//const Location = require('./server');

const weatherRequest = async (url) => {
    const res = await axios.get(url).then(res => res.data).catch(error =>{console.log(error);});
    console.log(res);
    return res;
};


// User feature 1, return all locations name lat long and weather info
const locations_weather = async function(req,res){
    let locations = await Location.find().select('-_id locName latitude longitude').lean().exec();  
    console.log("Locations: ");
    console.log( locations);

    url = "http://api.weatherapi.com/v1/current.json?key=9035794a7a4444e99da32445220105&q=";
    for (loc of locations){
        let weather_info = await weatherRequest(url + loc.locName );
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
const locations = async function(req,res){
    let locations = await Location.find().select('-_id locName latitude longitude').lean().exec();  
    console.log("Locations: ");
    console.log( locations);
    res.send(locations);
}

// export function
module.exports = {locations_weather, locations};






