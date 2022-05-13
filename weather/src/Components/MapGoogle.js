import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import {
    Link,
} from "react-router-dom";



export class MapGoogle extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        stores: []
      };
      
    }

    componentDidMount() {
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
       }}
                       // onClick={routeChange(`../info/${store.locName}`)}
       onClick={() => window.location.pathname = `../info/${store.locName}`}
          ></Marker>
            {/*<Link as={Link} to={`../info/${store.locName}`}></Link>*/}

      })
    }
  
    render() {
      return (
          <Map
            google={this.props.google}
            zoom={2}
            style={{
              width: '100%',
              height: '100%',
            }}
            initialCenter={{ lat: 47.444, lng: -122.176}}
          >
            {this.displayMarkers()}
          </Map>
      );
    }
  }

  export default GoogleApiWrapper({
    apiKey: 'AIzaSyBT7KTEpCi_Suspyvi-2Nqp7BVR2E6zQWM'
  })(MapGoogle);