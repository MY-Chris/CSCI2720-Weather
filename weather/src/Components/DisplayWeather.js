import React, { Component } from "react";
import "./displayweather.css";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { ToggleButton, Container, Row, Col, Table } from 'react-bootstrap';
import unfavourite from '../images/unfav.png'
import favourite from '../images/favourite.png'
import { GoogleMap, LoadScript } from '@react-google-maps/api';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Past 10 hours',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const chartdata = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [100, 200, 300, 400, 500, 200, 300],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: [200, 500, 200, 100, 800, 600, 700],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};


export class DisplayWeather extends Component{
  //const { data } = props;
  //console.log(data);

  constructor(props) {
    super(props);
    this.state = {data: {
      "location": {
          "name": "London",
          "country": "United Kingdom",
          "lat": 51.52,
          "lon": -0.11,
          "tz_id": "Europe/London",
          "localtime": "2022-05-11 10:47"
      },
      "current": {
          "last_updated": "2022-05-11 10:30",
          "temp_c": 15.0,
          "condition": {
              "text": "Partly cloudy",
              "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
          },
          "wind_kph": 28.1,
          "wind_degree": 230,
          "wind_dir": "SW",
          "precip_mm": 0.0,
          "humidity": 63,
          "cloud": 75,
          "feelslike_c": 13.5,
          "vis_km": 10.0,
          "uv": 4.0
      }
  },
  comments:[
    {id: 1, user: "user1", comment: "user1, London"},
    {id: 2, user: "user2", comment: "user2, London"},
    {id: 3, user: "user3", comment: "user3, London"}
  ],
  favourite: true,
  past10h: {},
  data1: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [100, 200, 300, 400, 500, 200, 300],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: [200, 500, 200, 100, 800, 600, 700],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  },
  past5d: {},
  data2: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [100, 200, 300, 400, 500, 200, 300],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: [200, 500, 200, 100, 800, 600, 700],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  },
  label1: [],
  label2: [],
  loc: {}};
  this.setChecked = this.setChecked.bind(this);
  this.handleFavourite = this.handleFavourite.bind(this);
  this.processform = this.processform.bind(this);
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

  componentDidMount() {
    let cityurl = window.location.pathname;
    let cityinurl = cityurl.substring(cityurl.lastIndexOf('/') + 1);
    let theme = "dark";
    
    let userid = sessionStorage.getItem('userid').toString().substring(1, 25);
    (async () => {
      const data = await fetch(
        "http://localhost:3001/users/theme/" + userid// GET theme path 
      )
      .then((res) => res.json())
      .then((data) => data);
      console.log(data);
      this.setState({theme: data.preference});
      theme = data.preference;
  })();

  
      document.getElementById("displayweather").classList.remove("dark");
      document.getElementById("displayweather").classList.remove("light");
      document.getElementById("displayweather").classList.add(theme);
      document.getElementById("App").classList.remove("dark");
      document.getElementById("App").classList.remove("light");
      document.getElementById("App").classList.add(theme);
console.log("http://localhost:3001/locations/" + cityinurl + "/users/" + userid);
    (async () => {
      const data = await fetch(
        "http://localhost:3001/locations/" + cityinurl + "/users/" + userid
      )
      .then((res) => res.json())
      .then((data) => data);
      console.log(data);
      this.setState({data: data.data});
      let lat = data.data.location.lat;
      let lon = data.data.location.lon;
      let loc = {
        lat: lat,
        lng: lon
      }
      this.setState({loc: loc});
      console.log(loc);
      this.setState({comments: data.comments});
      this.setState({favourite: data.favourite})
    })();
    //console.log(cityinurl);
    
    (async () => {
      //console.log(this.state.data.data);
      const data = await fetch(
        "http://localhost:3001/history/past5days/" + cityinurl
      )
      .then((res) => res.json())
      .then((data) => data);
      console.log(data);
      this.setState({label2: data.label});
    console.log(data.label);
      let label2 = data.label;
    let generatedata2 = {
      labels: label2,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: data.data.temp_c,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Humidity (%)',
          data: data.data.humidity,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Visibility (km)',
          data: data.data.vis_km,
          borderColor: 'rgb(53, 9, 123)',
          backgroundColor: 'rgba(53, 9, 123, 0.5)',
        },
      ],
    };
    console.log(generatedata2);
    this.setState({data2: generatedata2});
    console.log(this.state.data2);
    })();

    (async () => {
      //console.log(this.state.data.data);
      const data = await fetch(
        "http://localhost:3001/history/past10hours/" + cityinurl
      )
      .then((res) => res.json())
      .then((data) => data);
      console.log(data);
      this.setState({label1: data.label});
    console.log(data.label);
      let label1 = data.label;
    let generatedata1 = {
      labels: label1,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: data.data.temp_c,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Humidity (%)',
          data: data.data.humidity,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Wind (km/h)',
          data: data.data.wind_kph,
          borderColor: 'rgb(53, 9, 123)',
          backgroundColor: 'rgba(53, 9, 123, 0.5)',
        },
      ],
    };
    console.log(generatedata1);
    this.setState({data1: generatedata1});
    console.log(this.state.data1);
    })();
  }

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
    console.log(this.state.favourite);
    let status = this.state.favourite ? 0 : 1;
    let cityurl = window.location.pathname;
    let cityinurl = cityurl.substring(cityurl.lastIndexOf('/') + 1);
    //let data = "location=" + cityinurl;
    console.log(cityinurl);
    console.log(status);
    let userid = sessionStorage.getItem('userid').toString().substring(1, 25);
    fetch('http://localhost:3000/locations/' + cityinurl + "/users/" + userid + "/fav/" + status)
        .then((res) => res.text())
        .then((data) => {
          data.replace(/\n/g, "");
          console.log("fetch done!");
        });
  }

  processform(e){
    let content = document.getElementById("new-comment").value;
    console.log(content);
    let cityurl = window.location.pathname;
    let cityinurl = cityurl.substring(cityurl.lastIndexOf('/') + 1);
    //let data = "location=" + cityinurl;
    console.log(cityinurl);

    let userid = sessionStorage.getItem('userid').toString().substring(1, 25);
    let username = sessionStorage.getItem('user').toString();
    username = username.substring(1, username.length - 1);
    console.log("1" + username)
    this.setState({comments: this.state.comments.concat(
      [{_id: userid,
        username: username,
        content: content}])})

    let data = "content="+ content;
        fetch('http://localhost:3001/locations/' + cityinurl + "/users/" + userid, {
            headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
            //mode: 'cors',
            method: 'PUT',
            body: data
        })
        .then(res => res.text())
        .then(data => {
            data.replace(/\n/g, "");
            console.log("put done!");
            //console.log(data);
            // need reloading?
            //window.location.reload(false);
        })
        .catch((error) => {
          console.error('Error:', error);
        });

        //window.location.reload(false);
  }
  

  render(){
    let clat = this.state.data.location.lat;
    let clon = this.state.data.location.lon;
    const mloc = {
      lat: clat,
      lng: clon
    }
    console.log(mloc);
  return (
    <Container>
    <div className="displayweather" id="displayweather">
    <Row>
    <Col>
    <div>
      
        <React.Fragment>
          <div className="maincard maincardbg">
            <span className="cardtitle">
              Weather in {this.state.data.location.name} , {this.state.data.location.country}
              &emsp;&emsp;&emsp;
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
            <img className="weather-icon" src={`http:${this.state.data.current.condition.icon}`} alt="" srcSet="" />
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
                      °,&nbsp;
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
    </Col>
    <Col>
    <div className="comments">
    <section className="grad1 maincardbg">
            <h3 id="heading4" className="text-center" style={{marginTop: 5}}>Comments</h3>
            <i>Please scroll down to see all the comments.&emsp;&emsp;&emsp;</i>
            <div id="comments" className="ScrollStyle"> 
            {this.state.comments.map((data) => {
              //console.log(data);
              return (
                <div key={data._id}>
                  <h5>{data.username}</h5>
                  <p>{data.content}</p>
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
            <button id="addcomment" type="button" className="btn btn-primary" onClick={this.processform} style={{marginBottom: 10}}>Add comment</button>
            </form>
          </section>
            </div>
    </Col>
    </Row>
    <br></br><br></br>

    <Row>
        <Col>
        <div className="map">
        {/*<LoadScript
      googleMapsApiKey="AIzaSyBT7KTEpCi_Suspyvi-2Nqp7BVR2E6zQWM"
    >
        <GoogleMap
        mapContainerStyle={{width: '400px',
        height: '400px'}}
        center={{
          lat: -3.745,
          lng: -38.523
        }}
        zoom={10}
      >
        <></>
      </GoogleMap>
      </LoadScript>*/}
      
            <Map
                  google={this.props.google}
                  zoom={1}
                  style={{
                    width: '80%',
                    height: '50%',
                  }}
                  initialCenter={mloc}
                >
                  {this.displayMarkers()}
                </Map>
            </div>
            </Col>
       </Row> 

       <div className="divchart">
    <Row>
    <div className="chart">
      <Col>
    <Line options={options} data={this.state.data1} />
    </Col>
    <Col>
    <Line options={options} data={this.state.data2} />
    </Col>
    </div>
    </Row> 
</div>
      
    </div>
      </Container>
    
  );
      }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBT7KTEpCi_Suspyvi-2Nqp7BVR2E6zQWM'
})(DisplayWeather);

