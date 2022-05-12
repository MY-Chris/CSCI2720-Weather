import React, { Component } from "react";
import "./displayweather.css";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { ToggleButton } from 'react-bootstrap';
import unfavourite from '../images/unfavourite.png'
import favourite from '../images/favourite.png'

export class DisplayWeather extends Component{
  //const { data } = props;
  //console.log(data);

  constructor(props) {
    super(props);
    this.state = {data: {
      "location": {
          "name": "London",
          "region": "City of London, Greater London",
          "country": "United Kingdom",
          "lat": 51.52,
          "lon": -0.11,
          "tz_id": "Europe/London",
          "localtime_epoch": 1652262429,
          "localtime": "2022-05-11 10:47"
      },
      "current": {
          "last_updated_epoch": 1652261400,
          "last_updated": "2022-05-11 10:30",
          "temp_c": 15.0,
          "temp_f": 59.0,
          "is_day": 1,
          "condition": {
              "text": "Partly cloudy",
              "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
              "code": 1003
          },
          "wind_mph": 17.4,
          "wind_kph": 28.1,
          "wind_degree": 230,
          "wind_dir": "SW",
          "pressure_mb": 1009.0,
          "pressure_in": 29.8,
          "precip_mm": 0.0,
          "precip_in": 0.0,
          "humidity": 63,
          "cloud": 75,
          "feelslike_c": 13.5,
          "feelslike_f": 56.4,
          "vis_km": 10.0,
          "vis_miles": 6.0,
          "uv": 4.0,
          "gust_mph": 15.9,
          "gust_kph": 25.6
      }
  },
  comments:[
    {user: "user1", comment: "user1, London"},
    {user: "user2", comment: "user2, London"},
    {user: "user3", comment: "user3, London"}
  ],
  favourite: true};
  this.setChecked = this.setChecked.bind(this);
  this.handleFavourite = this.handleFavourite.bind(this);
  }

  /*
  APIKEY = "7fbc8f2830a24fa8980134200221104";
  weatherData(e) {
    e.preventDefault();

    const data = fetch(
      //`http://api.weatherapi.com/v1/current.json?key=${APIKEY}&q=${this.props.city}&aqi=no`
      `http://api.weatherapi.com/v1/current.json?key=7fbc8f2830a24fa8980134200221104&q=London&aqi=no`
    )
      .then((res) => res.json())
      .then((data) => data);
      console.log(data);
      this.setState({data: data});
  }
  */

  //iconurl = data.current.condition.icon.substring(2);

  displayMarkers = () => {
      return <Marker position={{
       lat: this.state.data.location.lat,
       lng: this.state.data.location.lon
     }}
     onClick={() => console.log("You clicked me!")} />
    }

  setChecked(e){
    console.log(e.currentTarget.checked);
    this.setState({favourite: e.currentTarget.checked});
    console.log(this.state.favourite)
  }

  handleFavourite(e){
    this.setState({favourite: !this.state.favourite});
    console.log(this.state.favourite)
  }
  

  render(){
  return (
    <div>
    <div className="displayweather">
      
        <React.Fragment>
          <div className="maincard">
            <span className="cardtitle">
              Weather in {this.state.data.location.name} , {this.state.data.location.country}
              &emsp;
              {/*
                <ToggleButton
                  className="mb-2"
                  id="toggle-check"
                  type="checkbox"
                  variant="outline-warning"
                  checked={this.state.favourite}
                  value="1"
                  onChange={(e) => this.setChecked(e)}
                >
                  Checked
                </ToggleButton>
             */}
      
      <button onClick={this.handleFavourite}>{this.state.favourite? <img src={favourite} width={25} /> 
      : <img src={unfavourite} width={25} />}</button>
            </span>
            
            <span className="cardsubtitle">
              Current time of time zone {this.state.data.location.tz_id}: {this.state.data.location.localtime}
            </span>
          
            <h1>
              {" "}
              {this.state.data.current.temp_c}
              {/*<sup>o</sup>*/}
              °C
            </h1>&emsp;
            {/*<span className="weather-main">{data.weather[0].main}</span>8*/}
            <img className="weather-icon" src={`http:${this.state.data.current.condition.icon}`} alt="" srcset="" />
            <span className="weather-description">
              {" "}
              {this.state.data.current.condition.text}
            </span>
            <span className="cardnote">
            
              Last Updated: {this.state.data.current.last_updated}
            </span>
          </div>
          <br></br>
          <div className="weatherdetails">
            <div className="section1">
              <table>
                <tr>
                  <td>
                    <h4>Feels Like</h4>
                  </td>
                  <td>
                    <span>
                      {this.state.data.current.feelslike_c}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h4>Humidity</h4>
                  </td>
                  <td>
                    <span>{this.state.data.current.humidity} %</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h4>Precip</h4>
                  </td>
                  <td>
                    <span>{this.state.data.current.precip_mm} hPa</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h4>Visibility</h4>
                  </td>
                  <td>
                    <span>{this.state.data.current.vis_km} Km</span>
                  </td>
                </tr>
              </table>
            </div>

            <div className="section2">
              <table>
                <tr>
                  <td>
                    <h4>Wind</h4>
                  </td>
                  <td>
                    <span>{this.state.data.current.wind_kph} km/hr</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h4>Wind Direction</h4>
                  </td>
                  <td>
                    <span>
                      {this.state.data.current.wind_degree}
                      ° deg,&nbsp;
                      {this.state.data.current.wind_dir}
                    </span>
                  </td>
                </tr>
                
                <tr>
                  <td>
                    <h4>Cloud</h4>
                  </td>
                  <td>
                    <span>
                      {this.state.data.current.cloud}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h4>UV</h4>
                  </td>
                  <td>
                    <span>
                      {this.state.data.current.uv}
                    </span>
                  </td>
                </tr>
                
              </table>
            </div>
          </div>
        </React.Fragment>

    </div>
    <br></br>
    <div className="container">
    <section id="commentsSec" className="col-md-8 grad1">
            <h3 id="heading4" className="text-center">Comments</h3>
            <i>Please scroll down to see all the comments.&emsp;&emsp;&emsp;</i>
            <div id="comments" className="ScrollStyle"> 
            {this.state.comments.map((data) => {
              return (
                <div>
                  <h5>{data.user}</h5>
                  <p>{data.comment}</p>
                </div>
              );
            })}
            </div>
            
            <h6>Add your comment:</h6>
            <form>
            <div className="mb-3">
              <textarea className="form-control" id="new-comment" rows="2"></textarea>
              <div id="validationServerContentFeedback" className="invalid-feedback">
                Comment cannot be empty.
              </div>
            </div>
            <button id="addcomment" type="button" className="btn btn-primary" onclick="processform()">Add comment</button>
            </form>
          </section>
            </div>
        <br></br>
        
        <div className="container">
            <Map
                  google={this.props.google}
                  zoom={8}
                  style={{
                    width: '60%',
                    height: '40%',
                  }}
                  initialCenter={{ lat: this.state.data.location.lat, lng: this.state.data.location.lon}}
                >
                  {this.displayMarkers()}
                </Map>
            </div>
          
    </div>
  );
      }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBT7KTEpCi_Suspyvi-2Nqp7BVR2E6zQWM'
})(DisplayWeather);

