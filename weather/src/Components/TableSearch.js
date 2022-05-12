import React, { Component } from "react";
import mockdata from "../data.json";
import SearchField from "react-search-field";
import SelectSearch from 'react-select-search';
import SearchResult from "./SearchResult";

export default class TableSearch extends Component {
    constructor(props) {
      super(props);
      this.state = {value: '', value2: '', field: "", tableData: [], resData: []};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleChange2 = this.handleChange2.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(event) {
      this.setState({value: event.target.value});
      console.log(this.state.value);
    }

    handleChange2(event) {
      this.setState({value2: event.target.value});
      console.log(this.state.value);
    }

    handleRadio(e){
        console.log(e.target.value);
        this.setState({field: e.target.value})
    }
  
    handleSubmit(e) {
      //alert('A name was submitted: ' + this.state.tableData[0]['gender']);
      if(this.state.field == ""){
        window.alert("Please choose a field!")
      }
      else if(this.state.field == "city"){
        (async () => {
          const data = await fetch(
            "http://localhost:3001/locations_search/locName/" + this.state.value
          )
          .then((res) => res.json())
          .then((data) => data);
          console.log(data);
          this.setState({resData: data});
        })();
        console.log(this.state.resData);
        //alert('A name was submitted: ' + this.state.resData);
        //console.log(this.state.value2);
        //event.preventDefault();
        //window.location.pathname = "/locations_search/locName/" + this.state.value;
        document.getElementById("new-comment").value = <SearchResult resultData={this.state.resData} />;
      }
      else{
        (async () => {
          const data = await fetch(
            "http://localhost:3001/locations_search/" + this.state.field + "/" + this.state.value + "/" + this.state.value2
          )
          .then((res) => res.json())
          .then((data) => data);
          console.log(data);
          this.setState({resData: data});
        })();
        console.log(this.state.resData);
      }
    }

    findResult(e){
        console.log(this.state.field);
        for(var i = 0; i < this.state.tableData.length; i++){
            if(this.state.tableData[i][this.state.field] == this.state.value){
                this.state.resData.push(this.state.tableData[i]);
            }
        }
        
        e.preventDefault();
    }
  
    render() {
      let searchbox;
      let formaction;
      if(this.state.field == "latitude" || this.state.field == "longitude"){
        console.log("lat/lon");
        searchbox =
        <div>
        <small>Please input an interval:</small>&emsp;
        <input type="text" value={this.state.value} onChange={this.handleChange} />&emsp;
        <input type="text" value={this.state.value2} onChange={this.handleChange2} />
        </div>;
        formaction = "/locations_search/" + this.state.field + "/" + this.state.value + "/" + this.state.value2;
        console.log(formaction)
      }
      else{
        searchbox =
        <div>
        <small>Please input a city:</small>&emsp;
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        </div>
        formaction = "/locations_search/locName/" + this.state.value;
      }

      return (
        <div>
            <br></br>

        <form action={formaction}>           
            {searchbox}
            <input type="button" value="Submit" onClick={(e) => this.handleSubmit(e)}/>
            <p className="notice-start"> Please select a search field:</p>
            <div className="option">
                <input className = "radio" type="radio" name="search_type" value="city" onChange={(e) => this.handleRadio(e)} required />
                <label> Search by City Name</label>
            </div>
            <div className="option">
                <input className = "radio" type="radio" name="search_type" value="latitude" onChange={(e) => this.handleRadio(e)} required />
                <label> Search by Latitude Interval</label>
            </div>
            <div className="option">
                <input className = "radio" type="radio" name="search_type" value="longitude" onChange={(e) => this.handleRadio(e)} required />
                <label> Search by Longitude Interval</label>
            </div>
          
        </form>
        <div id="searchres"></div>
        
        </div>
      );
    }
  };
