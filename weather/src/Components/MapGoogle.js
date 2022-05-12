import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

export class MapGoogle extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        stores: [
          {"locName":"London","latitude":51.52,"longitude":-0.11},
          {"locName":"Hong Kong","latitude":22.28,"longitude":114.15}
        ]
      }
    }
  
    displayMarkers = () => {
      return this.state.stores.map((store, index) => {
        return <Marker key={index} id={index} position={{
         lat: store.latitude,
         lng: store.longitude
       }}
       onClick={() => window.location.pathname = `../info/${store.locName}`} />
      })
    }
  
    render() {
      return (
          <Map
            google={this.props.google}
            zoom={3}
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