import React, { Component } from "react";
import "./displayweather.css";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { ToggleButton, Container, Row, Col, Table } from 'react-bootstrap';
import unfavourite from '../images/unfavourite.png'
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
  labels,
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
  data1: {},
  past5d: {},
  data2: {
    labels,
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
  label2: []};
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

  componentDidMount() {
    let cityurl = window.location.pathname;
    let cityinurl = cityurl.substring(cityurl.lastIndexOf('/') + 1);
    (async () => {
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
      label2,
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
    console.log(generatedata2);
    this.setState({data2: generatedata2});
    console.log(this.state.data2);
    })();

    (async () => {
      const data = await fetch(
        "http://localhost:3001/locations/" + cityinurl + "/users/" + "627be65d731afd1b3293a027"
      )
      .then((res) => res.json())
      .then((data) => data);
      console.log(data);
    })();
    //console.log(cityinurl);
    
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
    fetch('http://localhost:3000/locations/' + cityinurl + "/users/" + "testuserid" + "/fav/" + status)
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

    let data = "content="+ content;
        fetch('http://localhost:3001/locations/' + cityinurl + "/users/" + "627be65d731afd1b3293a027", {
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
  }
  

  render(){

  return (
    <Container>
    <div>
    <Row>
    <Col>
    <div className="displayweather">
      
        <React.Fragment>
          <div className="maincard">
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
    </Col>
    <Col>
    <div className="comments">
    <section id="commentsSec" className="grad1">
            <h3 id="heading4" className="text-center" style={{marginTop: 5}}>Comments</h3>
            <i>Please scroll down to see all the comments.&emsp;&emsp;&emsp;</i>
            <div id="comments" className="ScrollStyle"> 
            {this.state.comments.map((data) => {
              return (
                <div key={data.id}>
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
                  zoom={8}
                  style={{
                    width: '80%',
                    height: '50%',
                  }}
                  initialCenter={{ lat: this.state.data.location.lat, lng: this.state.data.location.lon}}
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
    <Line options={options} data={chartdata} />
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

