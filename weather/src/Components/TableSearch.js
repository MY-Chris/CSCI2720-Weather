import React, { Component } from "react";
import mockdata from "../data.json";
import SearchField from "react-search-field";
import SelectSearch from 'react-select-search';
import SearchResult from "./SearchResult";

export default class TableSearch extends Component {
    constructor(props) {
      super(props);
      this.state = {value: '', value2: '', field: "", tableData: mockdata, resData: []};
  
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
      for(var i = 0; i < this.state.tableData.length; i++){
        if(this.state.tableData[i][this.state.field] == this.state.value){
            //console.log(this.state.tableData[i]);
            this.state.resData.push(this.state.tableData[i]);
        }
      };
      //alert('A name was submitted: ' + this.state.resData);
      //console.log(this.state.value2);
      //event.preventDefault();
      if(this.state.field == ""){
        window.alert("Please choose a field!")
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
      if(this.state.field == "latitude" || this.state.field == "longitude"){
        console.log("lat/lon");
        searchbox =
        <div>
        <small>Please input an interval:</small>&emsp;
        <input type="text" value={this.state.value} onChange={this.handleChange} />&emsp;
        <input type="text" value={this.state.value2} onChange={this.handleChange2} />
        </div>
      }
      else{
        searchbox =
        <div>
        <small>Please input a name:</small>&emsp;
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        </div>
      }

      return (
        <div>
            <br></br>

        <form>           
            {searchbox}
            <input type="button" value="Submit" onClick={(e) => this.handleSubmit(e)}/>
            <p className="notice-start"> Please select a search field:</p>
            <div className="option">
                <input className = "radio" type="radio" name="search_type" value="city" onChange={(e) => this.handleRadio(e)} required />
                <label> Search by City Name</label>
            </div>
            <div className="option">
                <input className = "radio" type="radio" name="search_type" value="country" onChange={(e) => this.handleRadio(e)} required />
                <label> Search by Country</label>
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
        
        <SearchResult resultData={this.state.resData} />
        </div>
      );
    }
  };
