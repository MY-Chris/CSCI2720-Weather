import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import {
    Link,
} from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap';
import "./table.css"


export class MapGoogle extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        stores: []
      };
      
    }

  

    componentDidMount() {
      let theme = "dark";
      let userid = sessionStorage.getItem('userid').toString().substring(1, 25);
      (async () => {
        const data = await fetch(
          "http://localhost:80/users/theme/" + userid// GET theme path 
        )
        .then((res) => res.json())
        .then((data) => data);
        console.log(data);
        this.setState({theme: data.preference}, ()=>{console.log(this.state.theme)});
        theme = data.preference;
        console.log(theme);
        document.getElementById("table").classList.remove("dark");
        document.getElementById("table").classList.remove("light");
        document.getElementById("table").classList.add(theme);
        console.log(document.getElementById("App").classList);
        document.getElementById("App").classList.remove("dark");
        document.getElementById("App").classList.remove("light");
        document.getElementById("App").classList.add(theme);
    })();

      (async () => {
        const data = await fetch(
          "http://localhost:80/locations"
        )
        .then((res) => res.json())
        .then((data) => data);
        console.log(data);
        this.setState({stores: data});
      })();
    }
  
    displayMarkers = () => {


      return this.state.stores.map((store, index) => {
        return <Marker key={index} id={index} position={{
         lat: store.latitude,
         lng: store.longitude
       }} label= {{
        text: store.locName,
        color: "#FFF9E9",
        fontWeight: "bold"
      }}
                       // onClick={routeChange(`../info/${store.locName}`)}
       //onClick={() => window.location.pathname = `../info/${store.locName}`}
          ></Marker>
            {/*<Link as={Link} to={`../info/${store.locName}`}></Link>*/}

      })
    }
  
    render() {
      return (
        <Container>
          <Row>
          <div className="table_container" id="table_container">
          <small>
        Scroll to see more cities.
      </small>
          <table className="table" id="table">
        <thead>
          <tr>
            <th>
              Cities:
            </th>
          </tr>
        </thead>
        
        <tbody>

      
          <tr>
          {this.state.stores.map((data) => {
              console.log(data);

                return (<td key={data._id}>
                  <Link as={Link} to={`/info/${data.locName}`}>{data.locName}</Link>
                        </td>)
  
            })}
          </tr>
        
        
    </tbody>
    </table>
    </div>
    </Row>
    <Row>
          <Map
            google={this.props.google}
            zoom={2}
            style={{
              width: '85%',
              height: '65%',
            }}
            initialCenter={{ lat: 47.444, lng: -122.176}}
          >
            {this.displayMarkers()}
          </Map>
          </Row>
          
        </Container>
      );
    }
  }

  export default GoogleApiWrapper({
    apiKey: 'AIzaSyBT7KTEpCi_Suspyvi-2Nqp7BVR2E6zQWM'
  })(MapGoogle);